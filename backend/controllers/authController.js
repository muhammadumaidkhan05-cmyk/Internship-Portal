const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ============================================================
// REGISTER
// ============================================================
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "program-manager",
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed.",
      error: error.message,
    });
  }
};

// ============================================================
// LOGIN
// ============================================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (user.status !== "Active") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed.",
      error: error.message,
    });
  }
};

// ============================================================
// CURRENT USER
// ============================================================
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user || null,
  });
};

// ============================================================
// GET ALL MENTORS
// ============================================================
const getMentors = async (req, res) => {
  try {
    const mentors = await User.find({
      role: "mentor",
    })
      .select(
        "name email role status specialization phone bio createdAt updatedAt"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: mentors.length,
      mentors,
    });
  } catch (error) {
    console.error("Get mentors error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch mentors.",
      error: error.message,
    });
  }
};

// ============================================================
// CREATE MENTOR
// ============================================================
const createMentor = async (req, res) => {
  try {
    const {
      name,
      specialization,
      phone,
      bio,
      status,
    } = req.body;

    // Name is required
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Mentor name is required.",
      });
    }

    // Generate an internal email because User model requires email
    const generatedEmail = `mentor_${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}@msnacademy.local`;

    // Generate an internal password because User model requires password
    const generatedPassword = `Mentor@${Date.now()}${Math.floor(
      Math.random() * 100
    )}`;

    const hashedPassword = await bcrypt.hash(
      generatedPassword,
      10
    );

    const mentor = await User.create({
      name: name.trim(),
      email: generatedEmail,
      password: hashedPassword,
      role: "mentor",
      status: status || "Active",
      specialization: specialization?.trim() || "",
      phone: phone?.trim() || "",
      bio: bio?.trim() || "",
    });

    return res.status(201).json({
      success: true,
      message: "Mentor created successfully.",
      mentor: {
        id: mentor._id,
        name: mentor.name,
        email: mentor.email,
        role: mentor.role,
        status: mentor.status,
        specialization: mentor.specialization,
        phone: mentor.phone,
        bio: mentor.bio,
        createdAt: mentor.createdAt,
      },
    });
  } catch (error) {
    console.error("Create mentor error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create mentor.",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE MENTOR
// ============================================================
const updateMentor = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      specialization,
      phone,
      bio,
      status,
    } = req.body;

    const mentor = await User.findOne({
      _id: id,
      role: "mentor",
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found.",
      });
    }

    // Name
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Mentor name cannot be empty.",
        });
      }

      mentor.name = name.trim();
    }

    // Specialization
    if (specialization !== undefined) {
      mentor.specialization = specialization.trim();
    }

    // Phone
    if (phone !== undefined) {
      mentor.phone = phone.trim();
    }

    // Bio
    if (bio !== undefined) {
      mentor.bio = bio.trim();
    }

    // Status
    if (status !== undefined) {
      if (!["Active", "Inactive"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be Active or Inactive.",
        });
      }

      mentor.status = status;
    }

    mentor.role = "mentor";

    await mentor.save();

    return res.status(200).json({
      success: true,
      message: "Mentor updated successfully.",
      mentor: {
        id: mentor._id,
        name: mentor.name,
        email: mentor.email,
        role: mentor.role,
        status: mentor.status,
        specialization: mentor.specialization,
        phone: mentor.phone,
        bio: mentor.bio,
        updatedAt: mentor.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update mentor error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update mentor.",
      error: error.message,
    });
  }
};

// ============================================================
// DEACTIVATE MENTOR
// ============================================================
const deactivateMentor = async (req, res) => {
  try {
    const { id } = req.params;

    const mentor = await User.findOneAndUpdate(
      {
        _id: id,
        role: "mentor",
      },
      {
        status: "Inactive",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Mentor deactivated successfully.",
      mentor: {
        id: mentor._id,
        name: mentor.name,
        email: mentor.email,
        role: mentor.role,
        status: mentor.status,
        specialization: mentor.specialization,
        phone: mentor.phone,
        bio: mentor.bio,
      },
    });
  } catch (error) {
    console.error("Deactivate mentor error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate mentor.",
      error: error.message,
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================
module.exports = {
  register,
  login,
  getMe,
  getMentors,
  createMentor,
  updateMentor,
  deactivateMentor,
};