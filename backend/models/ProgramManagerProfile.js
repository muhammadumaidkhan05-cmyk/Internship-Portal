
const mongoose = require("mongoose");

// ============================================================
// PROGRAM MANAGER PROFILE SCHEMA
// ============================================================

const programManagerProfileSchema =
  new mongoose.Schema(
    {
      // --------------------------------------------------------
      // BASIC INFORMATION
      // --------------------------------------------------------

      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      // --------------------------------------------------------
      // ROLE INFORMATION
      // --------------------------------------------------------

      role: {
        type: String,
        default: "Program Manager",
        trim: true,
      },

      department: {
        type: String,
        default:
          "Internship Program Management",
        trim: true,
      },

      location: {
        type: String,
        default: "MSN Academy",
        trim: true,
      },

      // --------------------------------------------------------
      // BIO
      // --------------------------------------------------------

      bio: {
        type: String,
        default: "",
        trim: true,
      },

      // --------------------------------------------------------
      // JOINED DATE
      // --------------------------------------------------------

      joinedDate: {
        type: Date,
        default: Date.now,
      },

      // --------------------------------------------------------
      // ACCOUNT STATUS
      // --------------------------------------------------------

      status: {
        type: String,
        enum: [
          "Active",
          "Inactive",
        ],
        default: "Active",
      },

      // --------------------------------------------------------
      // PROFILE OWNERSHIP
      // --------------------------------------------------------
      // We keep one fixed identifier for the Program Manager
      // profile so that GET / UPDATE / DELETE always work
      // with the same database record.

      profileKey: {
        type: String,
        unique: true,
        default: "program-manager",
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );

// ============================================================
// EXPORT MODEL
// ============================================================

module.exports =
  mongoose.model(
    "ProgramManagerProfile",
    programManagerProfileSchema
  );

