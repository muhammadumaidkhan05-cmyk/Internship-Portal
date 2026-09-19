const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { ROLES, ROLE_VALUES, ROLE_HOME, normalizeRole } = require("../constants/roles");
const { sendPasswordResetEmail } = require("../services/mailService");

// ============================================================
// PUBLIC SELF-REGISTRATION
// Interns register themselves. Staff roles are created by the
// Super Admin / Program Manager, so only the roles listed here
// may be chosen on the public registration form.
// ============================================================

const SELF_REGISTERABLE_ROLES = [
  ROLES.INTERN,
  ROLES.MENTOR,
  ROLES.PROJECT_MANAGER,
  ROLES.PROGRAM_MANAGER,
];

const toPublicUser = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  track: user.track,
  cohort: user.cohort,
  department: user.department,
  phone: user.phone,
  bio: user.bio,
  avatar: user.avatar,
  mentorId: user.mentorId,
  teamId: user.teamId,
  teamName: user.teamName,
  projectId: user.projectId,
  projectName: user.projectName,
  createdAt: user.createdAt,
  redirectTo: ROLE_HOME[user.role] || "/login",
});

// ============================================================
// REGISTER
// ============================================================
const register = async (req, res) => {
  try {
    const { name, email, password, role, track, cohort, phone, department } =
      req.body;

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

    const requestedRole = normalizeRole(role) || ROLES.INTERN;

    if (!SELF_REGISTERABLE_ROLES.includes(requestedRole)) {
      return res.status(403).json({
        success: false,
        message: "That role cannot be created from the registration form.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

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
      role: requestedRole,
      track: (track || "").trim(),
      cohort: (cohort || "").trim(),
      phone: (phone || "").trim(),
      department: (department || "").trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. You can now sign in.",
      user: toPublicUser(user),
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
// The login form carries a role selector. When a role is sent
// it must match the stored role, which stops a user from
// signing into the wrong portal by accident.
// ============================================================
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password"
    );

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

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const storedRole = normalizeRole(user.role) || ROLES.INTERN;

    if (role) {
      const selectedRole = normalizeRole(role);

      if (!selectedRole || !ROLE_VALUES.includes(selectedRole)) {
        return res.status(400).json({
          success: false,
          message: "Please choose a valid role.",
        });
      }

      if (selectedRole !== storedRole) {
        return res.status(403).json({
          success: false,
          message: "This account is not registered for the selected role.",
        });
      }
    }

    if (user.role !== storedRole) {
      user.role = storedRole;
      await user.save();
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: toPublicUser(user),
      redirectTo: ROLE_HOME[storedRole],
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
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated.",
    });
  }

  return res.status(200).json({
    success: true,
    data: toPublicUser(req.user),
  });
};

// ============================================================
// FORGOT PASSWORD
// ============================================================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account was found with that email address.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:5173";

    const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

    const delivery = await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetLink,
    });

    return res.status(200).json({
      success: true,
      message: delivery.sent
        ? "A password reset link has been sent to your email."
        : "Password reset link generated. Email delivery is not configured on this server, so use the link below.",
      emailSent: delivery.sent,
      // Only returned when SMTP is not configured, so the reset
      // flow remains usable in local development.
      resetLink: delivery.sent ? undefined : resetLink,
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to start the password reset.",
      error: error.message,
    });
  }
};

// ============================================================
// RESET PASSWORD
// ============================================================
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "A new password is required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: new Date() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This reset link is invalid or has expired.",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now sign in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset the password.",
      error: error.message,
    });
  }
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
  forgotPassword,
  resetPassword,
  getMentors,
  createMentor,
  updateMentor,
  deactivateMentor,
};