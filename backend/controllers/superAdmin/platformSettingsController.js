const PlatformSetting = require("../../models/PlatformSetting");
const AuditLog = require("../../models/AuditLog");

exports.getSettings = async (req, res) => {
  try {
    let settings = await PlatformSetting.findOne();
    if (!settings) {
      settings = new PlatformSetting();
      await settings.save();
    }
    return res.json({
      success: true,
      data: {
        id: settings._id,
        platformName: settings.platformName,
        supportEmail: settings.supportEmail,
        maintenanceMode: settings.maintenanceMode,
        sessionTimeoutMinutes: settings.sessionTimeoutMinutes,
        allowSignups: settings.allowSignups,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const updateData = req.body;
    let settings = await PlatformSetting.findOne();

    if (settings) {
      settings = await PlatformSetting.findByIdAndUpdate(settings._id, updateData, { new: true });
    } else {
      settings = new PlatformSetting(updateData);
      await settings.save();
    }

    const audit = new AuditLog({
      userName: req.user ? req.user.name : "Super Admin",
      action: "updated_settings",
    });
    await audit.save();

    return res.json({
      success: true,
      message: "Settings updated successfully.",
      data: {
        id: settings._id,
        platformName: settings.platformName,
        supportEmail: settings.supportEmail,
        maintenanceMode: settings.maintenanceMode,
        sessionTimeoutMinutes: settings.sessionTimeoutMinutes,
        allowSignups: settings.allowSignups,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
