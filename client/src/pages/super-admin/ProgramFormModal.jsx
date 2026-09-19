import { IconClose } from "../../components/shared/icons";
import { CustomSelect } from "../../components/shared";
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
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? "Edit Program" : "Create Program"}
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 py-8 animate-in fade-in duration-200"
    >
      <div className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-200">
        <div className="flex shrink-0 items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4">
          <h3 className="text-sm font-semibold text-[#172033]">
            {isEditing ? "Edit Program" : "Create New Program"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full p-2 text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
          >
            <IconClose size={18} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">

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
              <CustomSelect
                value={formData.status}
                onChange={(val) =>
                  onFormDataChange((p) => ({ ...p, status: val }))
                }
                options={PROGRAM_STATUSES.map((s) => ({
                  label: STATUS_LABEL[s] ?? s,
                  value: s,
                }))}
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#172033] hover:bg-[#F8FAFC] transition-colors"
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
