import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  Bot,
  Upload,
  ArrowRight,
  Clock,
  Loader2,
} from "lucide-react";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [recentDocs, setRecentDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  useEffect(() => {
    async function loadRecentDocs() {
      try {
        const res = await api.documents.listLibrary({ pageSize: 3 });
        setRecentDocs(res.items || []);
      } catch (err) {
        console.warn("Could not load recent documents for dashboard:", err);
      } finally {
        setLoadingDocs(false);
      }
    }
    loadRecentDocs();
  }, []);

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <ActionCard
          icon={<Bot size={22} />}
          title="AI Legal Assistant"
          description="Ask questions and get AI-powered legal assistance."
          button="Open Assistant"
          onClick={() => navigate("/ai-assistant")}
        />

        <ActionCard
          icon={<Upload size={22} />}
          title="Upload Document"
          description="Upload a legal document for AI-powered analysis."
          button="Upload Document"
          onClick={() => navigate("/documents/upload")}
        />

        <ActionCard
          icon={<Search size={22} />}
          title="Legal Research"
          description="Search and explore relevant legal information."
          button="Start Research"
          onClick={() => navigate("/legal-research")}
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

          <button
            onClick={() => navigate("/documents")}
            className="flex items-center gap-1 text-sm font-medium text-blue-900 hover:text-blue-800"
          >
            View all
            <ArrowRight size={15} />
          </button>
        </div>

        {loadingDocs ? (
          <div className="flex items-center justify-center py-10 text-slate-400">
            <Loader2 size={20} className="animate-spin text-blue-900" />
            <span className="ml-2 text-xs">Loading recent documents...</span>
          </div>
        ) : recentDocs.length === 0 ? (
          <div className="px-6 py-8 text-center text-xs text-slate-500">
            No documents uploaded yet.{" "}
            <button
              onClick={() => navigate("/documents/upload")}
              className="font-semibold text-blue-900 hover:underline"
            >
              Upload your first document
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentDocs.map((doc) => (
              <DocumentRow
                key={doc.id}
                name={doc.original_filename || doc.filename}
                status={doc.status === "processed" ? "Completed" : doc.status === "failed" ? "Failed" : "Processing"}
                onClick={() => navigate("/documents")}
              />
            ))}
          </div>
        )}
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

function ActionCard({ icon, title, description, button, onClick }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-900">
          {icon}
        </div>

        <h3 className="font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      <button
        onClick={onClick}
        className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-900 hover:text-blue-800"
      >
        {button}
        <ArrowRight size={15} />
      </button>
    </div>
  );
}

function DocumentRow({ name, status, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center justify-between px-6 py-4 hover:bg-slate-50 transition"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
          <FileText size={18} className="text-slate-500" />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-800 hover:text-blue-900">
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
            : status === "Failed"
            ? "bg-red-50 text-red-700"
            : "bg-amber-50 text-amber-700"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

export default Dashboard;