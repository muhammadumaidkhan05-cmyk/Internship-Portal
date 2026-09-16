import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useCurrentUser } from "../../api";
import { showToast } from "../../api/client";

export default function ProfilePage() {
  const { data: user } = useCurrentUser();
  const userName = user?.name || "Super Admin";
  const userEmail = user?.email || "admin@msnacademy.example";
  const initial = userName.charAt(0).toUpperCase();

  const [displayName, setDisplayName] = useState(userName);
  const [email, setEmail] = useState(userEmail);

  // Re-sync form when user data loads
  const [synced, setSynced] = useState(false);
  if (user && !synced) {
    setDisplayName(user.name);
    setEmail(user.email);
    setSynced(true);
  }

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    // Profile update endpoint not yet implemented — show informational toast
    showToast(
      "Profile changes saved locally. Backend endpoint coming soon.",
      "info",
    );
  }, []);

  return (
    <>
      <Helmet>
        <title>Admin Profile | MSN Academy</title>
      </Helmet>
      <div className="mx-auto max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#E2E8F0] bg-white p-6"
        >
          <div className="flex items-center gap-4">
            <div
              aria-hidden
              className="grid h-14 w-14 place-items-center rounded-full text-lg font-bold text-white"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
              }}
            >
              {initial}
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#172033]">
                {userName}
              </h3>
              <div className="text-xs text-[#64748B]">{userEmail}</div>
              <div className="mt-1 inline-flex rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-semibold text-[#1D4ED8] ring-1 ring-inset ring-[#BFDBFE]">
                Super Admin
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="profile-display-name"
                className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B]"
              >
                Display name
              </label>
              <input
                id="profile-display-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#172033] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>
            <div>
              <label
                htmlFor="profile-email"
                className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B]"
              >
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#172033] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#1D4ED8] transition-colors"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
