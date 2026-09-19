import React, { useEffect, useState } from "react";
import { Mail, Phone, Building2, Users, Save } from "lucide-react";

import { getMentorProfile, updateMentorProfile } from "../../services/mentorApi";

function MentorProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    department: "",
    specialization: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const showToast = (message, type = "success") =>
    setToast({ show: true, type, message });

  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(
      () => setToast({ show: false, type: "", message: "" }),
      3000
    );
    return () => clearTimeout(timer);
  }, [toast]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await getMentorProfile();
      const data = response.data?.profile;
      setProfile(data);
      setForm({
        fullName: data?.fullName || "",
        phone: data?.phone || "",
        department: data?.department || "",
        specialization: data?.specialization || "",
        bio: data?.bio || "",
      });
    } catch (error) {
      showToast("Unable to load profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async () => {
    const nextErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSaving(true);
      const response = await updateMentorProfile(form);
      setProfile((prev) => ({ ...prev, ...response.data?.profile }));
      showToast("Profile updated successfully.");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to update profile.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    if (!form.fullName) return "M";
    return form.fullName
      .split(" ")
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#F3F6FB] p-5 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[800px] animate-pulse">
          <div className="h-8 w-72 rounded bg-slate-200" />
          <div className="mt-5 h-80 rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F3F6FB]">
      <div className="mx-auto max-w-[800px] p-5 sm:p-6 lg:p-8">
        <div className="mb-6">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2563EB]">
              Mentorship
            </p>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-[#172033] sm:text-3xl">
            Profile
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Manage your mentor profile information.
          </p>
        </div>

        <section className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.045)]">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />

          <div className="flex flex-col items-center gap-4 border-b border-[#E2E8F0] p-6 sm:flex-row">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 via-blue-500 to-cyan-400 p-[3px]">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#0E2A52] text-2xl font-bold text-white">
                {getInitials()}
              </div>
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-xl font-black text-[#172033]">
                {form.fullName || "Mentor"}
              </h2>
              <p className="mt-0.5 text-sm text-[#64748B]">
                {profile?.email}
              </p>

              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-[#2563EB]">
                  Mentor
                </span>

                <span className="flex items-center gap-1 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-[10px] font-bold text-[#64748B]">
                  <Users size={11} />
                  {profile?.assignedInternsCount ?? 0} interns assigned
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <Field label="Full Name" error={errors.fullName}>
              <input
                type="text"
                value={form.fullName}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    fullName: event.target.value,
                  }))
                }
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 ${
                  errors.fullName ? "border-red-300" : "border-[#E2E8F0]"
                }`}
              />
            </Field>

            <Field label="Email">
              <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-slate-50 px-3.5 py-2.5 text-sm text-[#64748B]">
                <Mail size={15} />
                {profile?.email}
              </div>
            </Field>

            <Field label="Phone">
              <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] px-3.5 py-1 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-blue-100">
                <Phone size={15} className="text-[#94A3B8]" />
                <input
                  type="text"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      phone: event.target.value,
                    }))
                  }
                  className="w-full bg-transparent py-1.5 text-sm outline-none"
                />
              </div>
            </Field>

            <Field label="Department">
              <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] px-3.5 py-1 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-blue-100">
                <Building2 size={15} className="text-[#94A3B8]" />
                <input
                  type="text"
                  value={form.department}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      department: event.target.value,
                    }))
                  }
                  className="w-full bg-transparent py-1.5 text-sm outline-none"
                />
              </div>
            </Field>

            <Field label="Specialization">
              <input
                type="text"
                value={form.specialization}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    specialization: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
              />
            </Field>

            <Field label="Bio" full>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, bio: event.target.value }))
                }
                className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
              />
            </Field>
          </div>

          <div className="flex justify-end border-t border-[#E2E8F0] px-6 py-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0891B2] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </section>
      </div>

      {toast.show && (
        <div
          className={`fixed bottom-5 right-5 z-[70] flex max-w-sm items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-xl ${
            toast.type === "error" ? "border-red-200" : "border-blue-200"
          }`}
        >
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              toast.type === "error" ? "bg-[#DC2626]" : "bg-[#2563EB]"
            }`}
          />
          <p className="text-sm font-medium text-[#172033]">
            {toast.message}
          </p>
        </div>
      )}
    </div>
  );
}

function Field({ label, error, full, children }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#64748B]">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default MentorProfile;
