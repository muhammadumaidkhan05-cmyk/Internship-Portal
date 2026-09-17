import { IconClose } from "../../components/shared/icons";
import { CustomSelect } from "../../components/shared";
import { ROLES, ROLE_LABELS } from "@msn/shared";

/**
 * EditRoleModal
 * Extracted from inline JSX in UsersPage.jsx.
 * Allows changing the role of an existing user.
 */
export function EditRoleModal({ user, role, onRoleChange, onSave, onCancel, isSaving }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Edit role for ${user.name}`}
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 py-8 animate-in fade-in duration-200"
    >
      <div className="flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-200">
        <div className="shrink-0 border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3">
          <h3 className="text-sm font-semibold text-[#172033]">
            Edit Role — {user.name}
          </h3>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B]">
              Role
            </label>
            <CustomSelect
              value={role}
              onChange={onRoleChange}
              options={ROLES.map((r) => ({
                label: ROLE_LABELS[r],
                value: r,
              }))}
            />
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#172033] hover:bg-[#F1F5F9]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={onSave}
            className="rounded-md bg-[#2563EB] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * CreateUserModal
 * Extracted from inline JSX in UsersPage.jsx.
 * Form to create a new user with name, email, and role.
 */
export function CreateUserModal({ onSubmit, onClose, isCreating, name, email, role, onNameChange, onEmailChange, onRoleChange }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Create new user"
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 py-8 animate-in fade-in duration-200"
    >
      <div className="flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-200">
        <div className="flex shrink-0 items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3">
          <h3 className="text-sm font-semibold text-[#172033]">Create New User</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#64748B] hover:text-[#172033]"
            aria-label="Close modal"
          >
            <IconClose size={16} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B]">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="e.g. Ayesha Malik"
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#172033] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B]">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="name@msn.example"
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#172033] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B]">
                Role
              </label>
              <CustomSelect
                value={role}
                onChange={onRoleChange}
                options={ROLES.map((r) => ({
                  label: ROLE_LABELS[r],
                  value: r,
                }))}
              />
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#172033] hover:bg-[#F1F5F9]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="rounded-md bg-[#2563EB] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-50"
            >
              {isCreating ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
