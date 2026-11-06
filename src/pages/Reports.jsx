/**
 * Reports — §19 / Formal Dossier & Evaluation Ledger (/app/reports)
 * Tabs: Report · Evaluation.
 * Report tab: Paper-styled preview with official letterhead, GoldSeal, summary of findings, PDF export button (disabled with tooltip "Backend required").
 * Evaluation tab: Black header band "EVALUATION — measured, not claimed" with DEMO DATA banner and ruled ledger tables for Retrieval, Extraction, Inconsistency Detection, Verification (all TBD values).
 */
import { useState } from 'react';
import {
  Download,
  AlertTriangle,
} from 'lucide-react';
import { useMatter } from '../context/MatterContext';
import { MOCK_MATTER, MOCK_FINDINGS, MOCK_EVALUATION, MOCK_DOCUMENTS } from '../mocks/data';
import GoldSeal from '../components/ui/GoldSeal';
import DemoTag from '../components/ui/DemoTag';

export default function Reports() {
  const { activeMatter = MOCK_MATTER } = useMatter() || {};
  const matter = activeMatter || MOCK_MATTER;

  const [activeTab, setActiveTab] = useState('report'); // 'report' | 'evaluation'

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: 'var(--paper-100)' }}>
      {/* ── Header Band (Black) ── */}
      <header
        style={{
          background: 'var(--ink-950)',
          borderBottom: '1px solid var(--ink-700)',
          padding: '1.25rem 2rem',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <span className="case-id" style={{ color: 'var(--gold-400)', fontSize: '0.8125rem' }}>
                {matter.id}
              </span>
              <span style={{ color: 'var(--ink-600)' }}>·</span>
              <span className="meta-label on-black" style={{ fontSize: '0.6875rem' }}>
                MATTER DOSSIER & METRICS
              </span>
              <DemoTag />
            </div>
            <h1
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: '1.5rem',
                fontWeight: 400,
                color: 'var(--paper-0)',
                margin: 0,
              }}
            >
              Reports & Evaluation
            </h1>
          </div>

          {/* Tab buttons */}
          <div
            style={{
              marginLeft: 'auto',
              display: 'inline-flex',
              background: 'var(--ink-900)',
              border: '1px solid var(--ink-700)',
              borderRadius: '2px',
              padding: '2px',
            }}
          >
            <button
              onClick={() => setActiveTab('report')}
              style={{
                background: activeTab === 'report' ? 'var(--ink-800)' : 'transparent',
                color: activeTab === 'report' ? 'var(--paper-0)' : 'var(--ink-400)',
                border: 'none',
                fontSize: '0.75rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '2px',
                cursor: 'pointer',
                fontFamily: "'IBM Plex Mono'",
                letterSpacing: '0.04em',
              }}
            >
              REPORT PREVIEW
            </button>
            <button
              onClick={() => setActiveTab('evaluation')}
              style={{
                background: activeTab === 'evaluation' ? 'var(--ink-800)' : 'transparent',
                color: activeTab === 'evaluation' ? 'var(--paper-0)' : 'var(--ink-400)',
                border: 'none',
                fontSize: '0.75rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '2px',
                cursor: 'pointer',
                fontFamily: "'IBM Plex Mono'",
                letterSpacing: '0.04em',
              }}
            >
              EVALUATION LEDGER
            </button>
          </div>
        </div>
      </header>

      {/* ── Content Area ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {activeTab === 'report' ? (
          /* ── Tab 1: Formal Paper Report Preview ── */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--paper-600)' }}>
                Official synthesis generated from matter evidentiary dossier.
              </div>
              <div style={{ position: 'relative' }}>
                <button
                  disabled
                  title="Backend required"
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                >
                  <Download size={13} /> Export PDF (Backend required)
                </button>
              </div>
            </div>

            {/* Paper Sheet Preview */}
            <div
              style={{
                background: 'var(--paper-0)',
                border: '1px solid var(--paper-300)',
                borderRadius: '2px',
                padding: '3.5rem 4rem',
                boxShadow: 'var(--shadow-paper-lift)',
                maxWidth: '900px',
                margin: '0 auto',
                position: 'relative',
              }}
            >
              {/* Letterhead Top Right: GoldSeal */}
              <div style={{ position: 'absolute', top: '3.5rem', right: '4rem', textAlign: 'right' }}>
                <GoldSeal size={42} />
                <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.625rem', color: 'var(--gold-600)', marginTop: '0.35rem', letterSpacing: '0.08em' }}>
                  CERTIFIED DOSSIER
                </div>
              </div>

              {/* Letterhead Top Left */}
              <div style={{ marginBottom: '2.5rem', borderBottom: '2px solid var(--paper-900)', paddingBottom: '1.5rem' }}>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '1.5rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--paper-900)' }}>
                  CaseIntel Synthesis Dossier
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.75rem', color: 'var(--paper-600)', marginTop: '0.25rem' }}>
                  MATTER REF: {matter.id} · {matter.jurisdiction}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--paper-500)', marginTop: '0.25rem' }}>
                  DATE OF ANALYSIS: {new Date(matter.lastAnalysis).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
              </div>

              {/* Matter Information */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.6875rem', color: 'var(--paper-500)', marginBottom: '0.25rem' }}>
                  CASE TITLE
                </div>
                <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '1.35rem', fontWeight: 500, color: 'var(--paper-900)', margin: '0 0 1rem 0' }}>
                  {matter.title}
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', borderTop: '1px solid var(--paper-200)', borderBottom: '1px solid var(--paper-200)', padding: '0.75rem 0' }}>
                  <div>
                    <div style={{ fontSize: '0.625rem', fontFamily: "'IBM Plex Mono'", color: 'var(--paper-500)' }}>EXHIBITS</div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--paper-900)' }}>{matter.documentCount}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.625rem', fontFamily: "'IBM Plex Mono'", color: 'var(--paper-500)' }}>ENTITIES EXTRACTED</div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--paper-900)' }}>{matter.entityCount}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.625rem', fontFamily: "'IBM Plex Mono'", color: 'var(--paper-500)' }}>CHRONOLOGY EVENTS</div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--paper-900)' }}>{matter.eventCount}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.625rem', fontFamily: "'IBM Plex Mono'", color: 'var(--paper-500)' }}>FLAGGED FINDINGS</div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--gold-600)' }}>{matter.findingCount}</div>
                  </div>
                </div>
              </div>

              {/* Inconsistencies Summary */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.6875rem', color: 'var(--paper-500)', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                  CROSS-DOCUMENT DISCREPANCY SUMMARY
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {MOCK_FINDINGS.map((f, i) => (
                    <div
                      key={f.id}
                      style={{
                        borderLeft: '2px solid var(--gold-500)',
                        background: 'var(--paper-50)',
                        padding: '0.75rem 1rem',
                        borderRadius: '1px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.6875rem', color: 'var(--gold-600)', fontWeight: 600 }}>
                          [{i + 1}] {f.id} · {f.type.toUpperCase()}
                        </span>
                        <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.6875rem', color: 'var(--paper-500)' }}>
                          Confidence: {Math.round(f.score * 100)}%
                        </span>
                      </div>
                      <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '0.875rem', color: 'var(--paper-900)', lineHeight: 1.5 }}>
                        {f.summary}
                      </div>
                      <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.6875rem', color: 'var(--paper-500)', marginTop: '0.35rem' }}>
                        Sources: {f.docA.name} (p. {f.docA.page}) vs {f.docB.name} (p. {f.docB.page})
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidentiary Exhibits List */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.6875rem', color: 'var(--paper-500)', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                  INGESTED EXHIBITS INDEX
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                  <tbody>
                    {MOCK_DOCUMENTS.map((doc) => (
                      <tr key={doc.id} style={{ borderBottom: '1px solid var(--paper-100)' }}>
                        <td style={{ padding: '0.4rem 0', fontFamily: "'IBM Plex Mono'", color: 'var(--gold-600)', width: '80px' }}>
                          {doc.id}
                        </td>
                        <td style={{ padding: '0.4rem 0', fontWeight: 500, color: 'var(--paper-900)' }}>
                          {doc.name}
                        </td>
                        <td style={{ padding: '0.4rem 0', color: 'var(--paper-500)' }}>
                          {doc.type} · {doc.pages} pages
                        </td>
                        <td style={{ padding: '0.4rem 0', textAlign: 'right', fontFamily: "'IBM Plex Mono'", color: 'var(--state-ok-text)' }}>
                          VERIFIED
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mandatory Legal Disclaimer */}
              <div
                style={{
                  borderTop: '1px solid var(--paper-300)',
                  paddingTop: '1.25rem',
                  fontSize: '0.6875rem',
                  lineHeight: 1.5,
                  color: 'var(--paper-500)',
                  fontStyle: 'italic',
                }}
              >
                CaseIntel is a research and review aid, NOT legal advice. The observations, discrepancies, and grounded passages synthesised within this report represent algorithmic extractions and cross-referencing intended solely to assist qualified legal counsel in document review.
              </div>
            </div>
          </div>
        ) : (
          /* ── Tab 2: Evaluation Ledger ── */
          <div>
            {/* Banner: Amber Demo Data */}
            <div
              style={{
                background: 'var(--state-warn-bg)',
                border: '1px solid var(--state-warn-text)',
                borderRadius: '2px',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--state-warn-text)',
                marginBottom: '1.5rem',
                fontSize: '0.8125rem',
              }}
            >
              <AlertTriangle size={16} />
              <span>
                <strong>DEMO DATA EVALUATION BENCHMARK:</strong> Metrics below reflect planned automated evaluation fixtures. All values remain pending validation on live benchmark suites.
              </span>
            </div>

            {/* Black Header Band */}
            <div
              style={{
                background: 'var(--ink-950)',
                color: 'var(--paper-0)',
                padding: '1.5rem 2rem',
                borderRadius: '2px 2px 0 0',
                borderBottom: '1px solid var(--ink-700)',
              }}
            >
              <h2
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '1.25rem',
                  fontWeight: 400,
                  letterSpacing: '0.04em',
                  margin: 0,
                }}
              >
                EVALUATION — measured, not claimed
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--ink-400)', margin: '0.25rem 0 0 0' }}>
                Statistical performance benchmarks across the 6-stage evidentiary extraction pipeline.
              </p>
            </div>

            {/* Ruled Ledgers */}
            <div
              style={{
                background: 'var(--paper-0)',
                border: '1px solid var(--paper-200)',
                borderTop: 'none',
                padding: '1.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
              }}
            >
              {/* Ledger 1: Retrieval */}
              <div>
                <h3 className="meta-label" style={{ fontSize: '0.6875rem', marginBottom: '0.75rem' }}>
                  1. RETRIEVAL METRICS
                </h3>
                <table className="table-legal" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--paper-300)' }}>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>METRIC</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>VALUE</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>DATASET</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>SAMPLE SIZE</th>
                      <th style={{ textAlign: 'right', padding: '0.5rem' }}>LAST RUN DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--paper-100)' }}>
                      <td style={{ padding: '0.5rem', fontWeight: 500 }}>Recall @ 10</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'", color: 'var(--gold-600)' }}>{MOCK_EVALUATION.retrieval.recall}</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--paper-100)' }}>
                      <td style={{ padding: '0.5rem', fontWeight: 500 }}>MRR (Mean Reciprocal Rank)</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'", color: 'var(--gold-600)' }}>{MOCK_EVALUATION.retrieval.mrr}</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--paper-100)' }}>
                      <td style={{ padding: '0.5rem', fontWeight: 500 }}>NDCG @ 10</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'", color: 'var(--gold-600)' }}>{MOCK_EVALUATION.retrieval.ndcg10}</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Ledger 2: Extraction */}
              <div>
                <h3 className="meta-label" style={{ fontSize: '0.6875rem', marginBottom: '0.75rem' }}>
                  2. EXTRACTION ACCURACY
                </h3>
                <table className="table-legal" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--paper-300)' }}>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>METRIC</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>VALUE</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>DATASET</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>SAMPLE SIZE</th>
                      <th style={{ textAlign: 'right', padding: '0.5rem' }}>LAST RUN DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--paper-100)' }}>
                      <td style={{ padding: '0.5rem', fontWeight: 500 }}>Entity Extraction F1</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'", color: 'var(--gold-600)' }}>{MOCK_EVALUATION.extraction.f1}</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--paper-100)' }}>
                      <td style={{ padding: '0.5rem', fontWeight: 500 }}>Date Normalisation Accuracy</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'", color: 'var(--gold-600)' }}>{MOCK_EVALUATION.extraction.dateNorm}</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Ledger 3: Inconsistency Detection */}
              <div>
                <h3 className="meta-label" style={{ fontSize: '0.6875rem', marginBottom: '0.75rem' }}>
                  3. INCONSISTENCY DETECTION
                </h3>
                <table className="table-legal" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--paper-300)' }}>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>METRIC</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>VALUE</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>DATASET</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>SAMPLE SIZE</th>
                      <th style={{ textAlign: 'right', padding: '0.5rem' }}>LAST RUN DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--paper-100)' }}>
                      <td style={{ padding: '0.5rem', fontWeight: 500 }}>Precision</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'", color: 'var(--gold-600)' }}>{MOCK_EVALUATION.detection.precision}</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--paper-100)' }}>
                      <td style={{ padding: '0.5rem', fontWeight: 500 }}>False Positive Rate</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'", color: 'var(--gold-600)' }}>{MOCK_EVALUATION.detection.fpRate}</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Ledger 4: Verification */}
              <div>
                <h3 className="meta-label" style={{ fontSize: '0.6875rem', marginBottom: '0.75rem' }}>
                  4. VERIFICATION GROUNDING
                </h3>
                <table className="table-legal" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--paper-300)' }}>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>METRIC</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>VALUE</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>DATASET</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>SAMPLE SIZE</th>
                      <th style={{ textAlign: 'right', padding: '0.5rem' }}>LAST RUN DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--paper-100)' }}>
                      <td style={{ padding: '0.5rem', fontWeight: 500 }}>Unsupported Finding Rate</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'", color: 'var(--gold-600)' }}>{MOCK_EVALUATION.verification.unsupportedRate}</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--paper-100)' }}>
                      <td style={{ padding: '0.5rem', fontWeight: 500 }}>Citation Correctness</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'", color: 'var(--gold-600)' }}>{MOCK_EVALUATION.verification.citationCorrectness}</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                      <td style={{ padding: '0.5rem', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', fontFamily: "'IBM Plex Mono'" }}>TBD</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Disclaimer */}
            <aside
              role="note"
              style={{
                marginTop: '2rem',
                fontSize: '0.75rem',
                color: 'var(--paper-500)',
                borderLeft: '2px solid var(--gold-500)',
                paddingLeft: '0.75rem',
                fontStyle: 'italic',
              }}
            >
              CaseIntel is a research and review aid, NOT legal advice.
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
