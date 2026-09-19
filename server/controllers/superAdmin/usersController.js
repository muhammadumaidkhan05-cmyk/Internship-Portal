const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const AuditLog = require("../../models/AuditLog");

// Map frontend sort key to MongoDB field
const SORT_FIELD_MAP = {
  id: "_id",
  name: "name",
  email: "email",
  role: "role",
  status: "status",
  createdAt: "createdAt",
};

// Normalize status to match the model enum ("Active" / "Inactive")
function normalizeStatus(status) {
  if (!status) return "Active";
  const s = status.toLowerCase();
  if (s === "active") return "Active";
  if (s === "inactive") return "Inactive";
  if (s === "suspended") return "suspended";
  return "Active";
}

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const role = req.query.role;
    const status = req.query.status;
    const search = req.query.search;
    const sortKey = req.query.sort || "id";
    const sortField = SORT_FIELD_MAP[sortKey] || "_id";
    const orderDirection = req.query.order === "asc" ? 1 : -1;

    let query = {};
    if (role && role !== "all") query.role = role;
    if (status && status !== "all") {
      // Match both "Active" and "active" in the DB
      query.status = { $regex: new RegExp(`^${status}$`, "i") };
    }
    if (search && search.trim() !== "") {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ [sortField]: orderDirection })
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      data: users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, role, status, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required." });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(409).json({ success: false, message: "A user with this email already exists." });
    }

    // Always hash the password — never store plaintext
    const rawPassword = password || "TempPass@2026!";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || "intern",
      status: normalizeStatus(status),
    });
    await newUser.save();

    const audit = new AuditLog({
      userName: req.user ? req.user.name : "Super Admin",
      action: "created_user",
    });
    await audit.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email.toLowerCase().trim();
    if (role !== undefined) updateData.role = role;
    if (status !== undefined) updateData.status = normalizeStatus(status);

    const updated = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: "User not found." });

    if (role !== undefined) {
      const audit = new AuditLog({
        userName: req.user ? req.user.name : "Super Admin",
        action: "updated_role",
      });
      await audit.save();
    }

    return res.json({
      success: true,
      message: "User updated successfully.",
      data: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        status: updated.status,
        createdAt: updated.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "User not found." });

    const audit = new AuditLog({
      userName: req.user ? req.user.name : "Super Admin",
      action: "deleted_user",
    });
    await audit.save();

    return res.json({
      success: true,
      message: "User deleted successfully.",
      data: { id: deleted._id },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!id) return res.status(400).json({ success: false, message: "User ID required." });

    const updateData = {};
    if (name && name.trim()) updateData.name = name.trim();
    if (email && email.trim()) updateData.email = email.toLowerCase().trim();

    const updated = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: "User not found." });

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        status: updated.status,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
