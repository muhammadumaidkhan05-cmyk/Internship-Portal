const mongoose = require("mongoose");

const dailyScrumSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    yesterday: {
      type: String,
      required: true,
    },

    today: {
      type: String,
      required: true,
    },

    blockers: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DailyScrum", dailyScrumSchema);