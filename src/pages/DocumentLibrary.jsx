import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Upload,
  FileText,
  Eye,
  Download,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  FileCode,
  Hash,
} from "lucide-react";
import api from "../services/api";

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return dateStr;
  }
}

function StatusBadge({ status }) {
  const norm = (status || "").toLowerCase();
  if (norm === "completed" || norm === "processed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
        <CheckCircle2 size={14} />
        Completed
      </span>
    );
  }

  if (norm === "processing" || norm === "pending") {
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
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [totalDocs, setTotalDocs] = useState(0);
  const [stats, setStats] = useState({
    total_documents: 0,
    processed_documents: 0,
    processing_documents: 0,
    failed_documents: 0,
    total_storage_bytes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Documents");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // View modal state
  const [viewingDoc, setViewingDoc] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const data = await api.documents.getStats();
      setStats(data);
    } catch (err) {
      // Non-critical metric fetch failure
      console.error("Failed to fetch document statistics:", err);
    }
  }, []);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        pageSize,
      };
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      if (statusFilter !== "All Documents") {
        if (statusFilter === "Completed") params.status = "processed";
        else if (statusFilter === "Processing") params.status = "processing";
        else if (statusFilter === "Failed") params.status = "failed";
      }
      if (typeFilter !== "All Types") {
        params.fileType = typeFilter.toLowerCase();
      }

      const res = await api.documents.listLibrary(params);
      setDocuments(res.items || []);
      setTotalDocs(res.total || 0);
    } catch (err) {
      setError(err.message || "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchTerm, statusFilter, typeFilter]);

  useEffect(() => {
    fetchDocuments();
    fetchStats();
  }, [fetchDocuments, fetchStats]);

  const handleDownload = async (doc) => {
    try {
      setDownloadingId(doc.id);
      await api.documents.download(doc.id, doc.original_filename || doc.filename);
    } catch (err) {
      alert("Download failed: " + (err.message || "Please try again."));
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (doc) => {
    const docName = doc.original_filename || doc.filename;
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${docName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeletingId(doc.id);
      await api.documents.deleteStandalone(doc.id);
      await fetchDocuments();
      await fetchStats();
      if (viewingDoc && viewingDoc.id === doc.id) {
        setViewingDoc(null);
      }
    } catch (err) {
      alert("Delete failed: " + (err.message || "Please try again."));
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = async (doc) => {
    setViewLoading(true);
    setViewingDoc(doc);
    try {
      const fullDoc = await api.documents.getById(doc.id);
      setViewingDoc(fullDoc);
    } catch (err) {
      console.error("Failed to load document text preview:", err);
    } finally {
      setViewLoading(false);
    }
  };

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

        <button
          onClick={() => navigate("/documents/upload")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
        >
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
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search documents by name..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500"
          >
            <option>All Documents</option>
            <option>Completed</option>
            <option>Processing</option>
            <option>Failed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500"
          >
            <option>All Types</option>
            <option>PDF</option>
            <option>DOCX</option>
            <option>TXT</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Documents</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {stats.total_documents}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Processed</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">
            {stats.processed_documents}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Processing</p>
          <p className="mt-2 text-2xl font-semibold text-amber-600">
            {stats.processing_documents}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Storage</p>
          <p className="mt-2 text-2xl font-semibold text-blue-900">
            {formatBytes(stats.total_storage_bytes)}
          </p>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <Loader2 size={32} className="animate-spin text-blue-900" />
            <p className="mt-3 text-sm">Loading documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <FileText size={24} />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-900">
              No documents found
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {searchTerm || statusFilter !== "All Documents" || typeFilter !== "All Types"
                ? "Try adjusting your search query or filters."
                : "Upload your first legal document to begin AI analysis."}
            </p>
            <button
              onClick={() => navigate("/documents/upload")}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-800"
            >
              <Upload size={14} />
              Upload Now
            </button>
          </div>
        ) : (
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
                {documents.map((document) => (
                  <tr
                    key={document.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                          <FileText size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {document.original_filename || document.filename}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {document.page_count} {document.page_count === 1 ? "page" : "pages"} •{" "}
                            {document.file_type?.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium uppercase text-slate-600">
                      {document.file_type}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatBytes(document.file_size)}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(document.created_at)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={document.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleView(document)}
                          title="View Details & Extracted Content"
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-700"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          onClick={() => handleDownload(document)}
                          disabled={downloadingId === document.id}
                          title="Download File"
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-700 disabled:opacity-50"
                        >
                          {downloadingId === document.id ? (
                            <Loader2 size={17} className="animate-spin text-blue-700" />
                          ) : (
                            <Download size={17} />
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(document)}
                          disabled={deletingId === document.id}
                          title="Delete Document"
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        >
                          {deletingId === document.id ? (
                            <Loader2 size={17} className="animate-spin text-red-600" />
                          ) : (
                            <Trash2 size={17} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty-state / pagination guidance */}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
          <p className="text-xs text-slate-500">
            Showing {documents.length} of {totalDocs} total documents.
          </p>
          {totalDocs > pageSize && (
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page * pageSize >= totalDocs}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
        <p className="text-xs leading-5 text-blue-900">
          <span className="font-semibold">Legal AI Notice:</span> Documents
          uploaded to this workspace are intended for AI-assisted analysis.
          AI-generated results should be reviewed by a qualified legal
          professional before being relied upon for legal decisions.
        </p>
      </div>

      {/* Document View / Text Inspection Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {viewingDoc.original_filename || viewingDoc.filename}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Uploaded on {formatDate(viewingDoc.created_at)} •{" "}
                    {formatBytes(viewingDoc.file_size)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Metadata Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400 uppercase">Status</span>
                  <div className="mt-1">
                    <StatusBadge status={viewingDoc.status} />
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400 uppercase">Format</span>
                  <p className="mt-1 text-sm font-semibold uppercase text-slate-800">
                    {viewingDoc.file_type}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400 uppercase">Pages</span>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {viewingDoc.page_count}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400 uppercase">MIME Type</span>
                  <p className="mt-1 truncate text-xs font-mono text-slate-700">
                    {viewingDoc.mime_type}
                  </p>
                </div>
              </div>

              {/* SHA-256 Checksum */}
              {viewingDoc.file_hash && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 flex items-start gap-2">
                  <Hash size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[11px] font-medium uppercase text-slate-500">
                      SHA-256 Checksum (Authenticity Verification)
                    </span>
                    <p className="mt-0.5 break-all font-mono text-xs text-slate-700">
                      {viewingDoc.file_hash}
                    </p>
                  </div>
                </div>
              )}

              {/* Extracted Text Content */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2 flex items-center gap-1.5">
                  <FileCode size={14} className="text-blue-700" />
                  Extracted Document Text
                </h4>
                {viewLoading ? (
                  <div className="flex items-center justify-center py-12 text-slate-400">
                    <Loader2 size={24} className="animate-spin" />
                    <span className="ml-2 text-sm">Loading extracted content...</span>
                  </div>
                ) : viewingDoc.extracted_text ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 max-h-72 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-800">
                      {viewingDoc.extracted_text}
                    </pre>
                  </div>
                ) : (
                  <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-400">
                    No readable text content extracted or document failed to process.
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 flex justify-between items-center">
              <button
                onClick={() => handleDelete(viewingDoc)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 size={15} />
                Delete
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewingDoc(null)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownload(viewingDoc)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-800"
                >
                  <Download size={15} />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentLibrary;