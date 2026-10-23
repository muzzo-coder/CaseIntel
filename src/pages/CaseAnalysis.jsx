import {
  BriefcaseBusiness,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Search,
  Plus,
  Users,
} from "lucide-react";

function CaseAnalysis() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">
              Legal AI Workspace
            </p>

            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              Case Analysis
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Organize case information, analyze evidence, and identify important legal issues.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800">
            <Plus size={17} />
            Create Case
          </button>
        </div>

        {/* Search */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search cases..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={<BriefcaseBusiness size={20} />}
            label="Total Cases"
            value="12"
          />

          <StatCard
            icon={<FileText size={20} />}
            label="Documents Analyzed"
            value="48"
          />

          <StatCard
            icon={<AlertTriangle size={20} />}
            label="Issues Identified"
            value="19"
          />

          <StatCard
            icon={<CheckCircle2 size={20} />}
            label="Completed Cases"
            value="8"
          />

        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Recent Cases */}
          <section className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="font-semibold text-slate-900">
                Recent Cases
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Cases recently created or analyzed in the workspace.
              </p>
            </div>

            <div className="divide-y divide-slate-100">

              <CaseRow
                name="Property Dispute Case"
                type="Civil Matter"
                documents="8 documents"
                status="Analysis Completed"
              />

              <CaseRow
                name="Employment Dispute"
                type="Employment Matter"
                documents="5 documents"
                status="Analysis Completed"
              />

              <CaseRow
                name="Contract Dispute"
                type="Commercial Matter"
                documents="11 documents"
                status="Processing"
              />

            </div>
          </section>

          {/* Case Overview */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold text-slate-900">
                Case Overview
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Current analysis activity.
              </p>
            </div>

            <div className="space-y-4 p-5">

              <OverviewItem
                icon={<Users size={18} />}
                label="Parties Identified"
                value="24"
              />

              <OverviewItem
                icon={<FileText size={18} />}
                label="Evidence Items"
                value="36"
              />

              <OverviewItem
                icon={<AlertTriangle size={18} />}
                label="Legal Issues"
                value="19"
              />

              <OverviewItem
                icon={<Clock3 size={18} />}
                label="Pending Analysis"
                value="4"
              />

            </div>
          </section>
        </div>

        {/* Analysis Capabilities */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5">
            <h2 className="font-semibold text-slate-900">
              Case Analysis Capabilities
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              AI-assisted tools for understanding and organizing case information.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            <FeatureCard
              title="Case Summary"
              description="Create a structured overview of the case and its important facts."
            />

            <FeatureCard
              title="Issue Identification"
              description="Identify important legal questions and issues within the case."
            />

            <FeatureCard
              title="Evidence Analysis"
              description="Organize evidence and connect relevant documents with case issues."
            />

            <FeatureCard
              title="Timeline Analysis"
              description="Build a chronological view of important case events."
            />

          </div>
        </section>

        {/* Disclaimer */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs leading-5 text-amber-900">
            <strong>Legal Disclaimer:</strong> AI-generated information is
            provided for informational purposes only and should be reviewed by
            a qualified legal professional before making legal decisions.
          </p>
        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">

        <div className="rounded-lg bg-blue-50 p-2.5 text-blue-800">
          {icon}
        </div>

        <span className="text-2xl font-semibold text-slate-900">
          {value}
        </span>

      </div>

      <p className="mt-3 text-sm text-slate-500">
        {label}
      </p>
    </div>
  );
}

function CaseRow({ name, type, documents, status }) {
  return (
    <div className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">

      <div className="flex items-center gap-3">

        <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
          <BriefcaseBusiness size={18} />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            {name}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {type} • {documents}
          </p>
        </div>

      </div>

      <span
        className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${
          status === "Analysis Completed"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-amber-50 text-amber-700"
        }`}
      >
        {status}
      </span>

    </div>
  );
}

function OverviewItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4">

      <div className="rounded-lg bg-white p-2 text-slate-600 shadow-sm">
        {icon}
      </div>

      <div className="flex-1">
        <p className="text-xs text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-lg font-semibold text-slate-900">
          {value}
        </p>
      </div>

    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/30">

      <h3 className="text-sm font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  );
}

export default CaseAnalysis;