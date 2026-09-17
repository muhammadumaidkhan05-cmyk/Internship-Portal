import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  DataTable,
  PageHeader,
  CustomSelect,
} from "../../components/shared";
import { IconDownload } from "../../components/shared/icons";
import { useAuditLogs } from "../../api";
import { apiClient } from "../../api/client";
import { AUDIT_ACTIONS } from "@msn/shared";
import {
  ACTION_LABEL,
  formatTimestamp,
  auditLogsToCsv,
} from "../../lib/labels";


export default function AuditPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const action = searchParams.get("action") || "all";
  const user = searchParams.get("user") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  const [userSearch, setUserSearch] = useState(user);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (!userSearch.trim()) {
        next.delete("user");
      } else {
        next.set("user", userSearch.trim());
      }
      next.set("page", "1");
      setSearchParams(next);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [userSearch]);

  // Sync local input when URL param changes externally (e.g. browser back)
  useEffect(() => {
    setUserSearch(user);
  }, [user]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const { data: response, isLoading } = useAuditLogs({
    page,
    limit: 15,
    action,
    user,
    from,
    to,
  });

  const logs = response?.data ?? [];
  const pagination = response?.pagination ?? {
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  };

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

  const columns = useMemo(
    () => [
      {
        key: "timestamp",
        header: "Timestamp",
        sortable: true,
        sortFn: (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        cell: (row) => formatTimestamp(row.timestamp),
      },
      {
        key: "userName",
        header: "User",
        sortable: true,
        sortFn: (a, b) => a.userName.localeCompare(b.userName),
      },
      {
        key: "action",
        header: "Action",
        cell: (row) => (
          <span className="font-medium capitalize text-[#172033]">
            {(ACTION_LABEL[row.action] ?? row.action).toLowerCase()}
          </span>
        ),
      },
      {
        key: "ipAddress",
        header: "IP Address",
        cell: (row) => row.ipAddress ?? "—",
      },
      { key: "device", header: "Device", cell: (row) => row.device ?? "—" },
    ],
    [],
  );

  const handleExport = useCallback(async () => {
    try {
      // Build params without pagination limit to get ALL matching records
      const exportParams = new URLSearchParams();
      exportParams.set("limit", "10000"); // high ceiling — fetch all
      if (user) exportParams.set("user", user);
      if (action && action !== "all") exportParams.set("action", action);
      if (from) exportParams.set("from", from);
      if (to) exportParams.set("to", to);

      const res = await apiClient(`/api/super-admin/audit-logs?${exportParams.toString()}`);
      const allLogs = res?.data ?? logs; // fall back to current page if request fails

      const csv = auditLogsToCsv(allLogs);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // Graceful fallback: export current page if full-fetch fails
      const csv = auditLogsToCsv(logs);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-log-page${page}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  }, [logs, user, action, from, to, page]);

  return (
    <>
      <Helmet>
        <title>Security & Audit Logs | Super Admin | MSN Academy</title>
      </Helmet>
      <div className="space-y-5">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B]">
                User
              </label>
                <input
                  type="search"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by user..."
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#172033] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>
            <div className="w-full sm:w-48">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B]">
                Action
              </label>
              <CustomSelect
                value={action}
                onChange={(val) => updateFilter("action", val)}
                options={[
                  { label: "All actions", value: "all" },
                  ...AUDIT_ACTIONS.map((auditAction) => ({
                    label: ACTION_LABEL[auditAction],
                    value: auditAction,
                  })),
                ]}
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B]">
                From
              </label>
              <input
                type="date"
                value={from}
                onChange={(e) => updateFilter("from", e.target.value)}
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#172033] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B]">
                To
              </label>
              <input
                type="date"
                value={to}
                onChange={(e) => updateFilter("to", e.target.value)}
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#172033] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleExport}
            disabled={logs.length === 0}
            className="inline-flex items-center gap-2 rounded-md bg-[#2563EB] px-3 py-2 text-xs font-semibold text-white shadow-[0_4px_10px_-4px_rgba(37,99,235,0.6)] hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors"
          >
            <IconDownload size={14} />
            Export CSV
          </button>
        </div>

        <DataTable
          columns={columns}
          rows={logs}
          rowKey={(r) => r.id}
          emptyText={
            isLoading ? "Loading..." : "No audit events match your filters."
          }
          footer={
            <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
              <span className="text-xs text-[#64748B]">
                {pagination.total === 0
                  ? "0 events"
                  : `Showing ${(pagination.page - 1) * pagination.limit + 1}–${Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )} of ${pagination.total} events`}
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
      </div>
    </>
  );
}
