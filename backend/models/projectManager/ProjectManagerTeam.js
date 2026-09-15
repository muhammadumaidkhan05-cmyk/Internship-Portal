const mongoose = require("mongoose");

const projectManagerTeamSchema =
  new mongoose.Schema(
    {
      teamName: {
        type: String,
        required: true,
        trim: true,
      },

      memberCount: {
        type: Number,
        required: true,
        min: 1,
      },

      mentor: {
        type: String,
        required: false,
        default: "Unassigned",
        trim: true,
      },

      project: {
        type: String,
        default: "Unassigned",
        trim: true,
      },

      department: {
        type: String,
        default: "Development",
        trim: true,
      },

      startDate: {
        type: Date,
        default: null,
      },

      endDate: {
        type: Date,
        default: null,
      },

      status: {
        type: String,
        enum: [
          "Active",
          "Pending",
          "Completed",
          "Inactive",
        ],
        default: "Active",
      },

      technologies: {
        type: [String],
        default: [],
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },

      progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      // Legacy fields
      name: {
        type: String,
        default: "",
      },

      email: {
        type: String,
        default: "",
      },

      role: {
        type: String,
        default: "",
      },

      avatar: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "ProjectManagerTeam",
    projectManagerTeamSchema
  );