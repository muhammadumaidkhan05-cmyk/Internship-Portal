import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  DataTable,
  StatusBadge,
  statusToneFor,
  ProgressBar,
  ConfirmModal,
  CustomSelect,
} from "../../components/shared";
import {
  IconPlus,
  IconEdit,
  IconTrash,
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
import { ProgramFormModal } from "./ProgramFormModal";


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
          type="button"
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
              <CustomSelect
                value={statusFilter}
                onChange={(val) => setStatusFilter(val)}
                options={[
                  { label: "All statuses", value: "all" },
                  ...PROGRAM_STATUSES.map((s) => ({
                    label: STATUS_LABEL[s] ?? s,
                    value: s,
                  })),
                ]}
              />
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
        <ProgramFormModal
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowCreateModal(false);
            setEditing(null);
          }}
          isEditing={!!editing}
          isSaving={isCreating || isUpdating}
        />
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

