import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  ShieldCheck,
  FileUp,
  Loader2,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import api from "../services/api";

const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".doc", ".txt", ".md", ".rtf"];
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function UploadDocument() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch active user cases for optional association
  useEffect(() => {
    async function loadCases() {
      try {
        const res = await api.cases.list({ pageSize: 50 });
        setCases(res.items || []);
      } catch (err) {
        // Non-critical: upload can still proceed to library
        console.warn("Could not load user cases for upload selector:", err);
      }
    }
    loadCases();
  }, []);

  const validateAndSetFile = (file) => {
    setError(null);
    setSuccessMessage(null);

    if (!file) return;

    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError(
        `Unsupported file type (${ext}). Please upload a PDF, DOCX, DOC, TXT, MD, or RTF document.`
      );
      return;
    }

    if (file.size > MAX_BYTES) {
      setError("File exceeds the maximum allowed size of 25 MB.");
      return;
    }

    if (file.size === 0) {
      setError("Uploaded file is empty (0 bytes). Please select a valid document.");
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await api.documents.uploadStandalone(
        selectedFile,
        selectedCaseId ? selectedCaseId : null
      );
      setSuccessMessage(
        `Document "${res.original_filename || res.filename}" uploaded and processed successfully!`
      );
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setTimeout(() => {
        navigate("/documents");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to upload document. Please check file format and try again.");
    } finally {
      setUploading(false);
    }
  };

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
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt,.md,.rtf"
          onChange={handleFileInput}
          className="hidden"
        />

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{successMessage} Redirecting to Document Library...</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            <AlertCircle size={18} className="text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Upload Area */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Case Association Selector */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Briefcase size={14} className="text-blue-900" />
              Link to Case Workspace (Optional)
            </label>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">General Document Library (No Case)</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} {c.docket_number ? `(${c.docket_number})` : ""}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-400">
              Documents linked to a case are automatically analyzed during case evaluations.
            </p>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-14 text-center transition ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/30"
            }`}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-800">
              <UploadCloud size={30} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              Upload your legal document
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Drag and drop your document here, or click anywhere to select from your
              computer.
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current && fileInputRef.current.click();
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              <FileUp size={17} />
              Choose File
            </button>

            <p className="mt-4 text-xs text-slate-400">
              Supported formats: PDF, DOCX, TXT, MD, RTF • Maximum size: 25 MB
            </p>
          </div>

          {/* Selected File Preview */}
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-slate-800">
              Selected Document
            </p>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <FileText size={20} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {selectedFile ? selectedFile.name : "No document selected"}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {selectedFile
                      ? `${formatBytes(selectedFile.size)} • Ready to upload`
                      : "Choose a document to continue"}
                  </p>
                </div>
              </div>

              {selectedFile && (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  title="Remove document"
                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Upload Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm transition ${
                !selectedFile || uploading
                  ? "cursor-not-allowed bg-slate-200 text-slate-400"
                  : "bg-blue-900 text-white hover:bg-blue-800"
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 size={17} className="animate-spin text-white" />
                  Processing Document...
                </>
              ) : (
                <>
                  <UploadCloud size={17} />
                  Upload & Analyze
                </>
              )}
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
            <span className="font-semibold">Legal AI Notice:</span> Uploaded
            documents are processed for AI-assisted analysis. AI-generated
            results may contain errors and should be reviewed by a qualified
            legal professional before being relied upon for legal decisions.
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

      <h3 className="mt-4 text-sm font-semibold text-slate-900">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
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