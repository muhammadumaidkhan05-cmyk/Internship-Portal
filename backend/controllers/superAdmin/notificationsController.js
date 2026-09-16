const Notification = require("../../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Notification.countDocuments();
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      ok: true,
      data: notifications.map(n => ({ id: n._id, title: n.title, category: n.type, isRead: n.isRead, createdAt: n.createdAt })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!notification) return res.status(404).json({ ok: false, error: "Not found" });
    res.json({ ok: true, data: { id: notification._id, ...notification.toObject() } });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ ok: true, message: "All marked as read" });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};
