const mongoose = require("mongoose");

const {
  ROLES,
  ROLE_VALUES,
  normalizeRole,
} = require("../constants/roles");

// ============================================================
// UNIFIED USER SCHEMA
// ============================================================

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ROLE_VALUES,
      default: ROLES.INTERN,
      index: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    // ==========================================================
    // ONBOARDING
    // ==========================================================

    track: {
      type: String,
      default: "",
      trim: true,
    },

    cohort: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================================
    // SHARED PROFILE FIELDS
    // ==========================================================

    department: {
      type: String,
      default: "",
      trim: true,
    },

    specialization: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    avatar: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================================
    // INTERN ASSIGNMENT GRAPH
    // ==========================================================

    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    projectManagerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectManagerTeam",
      default: null,
      index: true,
    },

    teamName: {
      type: String,
      default: "",
      trim: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectManagerProject",
      default: null,
      index: true,
    },

    projectName: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================================
    // PASSWORD RESET
    // ==========================================================

    resetPasswordToken: {
      type: String,
      default: null,
      index: true,
    },

    resetPasswordExpire: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ============================================================
// NORMALISE ROLE AND STATUS
// ============================================================

userSchema.pre("validate", function normaliseRoleAndStatus() {
  const normalized = normalizeRole(this.role);

  if (normalized) {
    this.role = normalized;
  }

  if (typeof this.status === "string") {
    const lowered = this.status.toLowerCase();

    if (lowered === "active") {
      this.status = "Active";
    } else if (lowered === "inactive" || lowered === "suspended") {
      this.status = "Inactive";
    }
  }
});

module.exports = mongoose.model("User", userSchema);