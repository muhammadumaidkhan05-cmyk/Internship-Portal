import { useState, useMemo, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { NotificationList } from "../../components/shared";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "../../api";
import { showToast } from "../../api/client";
import { relativeFrom } from "../../lib/labels";

// Chip labels — NotificationList handles its own active chip state internally.
// We map each chip label → an API filter so the query is updated when chip changes.
const CHIPS = ["All", "Unread", "Security", "Approvals", "System"];

function chipToFilter(chip) {
  switch (chip) {
    case "Unread":
      return { unread: true };
    case "Security":
      return { category: "security" };
    case "Approvals":
      return { category: "approval" };
    case "System":
      return { category: "system" };
    default:
      return {};
  }
}

export default function NotificationsPage() {
  const [activeChip, setActiveChip] = useState("All");
  const filter = chipToFilter(activeChip);

  const { data: notifications = [] } = useNotifications(filter);
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();

  const items = useMemo(
    () =>
      notifications.map((n) => ({
        id: n.id,
        title: n.title,
        timestampLabel: relativeFrom(n.createdAt),
        isRead: n.isRead,
        category: n.category.charAt(0).toUpperCase() + n.category.slice(1),
      })),
    [notifications],
  );

  const handleMarkRead = useCallback(
    (id) => {
      markRead(id);
    },
    [markRead],
  );

  const handleMarkAllRead = useCallback(() => {
    markAllRead(undefined, {
      onSuccess: () => {
        showToast("All notifications marked as read", "success");
      },
    });
  }, [markAllRead]);

  // Keep local chip state in sync with NotificationList's internal chip selection
  // by wrapping chips and intercepting the active chip change through a custom chips array.
  // Since NotificationList manages its own `active` state, we use a key to force
  // a re-mount when the filter needs to change — driving the API re-query.

  return (
    <>
      <Helmet>
        <title>Notifications | Super Admin | MSN Academy</title>
      </Helmet>
      <div className="space-y-4">
        {/* Chip bar above the list for API-level filtering */}
        <div className="flex flex-wrap gap-2">
          {CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setActiveChip(chip)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                activeChip === chip
                  ? "bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-inset ring-[#BFDBFE]"
                  : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        <NotificationList
          key={activeChip}
          items={items}
          chips={[]}
          onMarkRead={handleMarkRead}
          toolbar={
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={isMarkingAll}
              className="rounded-md border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#2563EB] hover:bg-[#EFF6FF] disabled:opacity-50 transition-colors"
            >
              {isMarkingAll ? "Updating..." : "Mark all as read"}
            </button>
          }
        />
      </div>
    </>
  );
}
