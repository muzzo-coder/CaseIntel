import {
  Gavel,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Scale,
  BookOpen,
} from "lucide-react";

function JudgmentAnalysis() {
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
              Judgment Analysis
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Analyze judgments, identify key findings, and understand the
              reasoning behind judicial decisions.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800">
            <FileText size={17} />
            Upload Judgment
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
              placeholder="Search judgments..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={<Gavel size={20} />}
            label="Judgments Analyzed"
            value="26"
          />

          <StatCard
            icon={<Scale size={20} />}
            label="Legal Issues Identified"
            value="41"
          />

          <StatCard
            icon={<BookOpen size={20} />}
            label="Citations Found"
            value="73"
          />

          <StatCard
            icon={<Clock3 size={20} />}
            label="Pending Analysis"
            value="4"
          />

        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Recent Judgments */}
          <section className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="font-semibold text-slate-900">
                Recent Judgments
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Judgments recently uploaded or analyzed in the workspace.
              </p>
            </div>

            <div className="divide-y divide-slate-100">

              <JudgmentRow
                title="Sample Civil Judgment.pdf"
                court="High Court"
                date="19 Oct 2026"
                status="Analysis Completed"
              />

              <JudgmentRow
                title="Sample Contract Dispute Judgment.pdf"
                court="District Court"
                date="18 Oct 2026"
                status="Analysis Completed"
              />

              <JudgmentRow
                title="Sample Employment Judgment.pdf"
                court="High Court"
                date="17 Oct 2026"
                status="Processing"
              />

            </div>
          </section>

          {/* Analysis Summary */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold text-slate-900">
                Analysis Summary
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Overview of judgment analysis results.
              </p>
            </div>

            <div className="space-y-4 p-5">

              <SummaryItem
                icon={<Scale size={18} />}
                label="Key Legal Issues"
                value="41"
              />

              <SummaryItem
                icon={<BookOpen size={18} />}
                label="Legal Citations"
                value="73"
              />

              <SummaryItem
                icon={<CheckCircle2 size={18} />}
                label="Findings Extracted"
                value="38"
              />

              <SummaryItem
                icon={<AlertTriangle size={18} />}
                label="Items Requiring Review"
                value="7"
              />

            </div>
          </section>
        </div>

        {/* Judgment Analysis Capabilities */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5">
            <h2 className="font-semibold text-slate-900">
              Judgment Analysis Capabilities
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              AI-assisted tools for understanding judicial decisions.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            <FeatureCard
              title="Judgment Summary"
              description="Generate a structured summary of the judgment and its important findings."
            />

            <FeatureCard
              title="Legal Reasoning"
              description="Identify and explain the reasoning used by the court."
            />

            <FeatureCard
              title="Key Findings"
              description="Extract important findings, decisions, and conclusions from the judgment."
            />

            <FeatureCard
              title="Citation Analysis"
              description="Identify relevant legal citations and authorities referenced in the judgment."
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

function JudgmentRow({ title, court, date, status }) {
  return (
    <div className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">

      <div className="flex items-center gap-3">

        <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
          <Gavel size={18} />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {court} • {date}
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

function SummaryItem({ icon, label, value }) {
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

export default JudgmentAnalysis;