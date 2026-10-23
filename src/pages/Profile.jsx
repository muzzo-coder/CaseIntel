import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  ShieldCheck,
  Pencil,
  Save,
} from "lucide-react";

function Profile() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your personal information and Legal AI Workspace profile.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        {/* Profile Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-900 text-2xl font-semibold text-white">
              SS
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Sidra Shaikh
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Legal AI Workspace User
            </p>

            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
              <ShieldCheck size={14} />
              Active Account
            </span>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail size={17} className="text-slate-400" />
              <span>Account email</span>
            </div>

            <div className="mt-4 flex items-center gap-3 text-sm text-slate-600">
              <GraduationCap size={17} className="text-slate-400" />
              <span>Student Account</span>
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

              <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <Pencil size={15} />
                Edit Profile
              </button>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <ProfileField
                icon={<User size={17} />}
                label="Full Name"
                value="Sidra Shaikh"
              />

              <ProfileField
                icon={<Mail size={17} />}
                label="Email Address"
                value="your-email@example.com"
              />

              <ProfileField
                icon={<Phone size={17} />}
                label="Phone Number"
                value="+91 XXXXX XXXXX"
              />

              <ProfileField
                icon={<MapPin size={17} />}
                label="Location"
                value="India"
              />

              <ProfileField
                icon={<GraduationCap size={17} />}
                label="Education"
                value="B.Tech Computer Science & Engineering"
              />

              <ProfileField
                icon={<ShieldCheck size={17} />}
                label="Account Role"
                value="Workspace User"
              />
            </div>
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
              <InfoBox
                label="Workspace"
                value="Legal AI Workspace"
              />

              <InfoBox
                label="Account Type"
                value="Student / Research"
              />

              <InfoBox
                label="AI Assistant"
                value="Available"
              />

              <InfoBox
                label="Document Analysis"
                value="Available"
              />
            </div>
          </section>

          {/* Security */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
                <ShieldCheck size={19} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Account Security
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Manage your account security settings from Settings.
                </p>
              </div>
            </div>

            <button className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Save size={16} />
              Security Settings
            </button>
          </section>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
        <p className="text-xs leading-5 text-blue-900">
          <span className="font-semibold">Legal AI Notice:</span>{" "}
          Profile information is used to personalize your Legal AI Workspace.
          Do not enter unnecessary sensitive information into the system.
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