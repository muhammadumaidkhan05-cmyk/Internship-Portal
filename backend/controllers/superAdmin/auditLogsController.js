const AuditLog = require("../../models/AuditLog");

exports.getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const action = req.query.action;
    // Frontend sends "user" param for name search
    const user = req.query.user;
    const from = req.query.from;
    const to = req.query.to;
    const orderDirection = req.query.order === "asc" ? 1 : -1;

    let query = {};

    if (action && action !== "all") query.action = action;

    if (user && user.trim() !== "") {
      query.userName = { $regex: user.trim(), $options: "i" };
    }

    // Date range filter
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) {
        // Include the entire "to" day (up to midnight)
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = toDate;
      }
    }

    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .sort({ createdAt: orderDirection })
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      data: logs.map((l) => ({
        id: l._id,
        userName: l.userName,
        action: l.action,
        ipAddress: l.ipAddress,
        device: l.device,
        timestamp: l.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportAuditLogs = async (req, res) => {
  try {
    // Respect same filters as getAuditLogs for accurate export
    const action = req.query.action;
    const user = req.query.user;
    const from = req.query.from;
    const to = req.query.to;
    const limit = Math.min(parseInt(req.query.limit) || 10000, 10000);

    let query = {};
    if (action && action !== "all") query.action = action;
    if (user && user.trim() !== "") query.userName = { $regex: user.trim(), $options: "i" };
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = toDate;
      }
    }

    const logs = await AuditLog.find(query).sort({ createdAt: -1 }).limit(limit);

    return res.json({
      success: true,
      data: logs.map((l) => ({
        id: l._id,
        userName: l.userName,
        action: l.action,
        ipAddress: l.ipAddress,
        device: l.device,
        timestamp: l.createdAt,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
