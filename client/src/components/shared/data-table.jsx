import { useMemo, useState, useCallback, memo } from "react";
import { IconChevronDown, IconSearch } from "./icons";

function DataTableRowComponent({ row, idx, columns }) {
  return (
    <tr className="group relative bg-white hover:bg-[#F8FAFC] transition-all duration-200">
      {columns.map((col) => (
        <td
          key={col.key}
          className={`border-b border-[#E2E8F0] px-4 py-3.5 align-middle text-[#172033] last:border-b-0 group-hover:border-[#CBD5E1]/50 transition-colors ${
            col.className ?? ""
          }`}
        >
          {col.cell ? col.cell(row, idx) : row[col.key]}
        </td>
      ))}
    </tr>
  );
}

const DataTableRow = memo(DataTableRowComponent);

/**
 * Generic data table with optional per-column sorting and a configurable
 * footer slot. Supports both internal (client-side) sort and controlled
 * (server-side) sort via `onSortChange`. Used across the entire dashboard —
 * never copy-pasted between pages.
 */
export function DataTable({
  columns,
  rows,
  rowKey,
  footer,
  scrollable = true,
  emptyText = "No records found.",
  currentSortKey,
  currentSortDir,
  onSortChange,
}) {
  const [localSort, setLocalSort] = useState(null);

  // When controlled props are provided they take priority; otherwise fall back to local state.
  const activeSortKey = currentSortKey ?? localSort?.key;
  const activeSortDir = currentSortDir ?? localSort?.dir;

  const handleSort = useCallback(
    (col) => {
      if (!col.sortable) return;
      const nextDir =
        activeSortKey === col.key && activeSortDir === "asc" ? "desc" : "asc";

      if (onSortChange) {
        onSortChange(col.key, nextDir);
      } else {
        setLocalSort({ key: col.key, dir: nextDir });
      }
    },
    [activeSortKey, activeSortDir, onSortChange],
  );

  const sortedRows = useMemo(() => {
    // Controlled mode: parent manages sorting, we just render
    if (onSortChange || !localSort) return rows;
    const col = columns.find((c) => c.key === localSort.key);
    if (!col?.sortFn) return rows;
    const dir = localSort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => col.sortFn(a, b) * dir);
  }, [rows, localSort, columns, onSortChange]);

  const inner = (
    <table className="w-full border-separate border-spacing-0 text-sm">
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th
              key={col.key}
              className={`sticky top-0 z-10 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#64748B] ${
                col.className ?? ""
              } ${
                i === 0 ? "rounded-tl-2xl" : ""
              } ${i === columns.length - 1 ? "rounded-tr-2xl" : ""}`}
              style={col.width ? { width: col.width } : undefined}
              aria-sort={
                activeSortKey === col.key
                  ? activeSortDir === "asc"
                    ? "ascending"
                    : "descending"
                  : undefined
              }
            >
              <button
                type="button"
                onClick={() => handleSort(col)}
                disabled={!col.sortable}
                className={`inline-flex items-center gap-1 ${
                  col.sortable
                    ? "cursor-pointer hover:text-[#172033]"
                    : "cursor-default"
                }`}
              >
                {col.header}
                {col.sortable && (
                  <IconChevronDown
                    size={12}
                    style={{
                      transform:
                        activeSortKey === col.key && activeSortDir === "desc"
                          ? "rotate(180deg)"
                          : undefined,
                      opacity: activeSortKey === col.key ? 1 : 0.4,
                      transition: "transform 150ms ease, opacity 150ms ease",
                    }}
                  />
                )}
              </button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedRows.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="px-4 py-16 text-center text-sm"
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F5F9] text-[#94A3B8]">
                  <IconSearch size={20} />
                </div>
                <p className="font-medium text-[#475569]">{emptyText}</p>
              </div>
            </td>
          </tr>
        ) : (
          sortedRows.map((row, idx) => (
            <DataTableRow
              key={rowKey(row, idx)}
              row={row}
              idx={idx}
              columns={columns}
            />
          ))
        )}
      </tbody>
    </table>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm ring-1 ring-black/[0.03]">
      <div className={scrollable ? "overflow-x-auto" : ""}>{inner}</div>
      {footer ? (
        <div className="border-t border-[#E2E8F0] bg-[#F8FAFC]/50 px-5 py-3.5 backdrop-blur-sm">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
