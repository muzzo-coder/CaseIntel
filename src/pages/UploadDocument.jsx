import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  ShieldCheck,
  FileUp,
} from "lucide-react";

function UploadDocument() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Upload Document
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Upload a legal document to begin AI-powered analysis.
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        {/* Upload Area */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center transition hover:border-blue-400 hover:bg-blue-50/30">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-800">
              <UploadCloud size={30} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              Upload your legal document
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Drag and drop your document here, or select a file from your
              computer.
            </p>

            <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800">
              <FileUp size={17} />
              Choose File
            </button>

            <p className="mt-4 text-xs text-slate-400">
              Supported formats: PDF, DOCX, TXT • Maximum size: 25 MB
            </p>
          </div>

          {/* Selected File Preview */}
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-slate-800">
              Selected Document
            </p>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <FileText size={20} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-900">
                    No document selected
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Choose a document to continue
                  </p>
                </div>
              </div>

              <button
                title="Remove document"
                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Upload Button */}
          <div className="mt-6 flex justify-end">
            <button
              disabled
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-400"
            >
              <UploadCloud size={17} />
              Upload & Analyze
            </button>
          </div>
        </div>

        {/* Processing Information */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoCard
            icon={<FileText size={20} />}
            title="Document Processing"
            text="Your document will be securely processed and converted into readable content."
          />

          <InfoCard
            icon={<ShieldCheck size={20} />}
            title="AI Analysis"
            text="The system can identify important clauses, entities, risks, and key information."
          />

          <InfoCard
            icon={<CheckCircle2 size={20} />}
            title="Review Results"
            text="View extracted information, citations, and AI-generated analysis after processing."
          />
        </div>

        {/* Supported Documents */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">
            Supported Documents
          </h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <FileType type="PDF" description="Portable Document Format" />
            <FileType type="DOCX" description="Microsoft Word Document" />
            <FileType type="TXT" description="Plain Text Document" />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
          <p className="text-xs leading-5 text-blue-900">
            <span className="font-semibold">Legal AI Notice:</span>{" "}
            Uploaded documents are processed for AI-assisted analysis.
            AI-generated results may contain errors and should be reviewed by a
            qualified legal professional before being relied upon for legal
            decisions.
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}

function FileType({ type, description }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm">
        <FileText size={18} />
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-800">{type}</p>
        <p className="text-[11px] text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export default UploadDocument;