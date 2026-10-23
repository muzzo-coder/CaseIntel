import {
  Settings as SettingsIcon,
  Bell,
  ShieldCheck,
  Palette,
  Brain,
  Database,
  Save,
} from "lucide-react";

function Settings() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your Legal AI Workspace preferences and system settings.
        </p>
      </div>

      <div className="mx-auto max-w-5xl space-y-6">
        {/* General Settings */}
        <SettingSection
          icon={<SettingsIcon size={19} />}
          title="General Settings"
          description="Configure your basic workspace preferences."
        >
          <SettingRow
            title="Workspace Name"
            description="Name displayed throughout the workspace."
          >
            <input
              type="text"
              defaultValue="Legal AI Workspace"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 sm:w-72"
            />
          </SettingRow>

          <SettingRow
            title="Language"
            description="Select the language used in the workspace."
          >
            <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 sm:w-72">
              <option>English</option>
              <option>Hindi</option>
              <option>Marathi</option>
            </select>
          </SettingRow>
        </SettingSection>

        {/* Notifications */}
        <SettingSection
          icon={<Bell size={19} />}
          title="Notifications"
          description="Choose which workspace notifications you want to receive."
        >
          <ToggleRow
            title="Document Processing"
            description="Notify when document processing is completed."
            enabled
          />

          <ToggleRow
            title="AI Analysis Completed"
            description="Notify when AI analysis is ready for review."
            enabled
          />

          <ToggleRow
            title="System Notifications"
            description="Receive important workspace and system updates."
            enabled
          />
        </SettingSection>

        {/* AI Preferences */}
        <SettingSection
          icon={<Brain size={19} />}
          title="AI Preferences"
          description="Configure how AI-assisted analysis is presented."
        >
          <SettingRow
            title="Response Detail"
            description="Choose the level of detail in AI responses."
          >
            <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 sm:w-72">
              <option>Balanced</option>
              <option>Concise</option>
              <option>Detailed</option>
            </select>
          </SettingRow>

          <ToggleRow
            title="Show Verification Status"
            description="Display verification information with AI-generated results."
            enabled
          />

          <ToggleRow
            title="Show Confidence Information"
            description="Display confidence indicators where available."
            enabled
          />
        </SettingSection>

        {/* Appearance */}
        <SettingSection
          icon={<Palette size={19} />}
          title="Appearance"
          description="Customize the visual appearance of the workspace."
        >
          <SettingRow
            title="Theme"
            description="Select your preferred workspace theme."
          >
            <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 sm:w-72">
              <option>Light</option>
              <option>Dark</option>
              <option>System Default</option>
            </select>
          </SettingRow>

          <ToggleRow
            title="Compact Layout"
            description="Use a more compact layout for workspace content."
          />
        </SettingSection>

        {/* Data & Privacy */}
        <SettingSection
          icon={<Database size={19} />}
          title="Data & Privacy"
          description="Manage document and workspace data preferences."
        >
          <ToggleRow
            title="Conversation History"
            description="Save conversations so they can be accessed later."
            enabled
          />

          <ToggleRow
            title="Document Analysis History"
            description="Keep records of completed document analyses."
            enabled
          />

          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">
              Important
            </p>

            <p className="mt-1 text-xs leading-5 text-amber-800">
              Avoid uploading unnecessary personal, confidential, or highly
              sensitive information. Data handling and retention will depend on
              the final backend and deployment configuration.
            </p>
          </div>
        </SettingSection>

        {/* Security */}
        <SettingSection
          icon={<ShieldCheck size={19} />}
          title="Security"
          description="Manage account security options."
        >
          <SettingRow
            title="Password"
            description="Change your account password."
          >
            <button className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Change Password
            </button>
          </SettingRow>

          <SettingRow
            title="Two-Factor Authentication"
            description="Add an additional layer of account protection."
          >
            <button className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Configure
            </button>
          </SettingRow>
        </SettingSection>

        {/* Save */}
        <div className="flex justify-end pb-8">
          <button className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800">
            <Save size={17} />
            Save Settings
          </button>
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
          <p className="text-xs leading-5 text-blue-900">
            <span className="font-semibold">Legal AI Notice:</span>{" "}
            Settings control the behavior and presentation of the workspace.
            AI-generated legal information should always be independently
            reviewed before being relied upon.
          </p>
        </div>
      </div>
    </div>
  );
}

function SettingSection({ icon, title, description, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-slate-100 p-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
          {icon}
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100">{children}</div>
    </section>
  );
}

function SettingRow({ title, description, children }) {
  return (
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-sm font-medium text-slate-800">{title}</h3>

        <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <div className="shrink-0">{children}</div>
    </div>
  );
}

function ToggleRow({ title, description, enabled = false }) {
  return (
    <div className="flex items-center justify-between gap-5 p-5">
      <div>
        <h3 className="text-sm font-medium text-slate-800">{title}</h3>

        <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        aria-label={title}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-blue-800" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

export default Settings;