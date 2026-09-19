const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "login",
        "logout",
        "approved_scrum",
        "created_user",
        "updated_role",
        "deleted_user",
        "updated_settings",
        "exported_audit_log",
      ],
    },
    ipAddress: {
      type: String,
      default: "",
    },
    device: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
