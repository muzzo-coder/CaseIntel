import { useState, useEffect, useCallback, useRef } from "react";
import {
  BriefcaseBusiness,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Search,
  Plus,
  Users,
  Trash2,
  Archive,
  RefreshCw,
  X,
  Loader2,
  Filter,
  Layers,
  ArrowLeft,
  UploadCloud,
  FileUp,
  Sparkles,
  Calendar,
  Scale,
  FileCheck,
  HelpCircle,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import api from "../services/api";

const CASE_TYPES = [
  { value: "all", label: "All Categories" },
  { value: "civil", label: "Civil Matter" },
  { value: "criminal", label: "Criminal Matter" },
  { value: "commercial", label: "Commercial / Corporate" },
  { value: "employment", label: "Employment Dispute" },
  { value: "intellectual_property", label: "Intellectual Property" },
  { value: "family", label: "Family Law" },
  { value: "other", label: "Other" },
];

function CaseAnalysis() {
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState({
    total_cases: 0,
    active_cases: 0,
    completed_cases: 0,
    archived_cases: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showArchived, setShowArchived] = useState(false);

  // Workspace / Selected Case State
  const [selectedCase, setSelectedCase] = useState(null);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState("summary"); // summary, issues, evidence, timeline
  const [caseDocuments, setCaseDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  // Modal & form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    case_number: "",
    case_type: "civil",
    court: "",
    judge: "",
    description: "",
    notes: "",
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [casesRes, statsRes] = await Promise.all([
        api.cases.list({
          search: searchQuery.trim() || undefined,
          caseType: selectedType !== "all" ? selectedType : undefined,
          includeArchived: showArchived,
        }),
        api.cases.getStats(),
      ]);

      setCases(casesRes.items || []);
      setStats(statsRes);
    } catch (err) {
      setError(err.message || "Failed to load case workspaces.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedType, showArchived]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadData]);

  // Load documents and analysis for selected case
  const loadCaseWorkspace = useCallback(async (caseItem) => {
    try {
      setSelectedCase(caseItem);
      setDocsLoading(true);
      setAnalysisLoading(true);
      setAnalysisError(null);

      const [docsRes, analysisRes] = await Promise.allSettled([
        api.documents.list(caseItem.id),
        api.analysis.getCached(caseItem.id),
      ]);

      if (docsRes.status === "fulfilled") {
        setCaseDocuments(docsRes.value.items || []);
      }

      if (analysisRes.status === "fulfilled" && analysisRes.value) {
        setAnalysisData(analysisRes.value);
      } else {
        setAnalysisData(null);
      }
    } catch (err) {
      setAnalysisError(err.message || "Failed to load case workspace.");
    } finally {
      setDocsLoading(false);
      setAnalysisLoading(false);
    }
  }, []);

  const handleRunAnalysis = async (feature = "all") => {
    if (!selectedCase) return;
    try {
      setAnalysisLoading(true);
      setAnalysisError(null);

      let res;
      if (feature === "all") {
        res = await api.analysis.getAll(selectedCase.id);
        setAnalysisData(res);
      } else if (feature === "summary") {
        res = await api.analysis.getSummary(selectedCase.id);
        setAnalysisData((prev) => ({ ...(prev || {}), summary: res }));
      } else if (feature === "issues") {
        res = await api.analysis.getIssues(selectedCase.id);
        setAnalysisData((prev) => ({ ...(prev || {}), issues: res }));
      } else if (feature === "evidence") {
        res = await api.analysis.getEvidence(selectedCase.id);
        setAnalysisData((prev) => ({ ...(prev || {}), evidence: res }));
      } else if (feature === "timeline") {
        res = await api.analysis.getTimeline(selectedCase.id);
        setAnalysisData((prev) => ({ ...(prev || {}), timeline: res }));
      }
    } catch (err) {
      setAnalysisError(err.message || "Failed to generate AI analysis.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCase) return;

    try {
      setUploadingDoc(true);
      await api.documents.upload(selectedCase.id, file);
      // Reload documents and re-run analysis
      const docsRes = await api.documents.list(selectedCase.id);
      setCaseDocuments(docsRes.items || []);
      await handleRunAnalysis("all");
    } catch (err) {
      alert(err.message || "Document upload failed.");
    } finally {
      setUploadingDoc(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!selectedCase) return;
    const confirm = window.confirm("Delete this document from the case workspace?");
    if (!confirm) return;

    try {
      await api.documents.delete(selectedCase.id, docId);
      const docsRes = await api.documents.list(selectedCase.id);
      setCaseDocuments(docsRes.items || []);
      await handleRunAnalysis("all");
    } catch (err) {
      alert(err.message || "Failed to delete document.");
    }
  };

  const handleOpenModal = () => {
    setFormData({
      title: "",
      case_number: "",
      case_type: "civil",
      court: "",
      judge: "",
      description: "",
      notes: "",
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleCreateCase = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setModalError("Please provide a case title or matter name.");
      return;
    }

    try {
      setModalLoading(true);
      setModalError(null);

      const created = await api.cases.create({
        title: formData.title.trim(),
        case_number: formData.case_number.trim() || null,
        case_type: formData.case_type,
        court: formData.court.trim() || null,
        judge: formData.judge.trim() || null,
        description: formData.description.trim() || null,
        notes: formData.notes.trim() || null,
      });

      setIsModalOpen(false);
      await loadData();
      // Automatically open the new case workspace
      loadCaseWorkspace(created);
    } catch (err) {
      setModalError(err.message || "Failed to create case. Please try again.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleArchive = async (caseItem, e) => {
    e?.stopPropagation();
    try {
      setActionLoadingId(caseItem.id);
      await api.cases.archive(caseItem.id, !caseItem.is_archived);
      await loadData();
      if (selectedCase?.id === caseItem.id) {
        setSelectedCase((prev) => ({ ...prev, is_archived: !prev.is_archived }));
      }
    } catch (err) {
      alert(err.message || "Could not update archive status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteCase = async (caseItem, e) => {
    e?.stopPropagation();
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${caseItem.title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setActionLoadingId(caseItem.id);
      await api.cases.delete(caseItem.id);
      if (selectedCase?.id === caseItem.id) {
        setSelectedCase(null);
      }
      await loadData();
    } catch (err) {
      alert(err.message || "Could not delete case.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // If a case is selected, render the dedicated Case Workspace Analysis Interface
  if (selectedCase) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Top Breadcrumb & Actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => setSelectedCase(null)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-900 hover:text-blue-700 transition cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back to All Cases
            </button>

            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.docx,.doc,.txt,.md,.rtf"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingDoc}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition cursor-pointer disabled:opacity-60"
              >
                {uploadingDoc ? <Loader2 size={14} className="animate-spin text-blue-900" /> : <UploadCloud size={15} />}
                Upload Document
              </button>

              <button
                onClick={() => handleRunAnalysis("all")}
                disabled={analysisLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-800 transition cursor-pointer disabled:opacity-60"
              >
                {analysisLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={15} />}
                {analysisData ? "Re-run AI Analysis" : "Run AI Analysis"}
              </button>
            </div>
          </div>

          {/* Case Header Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 uppercase tracking-wide">
                    {selectedCase.case_type}
                  </span>
                  {selectedCase.case_number && (
                    <span className="rounded bg-slate-100 px-2.5 py-0.5 text-xs font-mono text-slate-600">
                      Docket: {selectedCase.case_number}
                    </span>
                  )}
                  {selectedCase.is_archived && (
                    <span className="rounded bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                      Archived
                    </span>
                  )}
                </div>

                <h1 className="mt-2 text-2xl font-bold text-slate-900">
                  {selectedCase.title}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedCase.court ? `Court: ${selectedCase.court}` : "Jurisdiction unassigned"}
                  {selectedCase.judge ? ` • Presiding: Judge ${selectedCase.judge}` : ""}
                </p>

                {selectedCase.description && (
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 max-w-4xl bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <strong className="text-slate-800">Background:</strong> {selectedCase.description}
                  </p>
                )}
              </div>

              <div className="text-right shrink-0">
                <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-700">
                  {selectedCase.status.replace("_", " ").toUpperCase()}
                </span>
                <p className="mt-2 text-xs text-slate-400">
                  {caseDocuments.length} document(s) uploaded
                </p>
              </div>
            </div>

            {/* Document Shelf */}
            <div className="mt-6 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={14} className="text-blue-900" />
                  Attached Case Documents ({caseDocuments.length})
                </h4>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-blue-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={13} />
                  Add File
                </button>
              </div>

              {docsLoading ? (
                <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                  <Loader2 size={13} className="animate-spin" /> Loading documents...
                </div>
              ) : caseDocuments.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center">
                  <p className="text-xs text-slate-500">
                    No documents uploaded yet. Add pleadings, contracts, depositions, or exhibits (PDF, DOCX, TXT) to generate citation-backed AI intelligence.
                  </p>
                </div>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {caseDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileText size={16} className="text-blue-700 shrink-0" />
                        <div className="min-w-0 flex-1 truncate">
                          <p className="font-medium text-slate-800 truncate" title={doc.filename}>
                            {doc.filename}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {doc.file_type.toUpperCase()} • {doc.page_count} pg • {(doc.file_size / 1024).toFixed(0)} KB
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        title="Delete Document"
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Analysis Tab Navigation */}
          <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 shadow-xs">
            <button
              onClick={() => setActiveAnalysisTab("summary")}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
                activeAnalysisTab === "summary"
                  ? "border-blue-900 text-blue-900"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <BriefcaseBusiness size={16} />
              1. Case Summary
            </button>

            <button
              onClick={() => setActiveAnalysisTab("issues")}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
                activeAnalysisTab === "issues"
                  ? "border-blue-900 text-blue-900"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Scale size={16} />
              2. Issue Identification
            </button>

            <button
              onClick={() => setActiveAnalysisTab("evidence")}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
                activeAnalysisTab === "evidence"
                  ? "border-blue-900 text-blue-900"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileCheck size={16} />
              3. Evidence Analysis
            </button>

            <button
              onClick={() => setActiveAnalysisTab("timeline")}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
                activeAnalysisTab === "timeline"
                  ? "border-blue-900 text-blue-900"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Calendar size={16} />
              4. Timeline Analysis
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="rounded-b-xl border border-slate-200 border-t-0 bg-white p-6 shadow-sm min-h-[400px]">
            {analysisLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Loader2 size={32} className="animate-spin text-blue-900 mb-3" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Processing Legal Intelligence...
                </h3>
                <p className="mt-1 text-xs text-slate-500 max-w-sm">
                  Analyzing document texts, extracting factual propositions, identifying legal controversy, and building traceable source citations.
                </p>
              </div>
            ) : analysisError ? (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-xs text-red-700 flex items-center justify-between">
                <span>{analysisError}</span>
                <button
                  onClick={() => handleRunAnalysis(activeAnalysisTab)}
                  className="font-semibold underline ml-4"
                >
                  Retry
                </button>
              </div>
            ) : !analysisData ? (
              <div className="py-16 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-900">
                  <Sparkles size={26} />
                </div>
                <h3 className="text-base font-semibold text-slate-900">
                  AI Case Analysis Not Run Yet
                </h3>
                <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                  Execute the AI engine to generate structured summaries, legal issues, evidence matrices, and chronological timelines from your case materials.
                </p>
                <button
                  onClick={() => handleRunAnalysis("all")}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-800 transition cursor-pointer"
                >
                  <Sparkles size={15} />
                  Run AI Analysis Now
                </button>
              </div>
            ) : (
              <div>
                {/* 1. Case Summary Tab */}
                {activeAnalysisTab === "summary" && (
                  <SummaryView
                    summary={analysisData.summary}
                    onRefresh={() => handleRunAnalysis("summary")}
                  />
                )}

                {/* 2. Issue Identification Tab */}
                {activeAnalysisTab === "issues" && (
                  <IssuesView
                    issues={analysisData.issues}
                    onRefresh={() => handleRunAnalysis("issues")}
                  />
                )}

                {/* 3. Evidence Analysis Tab */}
                {activeAnalysisTab === "evidence" && (
                  <EvidenceView
                    evidence={analysisData.evidence}
                    onRefresh={() => handleRunAnalysis("evidence")}
                  />
                )}

                {/* 4. Timeline Analysis Tab */}
                {activeAnalysisTab === "timeline" && (
                  <TimelineView
                    timeline={analysisData.timeline}
                    onRefresh={() => handleRunAnalysis("timeline")}
                  />
                )}
              </div>
            )}
          </div>

          {/* Legal Disclaimer */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs leading-5 text-amber-900">
              <strong>Legal Disclaimer:</strong> AI-generated summaries, issue maps, evidence associations, and timelines are provided for decision support and research assistance. All outputs must be independently reviewed and verified by qualified counsel of record.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Primary Case Analysis Dashboard (Listing & Capabilities)
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
              Case Analysis
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Organize case information, analyze evidence, and identify important legal issues.
            </p>
          </div>

          <button
            onClick={handleOpenModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 cursor-pointer"
          >
            <Plus size={17} />
            Create Case
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cases by title, court, or docket number..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex items-center">
                <Filter size={15} className="absolute left-3 text-slate-400" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-8 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                >
                  {CASE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 hover:bg-slate-100 transition">
                <input
                  type="checkbox"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                  className="rounded border-slate-300 text-blue-900 focus:ring-blue-500 cursor-pointer"
                />
                Show Archived
              </label>

              <button
                onClick={loadData}
                title="Refresh case data"
                className="p-2.5 text-slate-500 hover:text-blue-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition cursor-pointer"
              >
                <RefreshCw size={16} className={loading ? "animate-spin text-blue-900" : ""} />
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<BriefcaseBusiness size={20} />}
            label="Total Cases"
            value={stats.total_cases}
          />

          <StatCard
            icon={<Clock3 size={20} />}
            label="Active Matters"
            value={stats.active_cases}
          />

          <StatCard
            icon={<CheckCircle2 size={20} />}
            label="Completed Cases"
            value={stats.completed_cases}
          />

          <StatCard
            icon={<Archive size={20} />}
            label="Archived Cases"
            value={stats.archived_cases}
          />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={loadData}
              className="text-xs font-semibold underline hover:text-red-900 ml-4 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Cases List */}
          <section className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col">
            <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Case Workspaces
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Select a matter to run AI case summaries, issue extraction, and timelines.
                </p>
              </div>

              {loading && (
                <div className="flex items-center gap-1.5 text-xs text-blue-700 font-medium">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Loading...</span>
                </div>
              )}
            </div>

            <div className="divide-y divide-slate-100 flex-1">
              {!loading && cases.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-900">
                    <BriefcaseBusiness size={24} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">No cases found</h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                    {searchQuery || selectedType !== "all"
                      ? "No matters matched your current filter criteria. Try adjusting your search term."
                      : "You haven't created any legal case workspaces yet. Create your first case to begin organizing matters and evidence."}
                  </p>
                  <button
                    onClick={handleOpenModal}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-800 transition cursor-pointer"
                  >
                    <Plus size={15} />
                    Create First Case
                  </button>
                </div>
              ) : (
                cases.map((caseItem) => (
                  <CaseRowItem
                    key={caseItem.id}
                    caseItem={caseItem}
                    isLoading={actionLoadingId === caseItem.id}
                    onOpen={() => loadCaseWorkspace(caseItem)}
                    onArchive={(e) => handleToggleArchive(caseItem, e)}
                    onDelete={(e) => handleDeleteCase(caseItem, e)}
                  />
                ))
              )}
            </div>
          </section>

          {/* Case Overview / Metrics Breakdown */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm h-fit">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold text-slate-900">
                Workspace Overview
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Current matters status and distribution.
              </p>
            </div>

            <div className="space-y-4 p-5">
              <OverviewItem
                icon={<BriefcaseBusiness size={18} />}
                label="Active Matters"
                value={stats.active_cases}
              />

              <OverviewItem
                icon={<CheckCircle2 size={18} />}
                label="Completed Analysis"
                value={stats.completed_cases}
              />

              <OverviewItem
                icon={<Archive size={18} />}
                label="Archived Matters"
                value={stats.archived_cases}
              />

              <OverviewItem
                icon={<Layers size={18} />}
                label="Total Workspaces"
                value={stats.total_cases}
              />
            </div>
          </section>
        </div>

        {/* Analysis Capabilities */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold text-slate-900">
              Case Analysis Capabilities
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              AI-assisted tools for understanding and organizing case information. Click any capability to explore.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              title="1. Case Summary"
              description="Create a structured overview of the case, key facts, parties, and claims."
              onClick={() => {
                if (cases.length > 0) {
                  loadCaseWorkspace(cases[0]);
                  setActiveAnalysisTab("summary");
                } else {
                  handleOpenModal();
                }
              }}
            />
            <FeatureCard
              title="2. Issue Identification"
              description="Identify important legal questions, disputed facts, and relevant legal issues."
              onClick={() => {
                if (cases.length > 0) {
                  loadCaseWorkspace(cases[0]);
                  setActiveAnalysisTab("issues");
                } else {
                  handleOpenModal();
                }
              }}
            />
            <FeatureCard
              title="3. Evidence Analysis"
              description="Organize evidence, map to issues, and highlight supporting or conflicting information."
              onClick={() => {
                if (cases.length > 0) {
                  loadCaseWorkspace(cases[0]);
                  setActiveAnalysisTab("evidence");
                } else {
                  handleOpenModal();
                }
              }}
            />
            <FeatureCard
              title="4. Timeline Analysis"
              description="Build a chronological view of important case events with source citations."
              onClick={() => {
                if (cases.length > 0) {
                  loadCaseWorkspace(cases[0]);
                  setActiveAnalysisTab("timeline");
                } else {
                  handleOpenModal();
                }
              }}
            />
          </div>
        </section>

        {/* Legal Disclaimer */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs leading-5 text-amber-900">
            <strong>Legal Disclaimer:</strong> AI-generated information is
            provided for informational purposes only and should be reviewed by
            a qualified legal professional before making legal decisions.
          </p>
        </div>

      </div>

      {/* Create Case Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-900 rounded-lg">
                  <BriefcaseBusiness size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Create Case Workspace</h3>
                  <p className="text-xs text-slate-500">Initialize a new legal matter workspace</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="p-6 space-y-4">
              {modalError && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2">
                  <AlertTriangle size={15} className="text-red-500 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Case Title / Matter Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NovaTech v. Apex Dynamics"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Docket / Case Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CV-2026-0812"
                    value={formData.case_number}
                    onChange={(e) => setFormData({ ...formData, case_number: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Matter Category
                  </label>
                  <select
                    value={formData.case_type}
                    onChange={(e) => setFormData({ ...formData, case_type: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                  >
                    <option value="civil">Civil Matter</option>
                    <option value="criminal">Criminal Matter</option>
                    <option value="commercial">Commercial / Corporate</option>
                    <option value="employment">Employment Dispute</option>
                    <option value="intellectual_property">Intellectual Property</option>
                    <option value="family">Family Law</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jurisdiction / Court
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Delaware Court of Chancery"
                    value={formData.court}
                    onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Presiding Judge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chancellor McCormick"
                    value={formData.judge}
                    onChange={(e) => setFormData({ ...formData, judge: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Matter Background
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief factual overview of the dispute, breach, allegations, or background..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={modalLoading}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-800 transition disabled:opacity-70 cursor-pointer"
                >
                  {modalLoading && <Loader2 size={14} className="animate-spin" />}
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// AI Analysis Views (4 Pillars)
// -----------------------------------------------------------------------------

function SummaryView({ summary, onRefresh }) {
  if (!summary) {
    return <EmptyAnalysisPrompt featureName="Case Summary" onGenerate={onRefresh} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Case Summary & Structured Synthesis
          </h3>
          <p className="text-xs text-slate-500">
            Key facts, identified parties, asserted claims, and procedural posture.
          </p>
        </div>
        <span className="text-[11px] font-mono bg-blue-50 text-blue-800 px-2.5 py-1 rounded border border-blue-100">
          Engine: {summary.model_used || "caseintel-nlp-engine"}
        </span>
      </div>

      {/* Narrative Context */}
      {summary.case_context && (
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs leading-relaxed text-slate-700">
          <strong className="text-slate-900 block mb-1">Executive Synopsis:</strong>
          {summary.case_context}
        </div>
      )}

      {/* Procedural Posture */}
      <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-4">
        <h4 className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-1">
          Procedural Status
        </h4>
        <p className="text-xs text-blue-800">
          {summary.procedural_status}
        </p>
      </div>

      {/* Key Facts */}
      <div>
        <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5">
          Key Established Facts
        </h4>
        <ul className="space-y-2">
          {summary.key_facts?.map((fact, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50/70 p-3 rounded-lg border border-slate-100"
            >
              <CheckCircle2 size={15} className="text-blue-900 shrink-0 mt-0.5" />
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Parties Involved */}
      <div>
        <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5">
          Parties & Representation
        </h4>
        <div className="grid gap-3 sm:grid-cols-2">
          {summary.parties?.map((p, idx) => (
            <div key={idx} className="rounded-lg border border-slate-200 p-3 text-xs bg-white shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{p.name}</span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                  {p.role}
                </span>
              </div>
              {p.counsel && (
                <p className="mt-1 text-slate-500">
                  <strong>Counsel:</strong> {p.counsel}
                </p>
              )}
              {p.description && (
                <p className="mt-1 text-slate-600 line-clamp-2">
                  {p.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Claims */}
      <div>
        <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5">
          Asserted Claims & Legal Basis
        </h4>
        <div className="space-y-2">
          {summary.claims?.map((c, idx) => (
            <div key={idx} className="rounded-lg border border-slate-200 p-3 text-xs bg-slate-50">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{c.claim}</span>
                <span className="text-[11px] text-slate-500">By: {c.asserted_by}</span>
              </div>
              {c.legal_basis && (
                <p className="mt-1 text-slate-600">
                  <span className="font-medium text-slate-700">Basis:</span> {c.legal_basis}
                </p>
              )}
              {c.relief_sought && (
                <p className="mt-0.5 text-slate-600">
                  <span className="font-medium text-slate-700">Relief:</span> {c.relief_sought}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Source Citations */}
      <CitationsList citations={summary.source_citations} />
    </div>
  );
}

function IssuesView({ issues, onRefresh }) {
  if (!issues) {
    return <EmptyAnalysisPrompt featureName="Issue Identification" onGenerate={onRefresh} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Legal Issue Identification & Controversy Map
          </h3>
          <p className="text-xs text-slate-500">
            Substantive and procedural legal questions and factual controversies.
          </p>
        </div>
        <span className="text-[11px] font-mono bg-blue-50 text-blue-800 px-2.5 py-1 rounded border border-blue-100">
          Issues: {issues.legal_issues?.length || 0}
        </span>
      </div>

      {/* Primary Legal Issues */}
      <div>
        <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
          Identified Legal Issues
        </h4>
        <div className="space-y-3">
          {issues.legal_issues?.map((issue) => (
            <div key={issue.id} className="rounded-xl border border-slate-200 p-4 bg-white shadow-2xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                    {issue.id}
                  </span>
                  <h5 className="text-sm font-semibold text-slate-900">{issue.title}</h5>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 uppercase">
                    {issue.category}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                      issue.priority === "high"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {issue.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {issue.description}
              </p>
              {issue.applicable_law_or_rule && (
                <p className="mt-2 text-[11px] text-blue-800 bg-blue-50/50 p-2 rounded">
                  <strong>Framework:</strong> {issue.applicable_law_or_rule}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Disputed Facts */}
      {issues.disputed_facts?.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
            Contested / Disputed Facts
          </h4>
          <div className="space-y-3">
            {issues.disputed_facts.map((df, idx) => (
              <div key={idx} className="rounded-xl border border-amber-200 bg-amber-50/30 p-4 text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-900 mb-2">
                  <AlertTriangle size={15} className="text-amber-600" />
                  <span>{df.fact}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 mt-2">
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="font-semibold text-blue-900 block mb-1">Plaintiff / Proponent:</span>
                    <p className="text-slate-600">{df.party_a_position}</p>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="font-semibold text-red-900 block mb-1">Defense / Counter:</span>
                    <p className="text-slate-600">{df.party_b_position}</p>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  <strong>Relevance:</strong> {df.relevance}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legal Questions */}
      {issues.legal_questions?.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5">
            Key Questions for Judicial Determination
          </h4>
          <div className="space-y-2">
            {issues.legal_questions.map((q, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-xs bg-slate-50">
                <HelpCircle size={16} className="text-blue-800 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">{q.question}</p>
                  <p className="mt-0.5 text-slate-500">{q.context}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <CitationsList citations={issues.source_citations} />
    </div>
  );
}

function EvidenceView({ evidence, onRefresh }) {
  if (!evidence) {
    return <EmptyAnalysisPrompt featureName="Evidence Analysis" onGenerate={onRefresh} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Evidence Catalog & Issue Mapping
          </h3>
          <p className="text-xs text-slate-500">
            Documentary evidence cross-referenced against legal issues with favorable and adverse highlights.
          </p>
        </div>
        <span className="text-[11px] font-mono bg-blue-50 text-blue-800 px-2.5 py-1 rounded border border-blue-100">
          Items: {evidence.evidence_items?.length || 0}
        </span>
      </div>

      {/* Evidence Catalog */}
      <div>
        <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
          Cataloged Evidence Items
        </h4>
        <div className="grid gap-3 sm:grid-cols-2">
          {evidence.evidence_items?.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 p-4 bg-white shadow-2xs text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                  {item.id}
                </span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 uppercase">
                  {item.evidence_type}
                </span>
              </div>
              <h5 className="font-semibold text-slate-900 mt-2">{item.title}</h5>
              <p className="text-slate-600 mt-1 line-clamp-3">{item.description}</p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2">
                <span>Proponent: {item.proponent || "Disclosed"}</span>
                <span className="text-blue-900 font-semibold">
                  Weight: {(item.relevance_score * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issue Associations */}
      {evidence.issue_associations?.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
            Evidence to Issue Associations
          </h4>
          <div className="space-y-3">
            {evidence.issue_associations.map((assoc, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">
                    {assoc.issue_id}: {assoc.issue_title}
                  </span>
                  <div className="flex items-center gap-1">
                    {assoc.associated_evidence?.map((evId) => (
                      <span key={evId} className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-[10px]">
                        {evId}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-slate-600">{assoc.analysis}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supporting vs. Conflicting Highlights */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Supporting */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4">
          <h4 className="text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-emerald-600" />
            Supporting / Favorable Points
          </h4>
          <div className="space-y-2.5">
            {evidence.supporting_evidence?.map((supp, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-emerald-100 text-xs">
                <p className="font-medium text-slate-900">{supp.point}</p>
                {supp.source?.excerpt && (
                  <p className="mt-1 text-[11px] text-slate-500 italic bg-slate-50 p-1.5 rounded">
                    "{supp.source.excerpt}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Conflicting */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/30 p-4">
          <h4 className="text-xs font-semibold text-amber-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <ShieldAlert size={16} className="text-amber-600" />
            Conflicting / Adverse Evidence
          </h4>
          <div className="space-y-2.5">
            {evidence.conflicting_evidence?.map((conf, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-amber-100 text-xs">
                <p className="font-medium text-slate-900">{conf.point}</p>
                {conf.source?.excerpt && (
                  <p className="mt-1 text-[11px] text-slate-500 italic bg-slate-50 p-1.5 rounded">
                    "{conf.source.excerpt}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <CitationsList citations={evidence.source_citations} />
    </div>
  );
}

function TimelineView({ timeline, onRefresh }) {
  if (!timeline) {
    return <EmptyAnalysisPrompt featureName="Timeline Analysis" onGenerate={onRefresh} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Chronological Case Event Timeline
          </h3>
          <p className="text-xs text-slate-500">
            Important dates, occurrences, and actions extracted with exact source references.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-mono bg-blue-50 text-blue-800 px-2.5 py-1 rounded border border-blue-100">
            {timeline.total_events || timeline.events?.length || 0} Event(s)
          </span>
          {timeline.date_range && (
            <p className="text-[10px] text-slate-400 mt-1">{timeline.date_range}</p>
          )}
        </div>
      </div>

      {/* Visual Timeline Stream */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-blue-100">
        {timeline.events?.map((evt, idx) => (
          <div key={evt.id || idx} className="relative group">
            {/* Dot node */}
            <div
              className={`absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full border-2 bg-white transition ${
                evt.significance === "critical"
                  ? "border-red-500 group-hover:scale-125"
                  : "border-blue-700 group-hover:scale-125"
              }`}
            />

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs text-xs transition hover:border-blue-300">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-blue-900 text-white px-2.5 py-0.5 text-[11px] font-semibold">
                    {evt.date}
                  </span>
                  <h5 className="font-semibold text-slate-900 text-sm">{evt.title}</h5>
                </div>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                    evt.significance === "critical"
                      ? "bg-red-50 text-red-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {evt.significance.toUpperCase()}
                </span>
              </div>

              <p className="mt-2 text-slate-600 leading-relaxed">{evt.description}</p>

              {evt.actors?.length > 0 && (
                <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400">Actors:</span>
                  {evt.actors.map((actor, aIdx) => (
                    <span
                      key={aIdx}
                      className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              )}

              {evt.citation && (
                <div className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-slate-500 flex items-start gap-1.5 bg-slate-50 p-2 rounded">
                  <FileText size={12} className="text-blue-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Source:</strong> {evt.citation.document_name} — "{evt.citation.excerpt}"
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <CitationsList citations={timeline.source_citations} />
    </div>
  );
}

// Traceable Citations Component
function CitationsList({ citations }) {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-6 border-t border-slate-200 pt-4">
      <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
        <ExternalLink size={14} className="text-blue-900" />
        Traceable Source Citations ({citations.length})
      </h4>
      <div className="grid gap-2 sm:grid-cols-2">
        {citations.map((c, idx) => (
          <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-xs">
            <div className="flex items-center justify-between text-[11px] font-semibold text-blue-900">
              <span className="truncate">{c.document_name}</span>
              {c.page_number && <span>p. {c.page_number}</span>}
            </div>
            <p className="mt-1 text-slate-600 italic line-clamp-2">
              "{c.excerpt}"
            </p>
            {c.relevance && (
              <p className="mt-1 text-[10px] text-slate-400">
                {c.relevance}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyAnalysisPrompt({ featureName, onGenerate }) {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-900">
        <Sparkles size={22} />
      </div>
      <h4 className="text-sm font-semibold text-slate-900">
        {featureName} Ready to Generate
      </h4>
      <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
        Analyze the case details and documents to generate {featureName.toLowerCase()} with traceable citations.
      </p>
      <button
        onClick={onGenerate}
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-800 transition cursor-pointer"
      >
        <Sparkles size={14} />
        Generate {featureName}
      </button>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Existing Helper Components
// -----------------------------------------------------------------------------

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-blue-50 p-2.5 text-blue-800">
          {icon}
        </div>
        <span className="text-2xl font-semibold text-slate-900">
          {value ?? 0}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-500">
        {label}
      </p>
    </div>
  );
}

function CaseRowItem({ caseItem, isLoading, onOpen, onArchive, onDelete }) {
  const getStatusBadge = (status, isArchived) => {
    if (isArchived) {
      return {
        label: "Archived",
        className: "bg-slate-100 text-slate-700 border-slate-200",
      };
    }
    switch (status) {
      case "analysis_completed":
        return {
          label: "Analysis Completed",
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "pending_analysis":
        return {
          label: "Pending Analysis",
          className: "bg-amber-50 text-amber-700 border-amber-200",
        };
      default:
        return {
          label: "Active Matter",
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };
    }
  };

  const badge = getStatusBadge(caseItem.status, caseItem.is_archived);

  const formatCategory = (cat) => {
    const item = CASE_TYPES.find((t) => t.value === cat);
    return item ? item.label : cat || "General Matter";
  };

  return (
    <div
      onClick={onOpen}
      className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between hover:bg-slate-50/70 transition cursor-pointer group"
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600 shrink-0 mt-0.5 group-hover:bg-blue-50 group-hover:text-blue-900 transition">
          <BriefcaseBusiness size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-900 transition">
              {caseItem.title}
            </p>
            {caseItem.case_number && (
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                {caseItem.case_number}
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-slate-500">
            {formatCategory(caseItem.case_type)}
            {caseItem.court ? ` • ${caseItem.court}` : ""}
            {caseItem.judge ? ` • Judge ${caseItem.judge}` : ""}
          </p>
          {caseItem.description && (
            <p className="mt-1 text-xs text-slate-600 line-clamp-1">
              {caseItem.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 self-end md:self-center shrink-0">
        <span
          className={`w-fit rounded-full border px-2.5 py-1 text-xs font-medium ${badge.className}`}
        >
          {badge.label}
        </span>

        <button
          onClick={onOpen}
          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-900 hover:bg-blue-100 transition"
        >
          Open Workspace
          <ChevronRight size={13} />
        </button>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
          <button
            onClick={onArchive}
            disabled={isLoading}
            title={caseItem.is_archived ? "Restore Case" : "Archive Case"}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition cursor-pointer"
          >
            <Archive size={15} />
          </button>

          <button
            onClick={onDelete}
            disabled={isLoading}
            title="Delete Case"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition cursor-pointer"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

function OverviewItem({ icon, label, value }) {
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
          {value ?? 0}
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="rounded-lg border border-slate-200 p-4 transition hover:border-blue-400 hover:bg-blue-50/40 cursor-pointer group"
    >
      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-900 transition flex items-center justify-between">
        {title}
        <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-900 group-hover:translate-x-0.5 transition" />
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default CaseAnalysis;