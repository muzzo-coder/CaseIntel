import {
  FileText,
  Search,
  Bot,
  Upload,
  ArrowRight,
  Clock,
} from "lucide-react";

function Dashboard() {
  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome to Legal AI Workspace
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Analyze documents, research legal information, and work with AI-powered legal agents.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-5">

        <ActionCard
          icon={<Bot size={22} />}
          title="AI Legal Assistant"
          description="Ask questions and get AI-powered legal assistance."
          button="Open Assistant"
        />

        <ActionCard
          icon={<Upload size={22} />}
          title="Upload Document"
          description="Upload a legal document for AI-powered analysis."
          button="Upload Document"
        />

        <ActionCard
          icon={<Search size={22} />}
          title="Legal Research"
          description="Search and explore relevant legal information."
          button="Start Research"
        />

      </div>

      {/* Recent documents */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white">

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

          <div className="flex items-center gap-2">
            <FileText size={19} className="text-blue-900" />

            <h2 className="font-semibold text-slate-900">
              Recent Documents
            </h2>
          </div>

          <button className="flex items-center gap-1 text-sm font-medium text-blue-900">
            View all
            <ArrowRight size={15} />
          </button>

        </div>

        <div className="divide-y divide-slate-100">

          <DocumentRow
            name="Sample Legal Agreement.pdf"
            status="Completed"
          />

          <DocumentRow
            name="Contract Analysis.pdf"
            status="Processing"
          />

          <DocumentRow
            name="Case Document.pdf"
            status="Completed"
          />

        </div>

      </div>

      {/* Disclaimer */}
      <div className="mt-8 rounded-lg border border-slate-200 bg-slate-100 px-5 py-4 text-sm text-slate-600">
        <strong className="text-slate-800">
          Legal Disclaimer:
        </strong>{" "}
        AI-generated information is provided for informational purposes only
        and should be reviewed by a qualified legal professional.
      </div>

    </div>
  );
}

function ActionCard({ icon, title, description, button }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-900">
        {icon}
      </div>

      <h3 className="font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <button className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-900">
        {button}
        <ArrowRight size={15} />
      </button>

    </div>
  );
}

function DocumentRow({ name, status }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
          <FileText size={18} className="text-slate-500" />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-800">
            {name}
          </p>

          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
            <Clock size={12} />
            Recently updated
          </p>
        </div>

      </div>

      <span
        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
          status === "Completed"
            ? "bg-green-50 text-green-700"
            : "bg-amber-50 text-amber-700"
        }`}
      >
        {status}
      </span>

    </div>
  );
}

export default Dashboard;