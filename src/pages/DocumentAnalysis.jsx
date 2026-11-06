import { useState } from "react";
import {
  CheckCircle2,
  RotateCw,
} from "lucide-react";
import { useMatter } from "../context/MatterContext";
import { MOCK_MATTER, MOCK_PIPELINE, MOCK_ENTITIES } from "../mocks/data";
import DemoTag from "../components/ui/DemoTag";
import PipelineStage from "../components/ui/PipelineStage";
import EntityBadge from "../components/ui/EntityBadge";

export default function DocumentAnalysis() {
  const { activeMatter = MOCK_MATTER } = useMatter() || {};
  const matter = activeMatter || MOCK_MATTER;

  const [stages, setStages] = useState(MOCK_PIPELINE);
  const [running, setRunning] = useState(false);

  const handleRerunAll = () => {
    setRunning(true);
    setStages(
      stages.map((s, idx) => ({
        ...s,
        status: idx === 0 ? "running" : "waiting",
      }))
    );

    setTimeout(() => {
      setStages(
        stages.map((s, idx) => ({
          ...s,
          status: idx <= 2 ? "complete" : "running",
        }))
      );
    }, 800);

    setTimeout(() => {
      setStages(MOCK_PIPELINE);
      setRunning(false);
    }, 1600);
  };

  const handleRetryStage = (stageNumber) => {
    setStages(
      stages.map((s) => (s.number === stageNumber ? { ...s, status: "running" } : s))
    );
    setTimeout(() => {
      setStages(MOCK_PIPELINE);
    }, 600);
  };

  return (
    <div className="min-h-full pb-16">
      {/* ─── Header Strip ───────────────────────────────────────────────── */}
      <div className="surface-black border-b border-[var(--ink-800)] px-8 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="case-id text-xs text-[var(--gold-400)]">
                {matter.id}
              </span>
              <span className="text-[var(--ink-600)]">·</span>
              <span className="meta-label on-black text-[10px]">
                SIX-STAGE INTELLIGENCE PIPELINE
              </span>
              <DemoTag />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[var(--paper-0)]">
              Multi-Pass Evidentiary Analysis
            </h1>
            <p className="font-doc text-xs text-[var(--ink-300)] mt-1 max-w-xl">
              Inspect each stage of extraction, alias resolution, cross-document discrepancy detection, and formal evidence verification.
            </p>
          </div>

          <button
            onClick={handleRerunAll}
            disabled={running}
            className="btn btn-md btn-primary-on-black text-xs uppercase tracking-wider self-start md:self-auto"
          >
            <RotateCw size={14} className={running ? "animate-spin" : ""} />
            {running ? "Processing Pipeline..." : "Re-Execute Full Pipeline"}
          </button>
        </div>
      </div>

      {/* ─── Main Pipeline Canvas ───────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-8 py-8 space-y-8">
        {/* Pipeline Summary Bar */}
        <div className="rounded border border-[var(--paper-200)] bg-[var(--paper-0)] p-5 shadow-paper-rest">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-[var(--state-ok-text)] font-medium">
              <CheckCircle2 size={16} />
              <span>All 6 Intelligence Stages Operational</span>
            </div>
            <div className="flex items-center gap-6 font-mono text-[var(--paper-500)] text-[11px]">
              <span>Cumulative Latency: 26.6s</span>
              <span>Grounding Anchor: Exact Chars</span>
              <span>Model Drift: 0.00%</span>
            </div>
          </div>
        </div>

        {/* The 6 Stages */}
        <div className="rounded border border-[var(--paper-200)] bg-[var(--paper-0)] shadow-paper-lift overflow-hidden">
          <div className="px-6 py-4 bg-[var(--paper-100)] border-b border-[var(--paper-200)] flex items-center justify-between">
            <span className="meta-label text-[10px]">PIPELINE EXECUTION STEPS</span>
            <span className="font-mono text-xs text-[var(--gold-600)]">STAGES 01 TO 06</span>
          </div>

          <div className="divide-y divide-[var(--paper-100)]">
            {stages.map((stage) => (
              <PipelineStage
                key={stage.number}
                stage={stage}
                onRetry={handleRetryStage}
              />
            ))}
          </div>
        </div>

        {/* Sample Extracted Entities Strip */}
        <div className="rounded border border-[var(--paper-200)] bg-[var(--paper-0)] p-6 shadow-paper-rest">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--paper-100)]">
            <div>
              <span className="meta-label text-[10px]">STAGE 02 OUTPUT PREVIEW</span>
              <h3 className="font-display text-base font-semibold text-[var(--paper-900)] mt-0.5">
                Resolved Entities & Statutory Citations
              </h3>
            </div>
            <span className="font-mono text-xs text-[var(--paper-500)]">
              {MOCK_ENTITIES.length} Total Anchors
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {MOCK_ENTITIES.map((ent) => (
              <EntityBadge
                key={ent.id}
                type={ent.type}
                value={ent.value}
                count={ent.count}
              />
            ))}
          </div>
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
