import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  FileText,
  Search,
  Upload,
} from "lucide-react";
import { useMatter } from "../context/MatterContext";
import { MOCK_MATTER, MOCK_DOCUMENTS } from "../mocks/data";
import DemoTag from "../components/ui/DemoTag";

export default function DocumentLibrary() {
  const { activeMatter = MOCK_MATTER } = useMatter() || {};
  const matter = activeMatter || MOCK_MATTER;

  const [documents] = useState(MOCK_DOCUMENTS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-full pb-16">
      {/* ─── Header Strip ───────────────────────────────────────────────── */}
      <div className="surface-black border-b border-[var(--ink-800)] px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="case-id text-xs text-[var(--gold-400)]">
                {matter.id}
              </span>
              <span className="text-[var(--ink-600)]">·</span>
              <span className="meta-label on-black text-[10px]">
                EVIDENTIARY DOSSIER
              </span>
              <DemoTag />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[var(--paper-0)]">
              Ingested Exhibits & Pleadings
            </h1>
            <p className="font-doc text-xs text-[var(--ink-300)] mt-1 max-w-xl">
              Inspect OCR status, extracted entities, and verbatim source passages for each filed document in {matter.title}.
            </p>
          </div>

          <Link
            to="/app/upload"
            className="btn btn-md btn-primary-on-black text-xs uppercase tracking-wider self-start md:self-auto"
          >
            <Upload size={14} />
            Upload New Exhibit
          </Link>
        </div>
      </div>

      {/* ─── Main Content Canvas ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--paper-500)]"
            />
            <input
              type="text"
              placeholder="Search documents by name or exhibit label..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="meta-label text-[10px]">TYPE FILTER:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-base text-xs py-1.5 px-2.5 w-auto"
            >
              <option value="all">All Types</option>
              <option value="Complaint">Complaint</option>
              <option value="Statement">Witness Statement</option>
              <option value="Report">Report / Register</option>
            </select>
          </div>
        </div>

        {/* Documents Table */}
        <div className="rounded border border-[var(--paper-200)] bg-[var(--paper-0)] shadow-paper-rest overflow-hidden">
          <table className="table-legal">
            <thead>
              <tr>
                <th>DOCUMENT NAME</th>
                <th>EXHIBIT TYPE</th>
                <th>PAGES</th>
                <th>INGESTION STATUS</th>
                <th>UPLOADED DATE</th>
                <th className="text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id}>
                  <td className="font-medium text-[var(--paper-900)]">
                    <div className="flex items-center gap-2.5">
                      <FileText size={16} className="text-[var(--gold-600)]" />
                      <div>
                        <span>{doc.name}</span>
                        <div className="font-mono text-[10px] text-[var(--paper-500)]">
                          {doc.id} · {doc.mimeType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-xs text-[var(--paper-700)] font-mono">
                    {doc.type}
                  </td>
                  <td className="text-xs text-[var(--paper-500)] font-mono">
                    {doc.pages} pages
                  </td>
                  <td>
                    <span className="rounded bg-[var(--state-ok-bg)] text-[var(--state-ok-text)] text-[10px] font-mono px-2 py-0.5 uppercase font-medium">
                      {doc.status}
                    </span>
                  </td>
                  <td className="text-xs text-[var(--paper-500)] font-mono">
                    {doc.uploaded}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/documents/viewer?doc=${encodeURIComponent(doc.name)}`}
                        className="btn btn-sm btn-secondary text-xs uppercase tracking-wider"
                      >
                        <Eye size={12} />
                        View Document
                      </Link>
                      <Link
                        to="/app/analysis"
                        className="btn btn-sm btn-tertiary text-xs"
                        title="Re-run pipeline on this document"
                      >
                        Pipeline
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Footer Disclaimer ──────────────────────────────────────────── */}
      <div className="px-8 mt-12 pt-6 border-t border-[var(--paper-200)] text-center">
        <p className="text-[10px] text-[var(--paper-500)]">
          CaseIntel is a research and review aid, NOT legal advice.
        </p>
      </div>
    </div>
  );
}
