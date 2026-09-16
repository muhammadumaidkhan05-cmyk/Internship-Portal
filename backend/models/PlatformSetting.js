const mongoose = require("mongoose");

const platformSettingSchema = new mongoose.Schema(
  {
    platformName: {
      type: String,
      default: "MSN Academy | IMP",
      trim: true,
    },
    supportEmail: {
      type: String,
      default: "support@msnacademy.example",
      trim: true,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    sessionTimeoutMinutes: {
      type: Number,
      default: 60,
    },
    allowSignups: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlatformSetting", platformSettingSchema);
