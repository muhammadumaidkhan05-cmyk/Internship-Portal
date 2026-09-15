import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  Pencil,
  Trash2,
  IdCard,
  CalendarDays,
} from "lucide-react";
import { getCurrentUserId } from "../utils/auth";

function Profile() {
  const userId = getCurrentUserId();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) {
      setError("You're not logged in. Please log in to view your profile.");
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/users/${userId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setProfile(data);
        setBio(data.bio || "");
        setPhone(data.phone || "");
      } catch (err) {
        console.error("Profile error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await fetch(
        `http://localhost:5000/api/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bio, phone }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setProfile(data);
      setEditOpen(false);
    } catch (err) {
      console.error("Update profile error:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-[#64748B]">Loading profile...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="mb-6 bg-red-50 border border-red-200 text-[#DC2626] rounded-xl px-4 py-3 text-sm">
        {error}
      </div>
    );
  }

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <p className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
          Account
        </p>

        <h1 className="text-2xl md:text-3xl font-bold text-[#172033] mt-1">
          My Profile
        </h1>

        <p className="text-sm text-[#64748B] mt-1">
          View and manage your profile information.
        </p>
      </div>

      {/* Main profile card */}
      <div className="relative overflow-hidden bg-white border border-[#E2E8F0] rounded-2xl p-5 md:p-6 shadow-sm max-w-4xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#2563EB] via-[#22D3EE] to-[#DC2626] flex items-center justify-center text-xl font-bold text-white">
              {initials}
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#172033]">
                  {profile?.name}
                </h2>

                <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>

              <p className="text-sm text-[#64748B]">{profile?.role}</p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-[#64748B]">
                <span className="flex items-center gap-1">
                  <Mail size={13} />
                  {profile?.email}
                </span>

                {profile?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={13} />
                    {profile.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1D4ED8] transition"
            >
              <Pencil size={14} />
              Edit Profile
            </button>

            <button className="flex items-center gap-2 bg-red-50 text-[#DC2626] px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition">
              <Trash2 size={14} />
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Personal information */}
      <div className="relative overflow-hidden bg-white border border-[#E2E8F0] rounded-2xl p-5 md:p-6 shadow-sm max-w-4xl mt-5">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />

        <div className="flex items-center gap-2 mb-5">
          <IdCard size={18} className="text-[#2563EB]" />
          <div>
            <h3 className="font-bold text-[#172033]">Personal Information</h3>
            <p className="text-xs text-[#64748B]">
              Your saved personal and contact details.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-xs text-[#94A3B8] uppercase tracking-wide">
              Full Name
            </p>
            <p className="text-sm font-medium text-[#172033] mt-1">
              {profile?.name}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#94A3B8] uppercase tracking-wide">
              Email Address
            </p>
            <p className="text-sm font-medium text-[#172033] mt-1">
              {profile?.email}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#94A3B8] uppercase tracking-wide">
              Phone Number
            </p>
            <p className="text-sm font-medium text-[#172033] mt-1">
              {profile?.phone || "Not added yet"}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#94A3B8] uppercase tracking-wide">
              Department
            </p>
            <p className="text-sm font-medium text-[#172033] mt-1">
              {profile?.department || "—"}
            </p>
          </div>
        </div>

        {profile?.bio && (
          <div className="mt-5 pt-5 border-t border-[#E2E8F0]">
            <p className="text-xs text-[#94A3B8] uppercase tracking-wide">Bio</p>
            <p className="text-sm text-[#172033] mt-1 leading-6">
              {profile.bio}
            </p>
          </div>
        )}
      </div>

      {/* Account status */}
      <div className="relative overflow-hidden bg-white border border-[#E2E8F0] rounded-2xl p-5 md:p-6 shadow-sm max-w-4xl mt-5">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />

        <h3 className="font-bold text-[#172033] mb-4">Account Status</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#F3F6FB] rounded-xl p-4">
            <p className="text-xs text-[#64748B]">Current profile account state</p>
            <p className="text-sm font-semibold text-emerald-600 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Active
            </p>
          </div>

          <div className="bg-[#F3F6FB] rounded-xl p-4">
            <p className="text-xs text-[#64748B] flex items-center gap-1.5">
              <CalendarDays size={13} />
              Member Since
            </p>
            <p className="text-sm font-semibold text-[#172033] mt-1">
              {memberSince}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-[#172033] text-lg">Edit Profile</h3>
              <button
                onClick={() => setEditOpen(false)}
                className="text-[#94A3B8] hover:text-[#172033] text-xl leading-none"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-[#64748B] mb-5">
              Update your profile information.
            </p>

            <label className="block text-sm font-medium text-[#172033] mb-2">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03xx-xxxxxxx"
              className="w-full border border-[#E2E8F0] rounded-xl p-3 text-sm text-[#172033] outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB] mb-4"
            />

            <label className="block text-sm font-medium text-[#172033] mb-2">
              Bio
            </label>
            <textarea
              rows="4"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a little about yourself..."
              className="w-full border border-[#E2E8F0] rounded-xl p-3 text-sm text-[#172033] outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB] resize-none"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#64748B] hover:bg-[#F3F6FB] transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;