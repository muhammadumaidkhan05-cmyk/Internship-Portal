const AuditLog = require("../../models/AuditLog");

exports.getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const action = req.query.action;
    const search = req.query.search;
    const sortField = req.query.sort || "createdAt";
    const orderDirection = req.query.order === "asc" ? 1 : -1;

    let query = {};
    if (action && action !== "all") query.action = action;
    if (search && search.trim() !== "") {
      query.userName = { $regex: search, $options: "i" };
    }

    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .sort({ [sortField]: orderDirection })
      .skip(skip)
      .limit(limit);

    res.json({
      ok: true,
      data: logs.map(l => ({ id: l._id, userName: l.userName, action: l.action, ipAddress: l.ipAddress, device: l.device, timestamp: l.createdAt })),
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

exports.exportAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 });
    
    // In a real app we'd stream a CSV
    res.json({ ok: true, data: logs });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};
