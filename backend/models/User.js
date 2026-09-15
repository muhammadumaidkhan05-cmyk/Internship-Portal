const mongoose = require("mongoose");

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
    },

    track: {
      type: String,
      required: true,
      trim: true,
    },

    cohort: {
      type: String,
      required: true,
      trim: true,
    },

  role: {
  type: String,
  enum: [
    "intern",
    "project_manager",
    "mentor",
    "program_manager",
    "super_admin",
  ],
  default: "intern",
},
    resetPasswordToken: {
  type: String,
},

resetPasswordExpire: {
  type: Date,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);