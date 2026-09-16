import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  DataTable,
  StatusBadge,
  statusToneFor,
  ProgressBar,
  ConfirmModal,
} from "../../components/shared";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconClose,
} from "../../components/shared/icons";
import {
  usePrograms,
  useCreateProgram,
  useUpdateProgram,
  useDeleteProgram,
} from "../../api";
import { showToast } from "../../api/client";
import { PROGRAM_STATUSES } from "@msn/shared";
import { STATUS_LABEL } from "../../lib/labels";

export default function ProgramsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const debounceRef = useRef(null);

  // Debounce search input — prevent a DB query per keystroke
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setQuery(searchInput), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  const { data: programs = [], isLoading } = usePrograms({
    status: statusFilter,
    search: query,
  });

  const { mutate: createProgram, isPending: isCreating } = useCreateProgram();
  const { mutate: updateProgram, isPending: isUpdating } = useUpdateProgram();
  const { mutate: deleteProgram } = useDeleteProgram();

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingProgram, setDeletingProgram] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    manager: "",
    size: 0,
    status: "active",
    progress: 0,
  });

  const handleOpenCreate = useCallback(() => {
    setFormData({
      name: "",
      manager: "",
      size: 0,
      status: "active",
      progress: 0,
    });
    setShowCreateModal(true);
  }, []);

  const handleOpenEdit = useCallback((p) => {
    setFormData({
      name: p.name,
      manager: p.programManager,
      size: p.cohortSize,
      status: p.status,
      progress: p.progress,
    });
    setEditing(p);
  }, []);

  const handleDeleteClick = useCallback((p) => {
    setDeletingProgram(p);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!deletingProgram) return;
    setIsDeleting(true);
    deleteProgram(deletingProgram.id, {
      onSuccess: () => {
        showToast("Program deleted successfully", "success");
        setDeletingProgram(null);
        setIsDeleting(false);
      },
      onError: () => {
        setIsDeleting(false);
      },
    });
  }, [deleteProgram, deletingProgram]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!formData.name.trim() || !formData.manager.trim()) return;

      if (editing) {
        updateProgram(
          {
            id: editing.id,
            name: formData.name.trim(),
            programManager: formData.manager.trim(),
            cohortSize: formData.size,
            status: formData.status,
            progress: formData.progress,
          },
          {
            onSuccess: () => {
              showToast("Program updated successfully", "success");
              setEditing(null);
            },
          },
        );
      } else {
        createProgram(
          {
            name: formData.name.trim(),
            programManager: formData.manager.trim(),
            cohortSize: formData.size,
            status: formData.status,
            progress: formData.progress,
          },
          {
            onSuccess: () => {
              showToast("Program created successfully", "success");
              setShowCreateModal(false);
            },
          },
        );
      }
    },
    [formData, editing, createProgram, updateProgram],
  );

  const columns = useMemo(
    () => [
      {
        key: "name",
        header: "Program",
        sortable: true,
        sortFn: (a, b) => a.name.localeCompare(b.name),
        cell: (row) => (
          <span className="font-semibold text-[#172033]">{row.name}</span>
        ),
      },
      {
        key: "programManager",
        header: "Program Manager",
        sortable: true,
        sortFn: (a, b) => a.programManager.localeCompare(b.programManager),
      },
      {
        key: "cohortSize",
        header: "Cohort Size",
        width: "120px",
        sortable: true,
        sortFn: (a, b) => a.cohortSize - b.cohortSize,
        cell: (row) => <span className="tabular-nums">{row.cohortSize}</span>,
      },
      {
        key: "status",
        header: "Status",
        width: "130px",
        cell: (row) => (
          <StatusBadge tone={statusToneFor(row.status)}>
            {STATUS_LABEL[row.status] ?? row.status}
          </StatusBadge>
        ),
      },
      {
        key: "progress",
        header: "Progress",
        width: "180px",
        cell: (row) => <ProgressBar value={row.progress} />,
      },
      {
        key: "actions",
        header: "Actions",
        width: "140px",
        cell: (row) => (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label={`Edit ${row.name}`}
              onClick={() => handleOpenEdit(row)}
              className="inline-flex items-center gap-1 rounded-md border border-[#E2E8F0] bg-white px-2 py-1 text-xs font-semibold text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
            >
              <IconEdit size={12} /> Edit
            </button>
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
    [handleOpenEdit, handleDeleteClick],
  );

  return (
    <>
      <Helmet>
        <title>Programs | Super Admin | MSN Academy</title>
      </Helmet>

      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-[#172033]">Programs</h1>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] transition-colors"
        >
          <IconPlus size={16} /> New Program
        </button>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B]">
                Search
              </label>
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Program name..."
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#172033] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B]">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#172033] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              >
                <option value="all">All statuses</option>
                {PROGRAM_STATUSES.map((s) => (
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
          rows={programs}
          rowKey={(r) => r.id}
          emptyText={
            isLoading
              ? "Loading programs..."
              : "No programs match your filters."
          }
          footer={
            <span className="text-xs text-[#64748B]">
              {programs.length} program{programs.length === 1 ? "" : "s"} on the
              platform
            </span>
          }
        />
      </div>

      {/* CREATE / EDIT MODAL */}
      {(showCreateModal || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div
            className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
            onClick={() => {
              setShowCreateModal(false);
              setEditing(null);
            }}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
              <h2 className="text-lg font-bold text-[#172033]">
                {editing ? "Edit Program" : "Create New Program"}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditing(null);
                }}
                className="rounded-full p-2 text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
              >
                <IconClose size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
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
                      setFormData((p) => ({ ...p, name: e.target.value }))
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
                      setFormData((p) => ({ ...p, manager: e.target.value }))
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
                        setFormData((p) => ({
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
                        setFormData((p) => ({
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
                      setFormData((p) => ({ ...p, status: e.target.value }))
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
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditing(null);
                  }}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="rounded-lg bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors"
                >
                  {isCreating || isUpdating ? "Saving..." : "Save Program"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={!!deletingProgram}
        onClose={() => setDeletingProgram(null)}
        onConfirm={confirmDelete}
        title="Delete Program"
        description={`Are you sure you want to delete the program "${deletingProgram?.name}"? This action cannot be undone and will permanently remove all associated data.`}
        confirmLabel="Yes, Delete Program"
        cancelLabel="Keep Program"
        isDestructive={true}
        isLoading={isDeleting}
        icon={<IconTrash size={24} />}
      />
    </>
  );
}
