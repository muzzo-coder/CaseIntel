import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Plus,
  Search,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { useMatter } from "../context/MatterContext";
import { MOCK_MATTERS, MOCK_MATTER } from "../mocks/data";
import DemoTag from "../components/ui/DemoTag";
import Modal from "../components/ui/Modal";
import GoldSeal from "../components/ui/GoldSeal";

export default function Matters() {
  const navigate = useNavigate();
  const { activeMatter, setActiveMatter } = useMatter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMatter, setNewMatter] = useState({
    title: "",
    jurisdiction: "Delhi High Court",
    caseNumber: "",
  });

  const filteredMatters = MOCK_MATTERS.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectMatter = (matter) => {
    setActiveMatter({
      ...MOCK_MATTER,
      id: matter.id,
      title: matter.title,
      documentCount: matter.documents,
      findingCount: matter.findings,
      status: matter.status,
    });
    navigate("/app/dashboard");
  };

  const handleCreateMatter = (e) => {
    e.preventDefault();
    if (!newMatter.title) return;
    const created = {
      _demo: true,
      id: `CI-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newMatter.title,
      documents: 0,
      status: "active",
      findings: 0,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    MOCK_MATTERS.unshift(created);
    setActiveMatter({
      ...MOCK_MATTER,
      ...created,
    });
    setIsModalOpen(false);
    navigate("/app/dashboard");
  };

  return (
    <div className="min-h-full pb-16">
      {/* ─── Black Header Band ───────────────────────────────────────────── */}
      <div className="surface-black border-b border-[var(--ink-800)] px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="meta-label on-black text-[11px] text-[var(--gold-400)]">
                CASE DOSSIER REGISTRY
              </span>
              <DemoTag />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[var(--paper-0)]">
              Client Matters & Proceedings
            </h1>
            <p className="font-doc text-xs text-[var(--ink-300)] mt-1">
              Select an active matter to inspect ingested exhibits, timelines, and cross-document discrepancies.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-md btn-primary-on-black text-xs uppercase tracking-wider self-start sm:self-auto"
          >
            <Plus size={14} />
            New Matter Intake
          </button>
        </div>

        {/* Quick Registry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[var(--ink-800)]">
          <div>
            <div className="meta-label on-black text-[10px]">ACTIVE MATTERS</div>
            <div className="font-display text-2xl text-[var(--paper-0)] font-medium mt-1">03</div>
          </div>
          <div>
            <div className="meta-label on-black text-[10px]">TOTAL EXHIBITS</div>
            <div className="font-display text-2xl text-[var(--paper-0)] font-medium mt-1">14</div>
          </div>
          <div>
            <div className="meta-label on-black text-[10px]">DISCREPANCIES DETECTED</div>
            <div className="font-display text-2xl text-[var(--gold-400)] font-medium mt-1">20</div>
          </div>
          <div>
            <div className="meta-label on-black text-[10px]">CURRENT FOCUS</div>
            <div className="font-mono text-xs text-[var(--paper-0)] mt-2 truncate">
              {activeMatter?.id || "CI-2026-0042"}
            </div>
          </div>
        </div>
      </div>

      {/* ─── White Canvas: Filters & Matters List ───────────────────────── */}
      <div className="px-8 py-8 max-w-7xl">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--paper-500)]"
            />
            <input
              type="text"
              placeholder="Search by case title, matter ID, or parties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="meta-label text-[10px]">STATUS:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-base text-xs py-1.5 px-2.5 w-auto"
            >
              <option value="all">All Matters</option>
              <option value="active">Active</option>
              <option value="analysis-complete">Analysis Complete</option>
              <option value="review">Review</option>
            </select>
          </div>
        </div>

        {/* Matters Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatters.map((matter) => {
            const isActive = activeMatter?.id === matter.id;
            return (
              <div
                key={matter.id}
                className={`rounded border bg-[var(--paper-0)] p-6 transition-all shadow-paper-rest hover:shadow-paper-lift flex flex-col justify-between ${
                  isActive
                    ? "border-[var(--gold-500)] ring-1 ring-[var(--gold-500)]"
                    : "border-[var(--paper-200)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[var(--paper-100)] pb-3">
                    <div className="flex items-center gap-2">
                      <GoldSeal size={18} />
                      <span className="case-id text-xs">{matter.id}</span>
                    </div>
                    {isActive ? (
                      <span className="rounded bg-[var(--gold-100)] px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--gold-600)]">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="rounded bg-[var(--paper-100)] px-2 py-0.5 font-mono text-[10px] text-[var(--paper-700)] uppercase">
                        {matter.status}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-base font-semibold text-[var(--paper-900)] mt-4 leading-snug">
                    {matter.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-[var(--paper-100)] text-xs">
                    <div className="flex items-center gap-2 text-[var(--paper-700)]">
                      <FileText size={14} className="text-[var(--paper-500)]" />
                      <span>{matter.documents} Exhibits</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--gold-600)] font-medium">
                      <AlertTriangle size={14} />
                      <span>{matter.findings} Discrepancies</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--paper-100)] flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[var(--paper-500)]">
                    Updated {matter.updatedAt}
                  </span>
                  <button
                    onClick={() => handleSelectMatter(matter)}
                    className="btn btn-sm btn-primary text-xs uppercase tracking-wider"
                  >
                    {isActive ? "Enter Workspace" : "Select Matter"}
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Intake Modal ───────────────────────────────────────────────── */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Matter Intake"
        maxWidth={500}
      >
        <form onSubmit={handleCreateMatter} className="space-y-4">
          <div>
            <label className="meta-label block mb-1">Matter Title / Cause Title</label>
            <input
              type="text"
              placeholder="e.g. Mehta Infotech v. State of Haryana"
              value={newMatter.title}
              onChange={(e) => setNewMatter({ ...newMatter, title: e.target.value })}
              className="input-base text-sm"
              required
            />
          </div>

          <div>
            <label className="meta-label block mb-1">Forum / Jurisdiction</label>
            <input
              type="text"
              value={newMatter.jurisdiction}
              onChange={(e) => setNewMatter({ ...newMatter, jurisdiction: e.target.value })}
              className="input-base text-sm"
            />
          </div>

          <div>
            <label className="meta-label block mb-1">Case / CNR Number (Optional)</label>
            <input
              type="text"
              placeholder="e.g. CRL.M.C. 4920/2026"
              value={newMatter.caseNumber}
              onChange={(e) => setNewMatter({ ...newMatter, caseNumber: e.target.value })}
              className="input-base text-sm font-mono"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--paper-200)]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-sm btn-secondary text-xs uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-sm btn-primary text-xs uppercase tracking-wider"
            >
              Initialize Matter
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── Footer Disclaimer ──────────────────────────────────────────── */}
      <div className="px-8 mt-12 pt-6 border-t border-[var(--paper-200)] text-center">
        <p className="text-[10px] text-[var(--paper-500)]">
          CaseIntel is a research and review aid, NOT legal advice.
        </p>
      </div>
    </div>
  );
}
