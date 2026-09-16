const RoleMatrix = require("../../models/RoleMatrix");

exports.getRolesMatrix = async (req, res) => {
  try {
    const matrix = await RoleMatrix.find();
    res.json({ ok: true, data: matrix.map(m => ({ id: m._id, roleName: m.roleName, permissions: m.permissions })) });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

exports.updateRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;
    
    const updated = await RoleMatrix.findByIdAndUpdate(id, { permissions }, { new: true });
    if (!updated) return res.status(404).json({ ok: false, error: "Role not found" });

    res.json({ ok: true, data: { id: updated._id, ...updated.toObject() }, message: "Permissions updated" });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};
