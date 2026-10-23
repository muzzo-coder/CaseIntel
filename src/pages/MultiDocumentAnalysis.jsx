import {
  Files,
  Upload,
  Search,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  FileText,
  GitCompare,
  Link2,
} from "lucide-react";

function MultiDocumentAnalysis() {
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
              Multi-Document Analysis
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Analyze multiple legal documents together and identify
              relationships, differences, and important information.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800">
            <Upload size={17} />
            Add Documents
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
              placeholder="Search analysis sessions..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={<Files size={20} />}
            label="Analysis Sessions"
            value="9"
          />

          <StatCard
            icon={<FileText size={20} />}
            label="Documents Compared"
            value="34"
          />

          <StatCard
            icon={<GitCompare size={20} />}
            label="Differences Found"
            value="28"
          />

          <StatCard
            icon={<AlertTriangle size={20} />}
            label="Issues Identified"
            value="11"
          />

        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Recent Analysis */}
          <section className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="font-semibold text-slate-900">
                Recent Analysis Sessions
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Recent multi-document comparisons and analysis tasks.
              </p>
            </div>

            <div className="divide-y divide-slate-100">

              <AnalysisRow
                title="Contract Comparison"
                documents="3 documents"
                date="19 Oct 2026"
                status="Analysis Completed"
              />

              <AnalysisRow
                title="Case Document Comparison"
                documents="5 documents"
                date="18 Oct 2026"
                status="Analysis Completed"
              />

              <AnalysisRow
                title="Agreement Comparison"
                documents="4 documents"
                date="17 Oct 2026"
                status="Processing"
              />

            </div>
          </section>

          {/* Analysis Overview */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold text-slate-900">
                Analysis Overview
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Current multi-document analysis activity.
              </p>
            </div>

            <div className="space-y-4 p-5">

              <OverviewItem
                icon={<Files size={18} />}
                label="Documents Processed"
                value="34"
              />

              <OverviewItem
                icon={<GitCompare size={18} />}
                label="Differences Found"
                value="28"
              />

              <OverviewItem
                icon={<Link2 size={18} />}
                label="Related Clauses"
                value="17"
              />

              <OverviewItem
                icon={<AlertTriangle size={18} />}
                label="Review Required"
                value="11"
              />

            </div>
          </section>
        </div>

        {/* Capabilities */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5">
            <h2 className="font-semibold text-slate-900">
              Multi-Document Analysis Capabilities
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Compare and understand information across multiple legal documents.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            <FeatureCard
              title="Document Comparison"
              description="Compare multiple documents and identify important differences."
            />

            <FeatureCard
              title="Clause Comparison"
              description="Compare related clauses across different documents."
            />

            <FeatureCard
              title="Cross-Document Links"
              description="Identify relationships and references between documents."
            />

            <FeatureCard
              title="Combined Summary"
              description="Generate a consolidated summary of information across documents."
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

function AnalysisRow({ title, documents, date, status }) {
  return (
    <div className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">

      <div className="flex items-center gap-3">

        <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
          <Files size={18} />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {documents} • {date}
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

export default MultiDocumentAnalysis;