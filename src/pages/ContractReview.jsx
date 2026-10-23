import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Upload,
  Search,
} from "lucide-react";

function ContractReview() {
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
              Contract Review
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review contracts, identify important clauses, and detect potential risks.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800">
            <Upload size={17} />
            Upload Contract
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
              placeholder="Search contracts..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<FileText size={20} />}
            label="Contracts Reviewed"
            value="18"
          />

          <StatCard
            icon={<AlertTriangle size={20} />}
            label="Risks Identified"
            value="27"
          />

          <StatCard
            icon={<CheckCircle2 size={20} />}
            label="Low Risk"
            value="9"
          />

          <StatCard
            icon={<Clock3 size={20} />}
            label="Pending Review"
            value="3"
          />
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Contracts */}
          <section className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="font-semibold text-slate-900">
                Recent Contracts
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Contracts recently processed by the Legal AI system.
              </p>
            </div>

            <div className="divide-y divide-slate-100">

              <ContractRow
                name="Sample Service Agreement.pdf"
                type="Service Agreement"
                date="19 Oct 2026"
                status="Completed"
                risk="Medium Risk"
              />

              <ContractRow
                name="Employment Agreement.docx"
                type="Employment Contract"
                date="18 Oct 2026"
                status="Completed"
                risk="Low Risk"
              />

              <ContractRow
                name="Vendor Contract.pdf"
                type="Vendor Agreement"
                date="17 Oct 2026"
                status="Processing"
                risk="Review Pending"
              />

            </div>
          </section>

          {/* Risk Summary */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold text-slate-900">
                Risk Summary
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Overview of detected contract risks.
              </p>
            </div>

            <div className="space-y-4 p-5">

              <RiskItem
                label="High Risk"
                value="5"
                description="Clauses requiring immediate review"
                icon={<AlertTriangle size={18} />}
              />

              <RiskItem
                label="Medium Risk"
                value="13"
                description="Clauses requiring attention"
                icon={<ShieldCheck size={18} />}
              />

              <RiskItem
                label="Low Risk"
                value="9"
                description="Minor or manageable concerns"
                icon={<CheckCircle2 size={18} />}
              />

            </div>
          </section>
        </div>

        {/* Review Features */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold text-slate-900">
              Contract Review Capabilities
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              AI-powered tools that will assist with contract analysis.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            <FeatureCard
              title="Clause Analysis"
              description="Identify and summarize important contract clauses."
            />

            <FeatureCard
              title="Risk Detection"
              description="Identify potentially risky or unfavorable clauses."
            />

            <FeatureCard
              title="Obligation Tracking"
              description="Highlight important obligations and responsibilities."
            />

            <FeatureCard
              title="Contract Summary"
              description="Generate a concise overview of the contract."
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

function ContractRow({ name, type, date, status, risk }) {
  return (
    <div className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
          <FileText size={18} />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            {name}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {type} • {date}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            status === "Completed"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {status}
        </span>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {risk}
        </span>
      </div>
    </div>
  );
}

function RiskItem({ label, value, description, icon }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
      <div className="rounded-lg bg-white p-2 text-slate-600 shadow-sm">
        {icon}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">
            {label}
          </p>

          <span className="text-lg font-semibold text-slate-900">
            {value}
          </span>
        </div>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
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

export default ContractReview;