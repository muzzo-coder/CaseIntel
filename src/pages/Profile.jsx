import { useState, useEffect } from "react";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  ShieldCheck,
  Pencil,
  Save,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import api from "../services/api";

function Profile() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("legalAI_user")) || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(!user);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await api.auth.getMe();
        setUser(data);
        setFullName(data.full_name || "");
        setPhone(data.phone || "");
        localStorage.setItem("legalAI_user", JSON.stringify(data));
      } catch (err) {
        console.error("Failed to load user profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const updated = await api.auth.updateProfile({
        full_name: fullName,
        phone: phone || null,
      });
      setUser(updated);
      localStorage.setItem("legalAI_user", JSON.stringify(updated));
      setSuccess("Profile updated successfully.");
      setEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const displayName = user?.full_name || "Legal Workspace User";
  const displayRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Workspace User";
  const displayEmail = user?.email || "user@example.com";
  const displayPhone = user?.phone || "Not specified";
  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "LU";

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your personal information and Legal AI Workspace profile.
        </p>
      </div>

      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          <CheckCircle2 size={18} className="text-green-600" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        {/* Profile Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-900 text-2xl font-semibold text-white">
              {initials}
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              {displayName}
            </h2>

            <p className="mt-1 text-sm text-slate-500">{displayRole}</p>

            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
                <ShieldCheck size={14} />
                {user?.is_active ? "Active Account" : "Inactive"}
              </span>

              {user?.is_verified ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                  <CheckCircle2 size={14} />
                  Verified Email
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                  <AlertCircle size={14} />
                  Verification Pending
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail size={17} className="text-slate-400" />
              <span className="truncate">{displayEmail}</span>
            </div>

            <div className="mt-4 flex items-center gap-3 text-sm text-slate-600">
              <GraduationCap size={17} className="text-slate-400" />
              <span>{displayRole} Account</span>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Personal Information
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Update the information associated with your workspace.
                </p>
              </div>

              {!editing ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(true);
                    setSuccess("");
                    setError("");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Pencil size={15} />
                  Edit Profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <X size={15} />
                  Cancel
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-100"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 disabled:opacity-60"
                  >
                    <Save size={16} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <ProfileField
                  icon={<UserIcon size={17} />}
                  label="Full Name"
                  value={displayName}
                />

                <ProfileField
                  icon={<Mail size={17} />}
                  label="Email Address"
                  value={displayEmail}
                />

                <ProfileField
                  icon={<Phone size={17} />}
                  label="Phone Number"
                  value={displayPhone}
                />

                <ProfileField
                  icon={<ShieldCheck size={17} />}
                  label="Account Role"
                  value={displayRole}
                />
              </div>
            )}
          </section>

          {/* Academic / Workspace Information */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Workspace Information
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Information about your Legal AI Workspace account.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <InfoBox label="Workspace" value="Legal AI Workspace" />
              <InfoBox label="Account Type" value={`${displayRole} Tier`} />
              <InfoBox label="AI Assistant" value="Available" />
              <InfoBox label="Document Analysis" value="Available" />
            </div>
          </section>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
        <p className="text-xs leading-5 text-blue-900">
          <span className="font-semibold">Legal AI Notice:</span> Profile
          information is used to personalize your Legal AI Workspace. Do not enter
          unnecessary sensitive information into the system.
        </p>
      </div>
    </div>
  );
}

function ProfileField({ icon, label, value }) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
        <span className="text-slate-400">{icon}</span>
        {label}
      </label>
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        {value}
      </div>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

export default Profile;