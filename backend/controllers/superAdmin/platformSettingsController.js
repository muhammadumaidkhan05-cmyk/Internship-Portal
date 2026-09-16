const PlatformSetting = require("../../models/PlatformSetting");

exports.getSettings = async (req, res) => {
  try {
    let settings = await PlatformSetting.findOne();
    if (!settings) {
      settings = new PlatformSetting();
      await settings.save();
    }
    res.json({ ok: true, data: { id: settings._id, ...settings.toObject() } });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
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
    
    const AuditLog = require("../../models/AuditLog");
    const audit = new AuditLog({ userName: req.user ? req.user.name : "System", action: "updated_settings" });
    await audit.save();

    res.json({ ok: true, data: { id: settings._id, ...settings.toObject() }, message: "Settings updated successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};
