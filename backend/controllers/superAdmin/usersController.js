const User = require("../../models/User");
const AuditLog = require("../../models/AuditLog");

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const role = req.query.role;
    const status = req.query.status;
    const search = req.query.search;
    const sortField = req.query.sort || "_id";
    const orderDirection = req.query.order === "asc" ? 1 : -1;

    let query = {};
    if (role && role !== "all") query.role = role;
    if (status && status !== "all") query.status = { $regex: new RegExp(`^${status}$`, "i") };
    if (search && search.trim() !== "") {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ [sortField]: orderDirection })
      .skip(skip)
      .limit(limit);

    res.json({
      ok: true,
      data: users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role, status: u.status, createdAt: u.createdAt })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    const newUser = new User({ name, email, role, status, password: "temporaryPassword123" });
    await newUser.save();
    
    const audit = new AuditLog({ userName: req.user ? req.user.name : "System", action: "created_user" });
    await audit.save();

    res.status(201).json({
      ok: true,
      data: { id: newUser._id, ...newUser.toObject() },
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updated = await User.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updated) return res.status(404).json({ ok: false, error: "User not found" });

    if (updateData.role) {
      const audit = new AuditLog({ userName: req.user ? req.user.name : "System", action: "updated_role" });
      await audit.save();
    }

    res.json({
      ok: true,
      data: { id: updated._id, ...updated.toObject() },
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ ok: false, error: "User not found" });

    const audit = new AuditLog({ userName: req.user ? req.user.name : "System", action: "deleted_user" });
    await audit.save();

    res.json({
      ok: true,
      data: { id: deleted._id, ...deleted.toObject() },
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};
