import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCheck, Trash2 } from "lucide-react";

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  deleteNotification,
} from "../../services/internApi";

// ============================================================
// NOTIFICATIONS
// Fed by the shared notification service: task assigned, scrum
// reviewed, submission approved or sent back, evaluation
// completed and certificate issued all land here.
// ============================================================

const TYPE_COLORS = {
  Task: "#2563EB",
  Scrum: "#0891B2",
  Evaluation: "#8B5CF6",
  Certificate: "#047857",
  Team: "#F59E0B",
  Info: "#64748B",
  General: "#64748B",
};

function formatWhen(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString();
}

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { notifications: items } = await getNotifications();

      setNotifications(items);
    } catch (err) {
      setError(err.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const announceChange = () =>
    window.dispatchEvent(new Event("intern:notifications-changed"));

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);

      setNotifications((previous) =>
        previous.map((item) =>
          item._id === id ? { ...item, isRead: true, unread: false } : item
        )
      );

      announceChange();
    } catch (err) {
      setError(err.message || "Failed to update the notification.");
    }
  };

  const handleMarkAll = async () => {
    try {
      const updated = await markAllNotificationsRead();

      setNotifications(updated);
      announceChange();
    } catch (err) {
      setError(err.message || "Failed to update notifications.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);

      setNotifications((previous) => previous.filter((item) => item._id !== id));
      announceChange();
    } catch (err) {
      setError(err.message || "Failed to delete the notification.");
    }
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <div>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
            Internship Portal
          </p>

          <h1 className="mt-1 text-2xl font-bold text-[#172033] md:text-3xl">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
              : "You are all caught up."}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAll}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#172033] transition hover:border-[#2563EB] hover:text-[#2563EB]"
          >
            <CheckCheck size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#DC2626]">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-[#64748B]">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

          <Bell size={26} className="mx-auto text-[#64748B]" />

          <h2 className="mt-4 font-bold text-[#172033]">No notifications yet</h2>

          <p className="mt-2 text-sm text-[#64748B]">
            You will be notified when a task is assigned or your work is
            reviewed.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const accent = TYPE_COLORS[notification.type] || "#64748B";

            return (
              <div
                key={notification._id}
                className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                  notification.isRead ? "border-[#E2E8F0]" : "border-[#2563EB]/40"
                }`}
              >
                <div
                  className="absolute inset-y-0 left-0 w-1"
                  style={{ background: accent }}
                />

                <div className="flex flex-col gap-3 pl-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold text-[#172033]">
                        {notification.title}
                      </h2>

                      {!notification.isRead && (
                        <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-bold text-[#2563EB]">
                          NEW
                        </span>
                      )}

                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{ background: `${accent}18`, color: accent }}
                      >
                        {notification.type}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-[#64748B]">
                      {notification.message}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span className="text-xs text-[#94A3B8]">
                        {formatWhen(notification.createdAt)}
                      </span>

                      {notification.link && (
                        <Link
                          to={notification.link}
                          onClick={() =>
                            !notification.isRead &&
                            handleMarkRead(notification._id)
                          }
                          className="text-xs font-semibold text-[#2563EB] transition hover:underline"
                        >
                          Open
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {!notification.isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(notification._id)}
                        className="rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs font-semibold text-[#64748B] transition hover:border-[#2563EB] hover:text-[#2563EB]"
                      >
                        Mark read
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(notification._id)}
                      aria-label="Delete notification"
                      className="rounded-lg border border-[#E2E8F0] p-1.5 text-[#DC2626] transition hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Notifications;
