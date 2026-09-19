import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { IconCheck } from "../../components/shared/icons";
import {
  usePlatformSettings,
  useUpdatePlatformSettings,
  useRolesMatrix,
  useUpdateRoleMatrixRow,
} from "../../api";
import { showToast } from "../../api/client";

const PERMISSION_LABELS = {
  view_dashboard: "View dashboard",
  manage_users: "Manage users",
  manage_roles: "Manage roles",
  manage_programs: "Manage programs",
  view_audit_logs: "View audit logs",
  export_audit_logs: "Export audit logs",
  manage_settings: "Manage settings",
  manage_notifications: "Manage notifications",
};

const PERMISSION_ORDER = Object.keys(PERMISSION_LABELS);

export default function SettingsPage() {
  const { data: remoteSettings, isLoading: settingsLoading } =
    usePlatformSettings();
  const { data: matrix = [] } = useRolesMatrix();

  const { mutate: updateSettings, isPending: savingSettings } =
    useUpdatePlatformSettings();
  const { mutate: updateRoleMatrix } = useUpdateRoleMatrixRow();

  const [formData, setFormData] = useState({
    platformName: "",
    supportEmail: "",
    maintenanceMode: false,
    sessionTimeoutMinutes: 60,
    allowSignups: true,
  });

  useEffect(() => {
    if (remoteSettings) {
      setFormData(remoteSettings);
    }
  }, [remoteSettings]);

  const handleSaveGeneral = useCallback(
    (e) => {
      e.preventDefault();
      updateSettings(formData, {
        onSuccess: () => {
          showToast("Platform settings saved successfully", "success");
        },
      });
    },
    [formData, updateSettings],
  );

  const togglePermission = useCallback(
    (row, perm) => {
      const nextPermissions = {
        ...row.permissions,
        [perm]: !row.permissions[perm],
      };

      updateRoleMatrix(
        { id: row.id, permissions: nextPermissions },
        {
          onSuccess: () => {
            showToast(
              `Updated ${row.roleName} permission for ${PERMISSION_LABELS[perm]}`,
              "success",
            );
          },
        },
      );
    },
    [updateRoleMatrix],
  );

  return (
    <>
      <Helmet>
        <title>Platform Settings | Super Admin | MSN Academy</title>
      </Helmet>
      <div className="space-y-6">
        {/* General settings */}
        <form
          onSubmit={handleSaveGeneral}
          className="rounded-2xl border border-[#E2E8F0] bg-white p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-[#172033]">
              General Platform Settings
            </h3>
            <button
              type="submit"
              disabled={savingSettings || settingsLoading}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#2563EB] px-3 py-1.5 text-xs font-semibold text-white shadow-[0_4px_10px_-4px_rgba(37,99,235,0.6)] hover:bg-[#1D4ED8] disabled:opacity-60 transition-colors"
            >
              <IconCheck size={14} /> {savingSettings ? "Saving..." : "Save"}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B]">
                Platform name
              </label>
              <input
                type="text"
                value={formData.platformName ?? ""}
                onChange={(e) =>
                  setFormData((s) => ({ ...s, platformName: e.target.value }))
                }
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#172033] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B]">
                Support email
              </label>
              <input
                type="email"
                value={formData.supportEmail ?? ""}
                onChange={(e) =>
                  setFormData((s) => ({ ...s, supportEmail: e.target.value }))
                }
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#172033] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B]">
                Session timeout (minutes)
              </label>
              <input
                type="number"
                min={5}
                max={1440}
                value={formData.sessionTimeoutMinutes ?? 60}
                onChange={(e) =>
                  setFormData((s) => ({
                    ...s,
                    sessionTimeoutMinutes: Number(e.target.value) || 60,
                  }))
                }
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#172033] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B]">
                Toggles
              </label>
              <label className="flex items-center gap-2 text-sm text-[#172033]">
                <input
                  type="checkbox"
                  checked={formData.maintenanceMode ?? false}
                  onChange={(e) =>
                    setFormData((s) => ({
                      ...s,
                      maintenanceMode: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-[#CBD5E1] accent-[#DC2626]"
                />
                Maintenance mode
              </label>
              <label className="flex items-center gap-2 text-sm text-[#172033]">
                <input
                  type="checkbox"
                  checked={formData.allowSignups ?? true}
                  onChange={(e) =>
                    setFormData((s) => ({
                      ...s,
                      allowSignups: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-[#CBD5E1] accent-[#2563EB]"
                />
                Allow public sign-ups
              </label>
            </div>
          </div>
        </form>

        {/* Permissions matrix */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <div className="mb-4">
            <h3 className="text-[15px] font-semibold text-[#172033]">
              Roles & Permissions Matrix
            </h3>
            <p className="mt-1 text-xs text-[#64748B]">
              Toggle which permissions each role can perform. Changes persist
              and apply platform-wide.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
              <thead>
                <tr>
                  <th className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B] rounded-tl-lg">
                    Permission
                  </th>
                  {matrix.map((row, i) => (
                    <th
                      key={row.id}
                      className={`border-b border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B] ${
                        i === matrix.length - 1 ? "rounded-tr-lg" : ""
                      }`}
                    >
                      {row.roleName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSION_ORDER.map((perm, pi) => (
                  <tr key={perm}>
                    <td
                      className={`border-b border-[#E2E8F0] px-3 py-2.5 text-sm text-[#172033] ${
                        pi === PERMISSION_ORDER.length - 1
                          ? "rounded-bl-lg border-b-0"
                          : ""
                      }`}
                    >
                      {PERMISSION_LABELS[perm]}
                    </td>
                    {matrix.map((row, ri) => {
                      const checked = !!row.permissions[perm];
                      return (
                        <td
                          key={row.id}
                          className={`border-b border-[#E2E8F0] px-3 py-2.5 text-center ${
                            pi === PERMISSION_ORDER.length - 1 &&
                            ri === matrix.length - 1
                              ? "rounded-br-lg border-b-0"
                              : ""
                          }`}
                        >
                          <label className="inline-flex items-center justify-center">
                            <input
                              type="checkbox"
                              aria-label={`${PERMISSION_LABELS[perm]} for ${row.roleName}`}
                              checked={checked}
                              onChange={() => togglePermission(row, perm)}
                              disabled={row.roleName === "Super Admin"}
                              className="h-4 w-4 rounded border-[#CBD5E1] accent-[#2563EB] disabled:opacity-60 cursor-pointer"
                            />
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
