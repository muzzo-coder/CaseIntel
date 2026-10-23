import {
  Search,
  Upload,
  FileText,
  MoreVertical,
  Eye,
  Download,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const documents = [
  {
    name: "Sample Contract Agreement.pdf",
    type: "PDF",
    size: "2.4 MB",
    date: "19 Oct 2026",
    status: "Completed",
  },
  {
    name: "Legal Research Notes.pdf",
    type: "PDF",
    size: "1.8 MB",
    date: "18 Oct 2026",
    status: "Completed",
  },
  {
    name: "Case Document.docx",
    type: "DOCX",
    size: "860 KB",
    date: "17 Oct 2026",
    status: "Processing",
  },
];

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
      <AlertCircle size={14} />
      Failed
    </span>
  );
}

function DocumentLibrary() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 lg:px-10">
      
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Document Library
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage, view, and analyze your legal documents.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800">
          <Upload size={17} />
          Upload Document
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search documents..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </div>

          <select className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500">
            <option>All Documents</option>
            <option>Completed</option>
            <option>Processing</option>
            <option>Failed</option>
          </select>

          <select className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500">
            <option>All Types</option>
            <option>PDF</option>
            <option>DOCX</option>
            <option>TXT</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Documents</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">24</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Processed</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">21</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Processing</p>
          <p className="mt-2 text-2xl font-semibold text-amber-600">3</p>
        </div>
      </div>

      {/* Documents Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            Your Documents
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Documents uploaded to your Legal AI Workspace
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Document
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Type
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Size
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Uploaded
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
              {documents.map((document, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                        <FileText size={20} />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {document.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          Legal document
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {document.type}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {document.size}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {document.date}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={document.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        title="View"
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-700"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        title="Download"
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-700"
                      >
                        <Download size={17} />
                      </button>

                      <button
                        title="More"
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <MoreVertical size={17} />
                      </button>

                      <button
                        title="Delete"
                        className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty-state guidance */}
        <div className="border-t border-slate-100 px-5 py-4">
          <p className="text-xs text-slate-500">
            Upload PDF, DOCX, or TXT legal documents to begin analysis.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
        <p className="text-xs leading-5 text-blue-900">
          <span className="font-semibold">Legal AI Notice:</span>{" "}
          Documents uploaded to this workspace are intended for AI-assisted
          analysis. AI-generated results should be reviewed by a qualified
          legal professional before being relied upon for legal decisions.
        </p>
      </div>
    </div>
  );
}

export default DocumentLibrary;