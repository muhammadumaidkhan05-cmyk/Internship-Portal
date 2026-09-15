import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Clock3,
  AlertCircle,
} from "lucide-react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = localStorage.getItem("userId");

      if (!userId) {
        throw new Error("User is not logged in.");
      }

      const response = await fetch(
        `http://localhost:5000/api/notifications/user/${userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load notifications"
        );
      }

      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Notifications loading error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => notification.unread === true
  ).length;

  const getNotificationType = (notification) => {
    if (
      notification.type === "success" ||
      notification.type === "approved"
    ) {
      return "success";
    }

    if (
      notification.type === "reminder" ||
      notification.type === "warning"
    ) {
      return "reminder";
    }

    return "new";
  };

  const getNotificationTime = (date) => {
    if (!date) return "Recently";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-[#64748B]">
          Loading notifications...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7">
        <p className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
          Updates
        </p>

        <h1 className="text-2xl md:text-3xl font-bold text-[#172033] mt-1">
          Notifications
        </h1>

        <p className="text-sm text-[#64748B] mt-1">
          Stay updated with your latest internship activities.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="relative overflow-hidden bg-white border border-[#E2E8F0] rounded-2xl shadow-sm max-w-4xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />

        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF4FF] text-[#2563EB] flex items-center justify-center">
              <Bell size={19} />
            </div>

            <div>
              <h2 className="font-bold text-[#172033]">
                Recent Notifications
              </h2>

              <p className="text-xs text-[#64748B]">
                Your latest portal updates
              </p>
            </div>
          </div>

          <span className="text-xs bg-[#EAF4FF] text-[#2563EB] px-3 py-1.5 rounded-full">
            {unreadCount} Unread
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell size={30} className="mx-auto text-[#94A3B8]" />

            <h3 className="text-sm font-semibold text-[#172033] mt-3">
              No Notifications
            </h3>

            <p className="text-sm text-[#64748B] mt-1">
              You don't have any notifications yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {notifications.map((notification) => {
              const notificationType =
                getNotificationType(notification);

              return (
                <div
                  key={notification._id}
                  className={`p-5 flex items-start gap-4 transition hover:bg-[#F8FAFC] ${
                    notification.unread ? "bg-blue-50/30" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      notificationType === "success"
                        ? "bg-emerald-50 text-emerald-600"
                        : notificationType === "reminder"
                        ? "bg-orange-50 text-[#F59E0B]"
                        : "bg-[#EAF4FF] text-[#2563EB]"
                    }`}
                  >
                    {notificationType === "success" ? (
                      <CheckCircle2 size={18} />
                    ) : notificationType === "reminder" ? (
                      <Clock3 size={18} />
                    ) : (
                      <AlertCircle size={18} />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-[#172033]">
                          {notification.title}
                        </h3>

                        {notification.unread && (
                          <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                        )}
                      </div>

                      <span className="text-xs text-[#94A3B8]">
                        {getNotificationTime(notification.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-[#64748B] mt-1.5 leading-5">
                      {notification.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;