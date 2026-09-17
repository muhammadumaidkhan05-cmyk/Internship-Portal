import { IconClose } from "../../components/shared/icons";
import { PROGRAM_STATUSES } from "@msn/shared";
import { STATUS_LABEL } from "../../lib/labels";

/**
 * ProgramFormModal
 * Extracted from inline JSX in ProgramsPage.jsx.
 * Shared create/edit form for a Program.
 *
 * @param {object}   formData           - { name, manager, size, status, progress }
 * @param {function} onFormDataChange   - Updater: (updater: prev => next) => void
 * @param {function} onSubmit           - Form submit handler
 * @param {function} onClose            - Close/cancel handler
 * @param {boolean}  isEditing          - true = edit mode, false = create mode
 * @param {boolean}  isSaving           - Mutation pending state
 */
export function ProgramFormModal({
  formData,
  onFormDataChange,
  onSubmit,
  onClose,
  isEditing,
  isSaving,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal panel */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
          <h2 className="text-lg font-bold text-[#172033]">
            {isEditing ? "Edit Program" : "Create New Program"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full p-2 text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
          >
            <IconClose size={18} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#334155]">
                Program Name *
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) =>
                  onFormDataChange((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                placeholder="e.g. Summer 2026 Engineering"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#334155]">
                Program Manager *
              </label>
              <input
                required
                type="text"
                value={formData.manager}
                onChange={(e) =>
                  onFormDataChange((p) => ({ ...p, manager: e.target.value }))
                }
                className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#334155]">
                  Cohort Size
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.size}
                  onChange={(e) =>
                    onFormDataChange((p) => ({
                      ...p,
                      size: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#334155]">
                  Progress (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.progress}
                  onChange={(e) =>
                    onFormDataChange((p) => ({
                      ...p,
                      progress: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#334155]">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  onFormDataChange((p) => ({ ...p, status: e.target.value }))
                }
                className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              >
                {PROGRAM_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s] ?? s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors"
            >
              {isSaving ? "Saving..." : "Save Program"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
