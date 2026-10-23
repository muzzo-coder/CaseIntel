import {
  FileText,
  Search,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Download,
} from "lucide-react";

function DocumentAnalysis() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Documents</span>
            <ChevronRight size={15} />
            <span>Document Analysis</span>
          </div>

          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Document Analysis
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review AI-generated insights and extracted information from your
            legal document.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
          <Download size={17} />
          Export Report
        </button>
      </div>

      {/* Document Header */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
              <FileText size={24} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Sample Contract Agreement.pdf
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                PDF • 2.4 MB • Uploaded 19 Oct 2026
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
            <CheckCircle2 size={15} />
            Analysis Completed
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pages"
          value="18"
          description="Document length"
        />

        <StatCard
          title="Clauses"
          value="42"
          description="Identified clauses"
        />

        <StatCard
          title="Risks"
          value="5"
          description="Potential risks"
          danger
        />

        <StatCard
          title="Confidence"
          value="92%"
          description="AI confidence"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Main Analysis */}
        <div className="space-y-6">
          {/* Executive Summary */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionTitle
              icon={<FileText size={19} />}
              title="Executive Summary"
            />

            <p className="mt-4 text-sm leading-7 text-slate-600">
              This document appears to be a contractual agreement between two
              parties. The AI analysis identifies the primary obligations,
              termination conditions, payment-related provisions, and other
              important clauses requiring attention.
            </p>
          </section>

          {/* Key Clauses */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionTitle
              icon={<CheckCircle2 size={19} />}
              title="Key Clauses"
            />

            <div className="mt-5 space-y-3">
              <Clause
                title="Termination Clause"
                text="Defines circumstances under which either party may terminate the agreement."
                status="Needs Review"
              />

              <Clause
                title="Payment Terms"
                text="Specifies payment obligations, deadlines, and related conditions."
                status="Verified"
              />

              <Clause
                title="Confidentiality"
                text="Defines responsibilities concerning confidential information."
                status="Verified"
              />

              <Clause
                title="Liability"
                text="Describes limitations and responsibilities relating to liability."
                status="Partially Verified"
              />
            </div>
          </section>

          {/* Risk Analysis */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionTitle
              icon={<AlertTriangle size={19} />}
              title="Risk Analysis"
            />

            <div className="mt-5 space-y-3">
              <RiskItem
                level="High"
                title="Termination Conditions"
                text="The termination provision may require additional review due to broad conditions."
              />

              <RiskItem
                level="Medium"
                title="Liability Limitation"
                text="The liability section contains conditions that may require professional interpretation."
              />

              <RiskItem
                level="Low"
                title="Notice Period"
                text="The notice period appears clearly defined but should be verified against the complete agreement."
              />
            </div>
          </section>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* AI Agent Status */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionTitle
              icon={<ShieldCheck size={19} />}
              title="AI Analysis Agents"
            />

            <div className="mt-4 space-y-3">
              <Agent
                name="Document Analysis Agent"
                status="Completed"
              />

              <Agent
                name="Risk Analysis Agent"
                status="Completed"
              />

              <Agent
                name="Citation Agent"
                status="Completed"
              />

              <Agent
                name="Verification Agent"
                status="Completed"
              />
            </div>
          </section>

          {/* Verification */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionTitle
              icon={<ShieldCheck size={19} />}
              title="Verification Status"
            />

            <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                <CheckCircle2 size={17} />
                Analysis Verified
              </div>

              <p className="mt-2 text-xs leading-5 text-emerald-700">
                The available extracted information has passed the initial AI
                verification stage.
              </p>
            </div>
          </section>

          {/* Processing Timeline */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionTitle
              icon={<Clock size={19} />}
              title="Processing Timeline"
            />

            <div className="mt-5 space-y-4">
              <TimelineItem
                title="Document Uploaded"
                time="10:31 AM"
                completed
              />

              <TimelineItem
                title="Text Extraction"
                time="10:32 AM"
                completed
              />

              <TimelineItem
                title="AI Analysis"
                time="10:33 AM"
                completed
              />

              <TimelineItem
                title="Verification"
                time="10:34 AM"
                completed
              />
            </div>
          </section>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
        <p className="text-xs leading-5 text-blue-900">
          <span className="font-semibold">Legal AI Notice:</span>{" "}
          AI-generated analysis is provided for informational and research
          purposes. Results may contain errors and should be reviewed by a
          qualified legal professional before being relied upon for legal
          decisions.
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value, description, danger }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <p
        className={`mt-2 text-2xl font-semibold ${
          danger ? "text-red-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </div>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-blue-800">{icon}</div>

      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
    </div>
  );
}

function Clause({ title, text, status }) {
  const statusStyle =
    status === "Verified"
      ? "bg-emerald-50 text-emerald-700"
      : status === "Needs Review"
      ? "bg-amber-50 text-amber-700"
      : "bg-slate-100 text-slate-600";

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>

        <span
          className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyle}`}
        >
          {status}
        </span>
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
    </div>
  );
}

function RiskItem({ level, title, text }) {
  const levelStyle =
    level === "High"
      ? "bg-red-50 text-red-700"
      : level === "Medium"
      ? "bg-amber-50 text-amber-700"
      : "bg-emerald-50 text-emerald-700";

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>

        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${levelStyle}`}
        >
          {level} Risk
        </span>
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
    </div>
  );
}

function Agent({ name, status }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
      <div className="flex items-center gap-3">
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

        <span className="text-xs font-medium text-slate-700">{name}</span>
      </div>

      <span className="text-[11px] font-medium text-emerald-700">
        {status}
      </span>
    </div>
  );
}

function TimelineItem({ title, time, completed }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full ${
          completed
            ? "bg-emerald-50 text-emerald-700"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        <CheckCircle2 size={14} />
      </div>

      <div className="flex-1">
        <p className="text-xs font-medium text-slate-800">{title}</p>
        <p className="mt-0.5 text-[11px] text-slate-400">{time}</p>
      </div>
    </div>
  );
}

export default DocumentAnalysis;