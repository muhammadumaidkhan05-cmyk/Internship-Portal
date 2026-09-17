import { useState, useCallback, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useCurrentUser, getStoredUser } from "../../api/useAuth";
import { useUpdateUser } from "../../api";
import { showToast } from "../../api/client";

export default function ProfilePage() {
  const { data: user } = useCurrentUser();
  // Fallback to localStorage if API query hasn't resolved yet
  const storedUser = getStoredUser();
  const activeUser = user ?? storedUser;

  const userName = activeUser?.name || "Super Admin";
  const userEmail = activeUser?.email || "";
  const userId = activeUser?.id || activeUser?._id || null;
  const initial = userName.charAt(0).toUpperCase();

  const [displayName, setDisplayName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [isDirty, setIsDirty] = useState(false);

  const { mutate: updateUser, isPending: isSaving } = useUpdateUser();

  // Sync form fields when user data loads from the API
  useEffect(() => {
    if (activeUser) {
      setDisplayName(activeUser.name || "");
      setEmail(activeUser.email || "");
      setIsDirty(false);
    }
  }, [activeUser]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!userId) {
        showToast("Could not determine your user ID. Please re-login.", "error");
        return;
      }

      updateUser(
        { id: userId, name: displayName.trim(), email: email.trim() },
        {
          onSuccess: () => {
            // Also update localStorage so the sidebar reflects the new name immediately
            const stored = localStorage.getItem("msn_user");
            if (stored) {
              try {
                const parsed = JSON.parse(stored);
                localStorage.setItem(
                  "msn_user",
                  JSON.stringify({ ...parsed, name: displayName.trim(), email: email.trim() }),
                );
              } catch {
                // ignore parse errors
              }
            }
            showToast("Profile updated successfully.", "success");
            setIsDirty(false);
          },
          onError: (err) => {
            showToast(err?.message || "Failed to update profile.", "error");
          },
        },
      );
    },
    [userId, displayName, email, updateUser],
  );

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
          {/* Avatar + identity */}
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
                {activeUser?.role ?? "Super Admin"}
              </div>
            </div>
          </div>

          {/* Editable fields */}
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
                required
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setIsDirty(true);
                }}
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
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsDirty(true);
                }}
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#172033] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            {isDirty ? (
              <span className="text-xs text-[#F59E0B] font-medium">
                Unsaved changes
              </span>
            ) : (
              <span className="text-xs text-[#94A3B8]">
                {userId ? "Connected to your account" : "Sign in to save changes"}
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving || !isDirty || !userId}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? "Saving…" : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
