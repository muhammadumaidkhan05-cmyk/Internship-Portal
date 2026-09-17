const RoleMatrix = require("../../models/RoleMatrix");

// Default rows seeded if collection is empty
const DEFAULT_MATRIX = [
  {
    roleName: "Super Admin",
    permissions: {
      view_dashboard: true,
      manage_users: true,
      manage_roles: true,
      manage_programs: true,
      view_audit_logs: true,
      export_audit_logs: true,
      manage_settings: true,
      manage_notifications: true,
    },
  },
  {
    roleName: "Program Manager",
    permissions: {
      view_dashboard: true,
      manage_users: false,
      manage_roles: false,
      manage_programs: true,
      view_audit_logs: false,
      export_audit_logs: false,
      manage_settings: false,
      manage_notifications: true,
    },
  },
  {
    roleName: "Project Manager",
    permissions: {
      view_dashboard: true,
      manage_users: false,
      manage_roles: false,
      manage_programs: false,
      view_audit_logs: false,
      export_audit_logs: false,
      manage_settings: false,
      manage_notifications: true,
    },
  },
];

exports.getRolesMatrix = async (req, res) => {
  try {
    let matrix = await RoleMatrix.find();

    // Auto-seed defaults if collection is empty
    if (!matrix || matrix.length === 0) {
      await RoleMatrix.insertMany(DEFAULT_MATRIX);
      matrix = await RoleMatrix.find();
    }

    return res.json({
      success: true,
      data: matrix.map((m) => ({
        id: m._id,
        roleName: m.roleName,
        permissions: m.permissions,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    const updated = await RoleMatrix.findByIdAndUpdate(
      id,
      { permissions },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Role not found." });

    return res.json({
      success: true,
      message: "Permissions updated successfully.",
      data: {
        id: updated._id,
        roleName: updated.roleName,
        permissions: updated.permissions,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
