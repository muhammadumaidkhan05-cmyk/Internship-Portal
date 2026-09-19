const Program = require("../../models/Program");

exports.getPrograms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const search = req.query.search;
    const sortField = req.query.sort || "_id";
    const orderDirection = req.query.order === "asc" ? 1 : -1;

    let query = {};
    if (status && status !== "all") query.status = status;
    if (search && search.trim() !== "") {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { programManager: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Program.countDocuments(query);
    const programs = await Program.find(query)
      .sort({ [sortField]: orderDirection })
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      data: programs.map((p) => ({
        id: p._id,
        name: p.name,
        cohortSize: p.cohortSize,
        programManager: p.programManager,
        status: p.status,
        progress: p.progress,
        updatedAt: p.updatedAt,
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

exports.createProgram = async (req, res) => {
  try {
    const newProgram = new Program(req.body);
    await newProgram.save();
    return res.status(201).json({
      success: true,
      message: "Program created successfully.",
      data: {
        id: newProgram._id,
        name: newProgram.name,
        cohortSize: newProgram.cohortSize,
        programManager: newProgram.programManager,
        status: newProgram.status,
        progress: newProgram.progress,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProgram = async (req, res) => {
  try {
    const updated = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: "Program not found." });
    return res.json({
      success: true,
      message: "Program updated successfully.",
      data: {
        id: updated._id,
        name: updated.name,
        cohortSize: updated.cohortSize,
        programManager: updated.programManager,
        status: updated.status,
        progress: updated.progress,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProgram = async (req, res) => {
  try {
    const deleted = await Program.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Program not found." });
    return res.json({
      success: true,
      message: "Program deleted successfully.",
      data: { id: deleted._id },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
