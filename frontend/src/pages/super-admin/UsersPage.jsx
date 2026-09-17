import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  DataTable,
  StatusBadge,
  statusToneFor,
  ConfirmModal,
} from "../../components/shared";
import {
  IconEdit,
  IconTrash,
  IconCheck,
  IconPlus,
} from "../../components/shared/icons";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "../../api";
import { showToast } from "../../api/client";
import { ROLES, USER_STATUSES, ROLE_LABELS } from "@msn/shared";
import { STATUS_LABEL, ROLE_LABEL } from "../../lib/labels";
import { EditRoleModal, CreateUserModal } from "./UserModals";


export default function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL search params
  const page = Number(searchParams.get("page")) || 1;
  const roleFilter = searchParams.get("role") || "all";
  const statusFilter = searchParams.get("status") || "all";
  const query = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "id";
  const order = searchParams.get("order") || "desc";

  // Debounced search — avoids a DB query per keystroke
  const [searchInput, setSearchInput] = useState(query);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (!searchInput.trim()) {
        next.delete("search");
      } else {
        next.set("search", searchInput.trim());
      }
      next.set("page", "1");
      setSearchParams(next);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Sync local input when URL param changes externally (e.g. browser back)
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  // Data fetching via TanStack Query
  const { data: response, isLoading } = useUsers({
    page,
    limit: 10,
    role: roleFilter,
    status: statusFilter,
    search: query,
    sort,
    order,
  });

  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: createUser, isPending: isCreating } = useCreateUser();

  const [editing, setEditing] = useState(null);
  const [editRole, setEditRole] = useState("intern");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("intern");

  // Delete confirmation modal state
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper to update URL filter params (non-search)
  const updateFilter = useCallback(
    (key, value) => {
      const next = new URLSearchParams(searchParams);
      if (!value || value === "all") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      next.set("page", "1");
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  const handlePageChange = useCallback(
    (newPage) => {
      const next = new URLSearchParams(searchParams);
      next.set("page", String(newPage));
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  const handleSortChange = useCallback(
    (newSortKey, newSortDir) => {
      const next = new URLSearchParams(searchParams);
      next.set("sort", newSortKey);
      next.set("order", newSortDir);
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  const handleSaveRole = useCallback(() => {
    if (!editing) return;
    updateUser(
      { id: editing.id, role: editRole },
      {
        onSuccess: () => {
          showToast("User role updated successfully", "success");
          setEditing(null);
        },
      },
    );
  }, [editing, editRole, updateUser]);

  const handleToggleStatus = useCallback(
    (user) => {
      // DB stores "Active" / "Inactive" (capitalized) — compare case-insensitively
      const isCurrentlyActive = user.status?.toLowerCase() === "active";
      const newStatus = isCurrentlyActive ? "Inactive" : "Active";
      updateUser(
        { id: user.id, status: newStatus },
        {
          onSuccess: () => {
            showToast(`User marked as ${newStatus}`, "success");
          },
        },
      );
    },
    [updateUser],
  );

  // Bug fix: replaced window.confirm() with ConfirmModal
  const handleDeleteClick = useCallback((user) => {
    setDeletingUser(user);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!deletingUser) return;
    setIsDeleting(true);
    deleteUser(deletingUser.id, {
      onSuccess: () => {
        showToast("User deleted successfully", "success");
        setDeletingUser(null);
        setIsDeleting(false);
      },
      onError: () => {
        setIsDeleting(false);
      },
    });
  }, [deleteUser, deletingUser]);

  const handleCreateUser = useCallback(
    (e) => {
      e.preventDefault();
      if (!newUserName.trim() || !newUserEmail.trim()) return;

      createUser(
        {
          name: newUserName.trim(),
          email: newUserEmail.trim(),
          role: newUserRole,
        },
        {
          onSuccess: () => {
            showToast("User created successfully", "success");
            setShowCreateModal(false);
            setNewUserName("");
            setNewUserEmail("");
            setNewUserRole("intern");
          },
        },
      );
    },
    [newUserName, newUserEmail, newUserRole, createUser],
  );

  const users = response?.data ?? [];
  const pagination = response?.pagination ?? {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  const columns = useMemo(
    () => [
      {
        key: "name",
        header: "Name",
        sortable: true,
        cell: (row) => (
          <div className="flex items-center gap-3">
            <div
              aria-hidden
              className="grid h-8 w-8 place-items-center rounded-full text-xs font-bold text-white"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #2563EB 0%, #0891B2 100%)",
              }}
            >
              {row.name
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-[#172033]">
                {row.name}
              </div>
              <div className="text-xs text-[#64748B]">{row.email}</div>
            </div>
          </div>
        ),
      },
      {
        key: "role",
        header: "Role",
        sortable: true,
        cell: (row) => ROLE_LABEL[row.role] ?? row.role,
      },
      {
        key: "status",
        header: "Status",
        sortable: true,
        cell: (row) => (
          <StatusBadge tone={statusToneFor(row.status)}>
            {STATUS_LABEL[row.status] ?? row.status}
          </StatusBadge>
        ),
      },
      {
        key: "actions",
        header: "Actions",
        width: "220px",
        cell: (row) => (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label={`Edit role for ${row.name}`}
              onClick={() => {
                setEditing(row);
                setEditRole(row.role);
              }}
              className="inline-flex items-center gap-1 rounded-md border border-[#E2E8F0] bg-white px-2 py-1 text-xs font-semibold text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
            >
              <IconEdit size={12} /> Edit
            </button>
            {row.status?.toLowerCase() === "active" ? (
              <button
                type="button"
                aria-label={`Deactivate ${row.name}`}
                onClick={() => handleToggleStatus(row)}
                className="rounded-md border border-[#E2E8F0] bg-white px-2 py-1 text-xs font-semibold text-[#B45309] hover:bg-[#FFFBEB] transition-colors"
              >
                Deactivate
              </button>
            ) : (
              <button
                type="button"
                aria-label={`Activate ${row.name}`}
                onClick={() => handleToggleStatus(row)}
                className="inline-flex items-center gap-1 rounded-md border border-[#E2E8F0] bg-white px-2 py-1 text-xs font-semibold text-[#047857] hover:bg-[#ECFDF5] transition-colors"
              >
                <IconCheck size={12} /> Activate
              </button>
            )}
            <button
              type="button"
              aria-label={`Delete ${row.name}`}
              onClick={() => handleDeleteClick(row)}
              className="inline-flex items-center gap-1 rounded-md border border-[#FECACA] bg-white px-2 py-1 text-xs font-semibold text-[#B91C1C] hover:bg-[#FEF2F2] transition-colors"
            >
              <IconTrash size={12} />
            </button>
          </div>
        ),
      },
    ],
    [handleToggleStatus, handleDeleteClick],
  );

  return (
    <>
      <Helmet>
        <title>User & Role Management | MSN Academy</title>
      </Helmet>
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-[#172033]">
            User & Role Management
          </h2>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-[#1D4ED8] transition-colors"
          >
            <IconPlus size={14} /> Add User
          </button>
        </div>

        {/* Filter bar synced to URL search parameters */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B]">
                Search
              </label>
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Name or email..."
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#172033] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B]">
                Role
              </label>
              <select
                value={roleFilter}
                onChange={(e) => updateFilter("role", e.target.value)}
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#172033] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              >
                <option value="all">All roles</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B]">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => updateFilter("status", e.target.value)}
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#172033] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              >
                <option value="all">All statuses</option>
                {USER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s] ?? s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={users}
          rowKey={(r) => r.id}
          currentSortKey={sort}
          currentSortDir={order}
          onSortChange={handleSortChange}
          emptyText={
            isLoading ? "Loading users..." : "No users match your filters."
          }
          footer={
            <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
              <span className="text-xs text-[#64748B]">
                {pagination.total === 0
                  ? "0 results"
                  : `Showing ${(pagination.page - 1) * pagination.limit + 1}–${Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )} of ${pagination.total}`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={pagination.page <= 1}
                  onClick={() =>
                    handlePageChange(Math.max(1, pagination.page - 1))
                  }
                  className="rounded-md border border-[#E2E8F0] bg-white px-3 py-1 text-xs font-semibold text-[#172033] disabled:opacity-40 hover:bg-[#F8FAFC]"
                >
                  Prev
                </button>
                <span className="text-xs text-[#64748B]">
                  Page {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  type="button"
                  aria-label="Next page"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() =>
                    handlePageChange(
                      Math.min(pagination.totalPages, pagination.page + 1),
                    )
                  }
                  className="rounded-md border border-[#E2E8F0] bg-white px-3 py-1 text-xs font-semibold text-[#172033] disabled:opacity-40 hover:bg-[#F8FAFC]"
                >
                  Next
                </button>
              </div>
            </div>
          }
        />

        {/* Edit role modal */}
        {editing && (
          <EditRoleModal
            user={editing}
            role={editRole}
            onRoleChange={setEditRole}
            onSave={handleSaveRole}
            onCancel={() => setEditing(null)}
            isSaving={isUpdating}
          />
        )}

        {/* Create User modal */}
        {showCreateModal && (
          <CreateUserModal
            name={newUserName}
            email={newUserEmail}
            role={newUserRole}
            onNameChange={setNewUserName}
            onEmailChange={setNewUserEmail}
            onRoleChange={setNewUserRole}
            onSubmit={handleCreateUser}
            onClose={() => setShowCreateModal(false)}
            isCreating={isCreating}
          />
        )}

        {/* Delete confirmation modal — replaces window.confirm() */}
        <ConfirmModal
          isOpen={!!deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={confirmDelete}
          title="Delete User"
          description={`Are you sure you want to permanently delete "${deletingUser?.name}"? This action cannot be undone.`}
          confirmLabel="Yes, Delete User"
          cancelLabel="Keep User"
          isDestructive={true}
          isLoading={isDeleting}
          icon={<IconTrash size={24} />}
        />
      </div>
    </>
  );
}

