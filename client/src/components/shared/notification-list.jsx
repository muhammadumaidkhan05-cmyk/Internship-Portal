import { useMemo, useState, useCallback } from "react";
import { IconCheck } from "./icons";

export function NotificationList({
  items,
  chips,
  unreadChip = "Unread",
  toolbar,
  onMarkRead,
}) {
  const [active, setActive] = useState(chips[0] ?? "All");
  const [selected, setSelected] = useState(new Set());

  const filtered = useMemo(() => {
    if (active === "All") return items;
    if (active === unreadChip) return items.filter((i) => !i.isRead);
    return items.filter(
      (i) => i.category.toLowerCase() === active.toLowerCase(),
    );
  }, [items, active, unreadChip]);

  const toggleAll = useCallback(() => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((i) => i.id)));
    }
  }, [selected.size, filtered]);

  const toggleOne = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const allSelected = filtered.length > 0 && selected.size === filtered.length;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] px-4 py-3">
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Notification filters"
        >
          {chips.map((chip) => {
            const isActive = active === chip;
            return (
              <button
                key={chip}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(chip)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-inset ring-[#BFDBFE]"
                    : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
        {toolbar ? <div>{toolbar}</div> : null}
      </div>

      <div className="flex items-center gap-3 border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B]">
        <input
          type="checkbox"
          aria-label="Select all notifications"
          checked={allSelected}
          onChange={toggleAll}
          className="h-4 w-4 rounded border-[#CBD5E1] accent-[#2563EB]"
        />

        <span className="flex-1">Notification</span>
        <span className="w-24 text-right">When</span>
      </div>

      {filtered.length === 0 ? (
        <div className="px-4 py-14 text-center text-sm text-[#64748B]">
          No notifications.
        </div>
      ) : (
        <ul>
          {filtered.map((item) => {
            const isSelected = selected.has(item.id);
            return (
              <li
                key={item.id}
                onClick={() => !item.isRead && onMarkRead?.(item.id)}
                className={`flex items-center gap-3 border-b border-[#E2E8F0] px-4 py-3 last:border-b-0 transition cursor-pointer hover:bg-[#F8FAFC] ${
                  isSelected ? "bg-[#EFF6FF]" : "bg-white"
                }`}
              >
                {/* Unread dot */}
                <span
                  aria-hidden
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    item.isRead ? "bg-transparent" : "bg-[#2563EB]"
                  }`}
                  title={item.isRead ? "Read" : "Unread"}
                />

                <input
                  type="checkbox"
                  aria-label={`Select notification: ${item.title}`}
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleOne(item.id);
                  }}
                  className="h-4 w-4 rounded border-[#CBD5E1] accent-[#2563EB]"
                />

                <div className="min-w-0 flex-1">
                  <div
                    className={`truncate text-sm ${
                      item.isRead
                        ? "font-normal text-[#475569]"
                        : "font-semibold text-[#172033]"
                    }`}
                  >
                    {item.title}
                  </div>
                </div>

                <div className="w-24 text-right text-xs text-[#64748B]">
                  {item.timestampLabel}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {selected.size > 0 && (
        <div className="flex items-center justify-between border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-xs text-[#475569]">
          <span className="inline-flex items-center gap-1.5">
            <IconCheck size={14} className="text-[#2563EB]" />
            {selected.size} selected
          </span>
          <button
            type="button"
            className="font-semibold text-[#2563EB] hover:underline"
            onClick={() => setSelected(new Set())}
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
}
