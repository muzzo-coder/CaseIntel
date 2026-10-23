import {
  FileText,
  Download,
  Eye,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MoreVertical,
} from "lucide-react";

const reports = [
  {
    name: "Contract Analysis Report",
    document: "Sample Contract Agreement.pdf",
    type: "Document Analysis",
    date: "19 Oct 2026",
    status: "Completed",
  },
  {
    name: "Legal Research Report",
    document: "Contract Termination Research",
    type: "Legal Research",
    date: "18 Oct 2026",
    status: "Completed",
  },
  {
    name: "Risk Assessment Report",
    document: "Case Document.docx",
    type: "Risk Analysis",
    date: "17 Oct 2026",
    status: "Processing",
  },
];

function Reports() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Reports
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage AI-generated legal analysis reports.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800">
          <FileText size={17} />
          Generate Report
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Reports"
          value="16"
          icon={<FileText size={19} />}
        />

        <StatCard
          title="Completed"
          value="13"
          icon={<CheckCircle2 size={19} />}
        />

        <StatCard
          title="Processing"
          value="2"
          icon={<Clock size={19} />}
        />

        <StatCard
          title="Needs Review"
          value="1"
          icon={<AlertTriangle size={19} />}
        />
      </div>

      {/* Search and Filter */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search reports..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <select className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500">
            <option>All Report Types</option>
            <option>Document Analysis</option>
            <option>Legal Research</option>
            <option>Risk Analysis</option>
          </select>

          <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Calendar size={16} />
            Date
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            Generated Reports
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Reports generated from document analysis and legal research.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Report
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Source
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Type
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  {/* Report */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                        <FileText size={19} />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {report.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          AI-generated report
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Source */}
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {report.document}
                  </td>

                  {/* Type */}
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {report.type}
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {report.date}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={report.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        title="View report"
                        className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        title="Download report"
                        className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Download size={17} />
                      </button>

                      <button
                        title="More options"
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <MoreVertical size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Information */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <InfoCard
          title="Document Analysis"
          text="Reports can summarize extracted information, important clauses, risks, and verification results."
        />

        <InfoCard
          title="Legal Research"
          text="Research reports can organize sources, findings, citations, and verification information."
        />

        <InfoCard
          title="AI-Assisted"
          text="Generated reports should be reviewed before being used for legal decisions."
        />
      </div>

      {/* Disclaimer */}
      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
        <p className="text-xs leading-5 text-blue-900">
          <span className="font-semibold">Legal AI Notice:</span>{" "}
          Reports contain AI-generated information for informational and
          research purposes. They should be reviewed by a qualified legal
          professional before being relied upon for legal decisions.
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-2xl font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === "Completed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
        <CheckCircle2 size={14} />
        Completed
      </span>
    );
  }

  if (status === "Processing") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
        <Clock size={14} />
        Processing
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
      <AlertTriangle size={14} />
      Needs Review
    </span>
  );
}

function InfoCard({ title, text }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
    </div>
  );
}

export default Reports;