/**
 * FindingDetail — §17.3 (/app/findings/:id)
 * Detailed breakdown of an individual inconsistency finding:
 * Summary, reasoning, grounded evidence cards, verification status, human review controls with stamp feedback.
 */
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Columns,
  Check,
  X,
} from 'lucide-react';
import { useMatter } from '../context/MatterContext';
import { MOCK_MATTER, MOCK_FINDINGS } from '../mocks/data';
import DemoTag from '../components/ui/DemoTag';
import UncertaintyBadge from '../components/ui/UncertaintyBadge';
import EvidenceCard from '../components/ui/EvidenceCard';
import VerificationStatus from '../components/ui/VerificationStatus';

export default function FindingDetail() {
  const { id } = useParams();
  const { activeMatter = MOCK_MATTER } = useMatter() || {};
  const matter = activeMatter || MOCK_MATTER;

  const finding = MOCK_FINDINGS.find((f) => f.id === id) || MOCK_FINDINGS[0];

  const [reviewStatus, setReviewStatus] = useState(finding.review?.status || null);
  const [counselNote, setCounselNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  const handleConfirm = () => setReviewStatus('confirmed');
  const handleDismiss = () => setReviewStatus('dismissed');
  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!counselNote.trim()) return;
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

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
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Link
              to="/app/findings"
              style={{
                color: 'var(--ink-400)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
              }}
            >
              <ArrowLeft size={13} /> Back to Findings
            </Link>
            <span style={{ color: 'var(--ink-600)' }}>·</span>
            <span className="case-id" style={{ color: 'var(--gold-400)', fontSize: '0.75rem' }}>
              {matter.id}
            </span>
            <DemoTag />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono'",
                    fontSize: '1.125rem',
                    color: 'var(--gold-400)',
                    fontWeight: 600,
                  }}
                >
                  {finding.id}
                </span>
                <UncertaintyBadge status={finding.status} score={finding.score} />
              </div>
              <h1
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '1.35rem',
                  fontWeight: 400,
                  color: 'var(--paper-0)',
                  margin: 0,
                }}
              >
                {finding.summary}
              </h1>
            </div>

            <Link
              to={`/app/findings/${finding.id}/compare`}
              className="btn btn-hero btn-md"
            >
              <Columns size={15} />
              Open Side-by-Side Comparison Desk
            </Link>
          </div>
        </div>
      </header>

      {/* ── Stacked Detail Sections ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section: Overview & Reason Flagged */}
          <section
            style={{
              background: 'var(--paper-0)',
              border: '1px solid var(--paper-200)',
              borderRadius: '2px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-paper-rest)',
            }}
          >
            <h2 className="meta-label" style={{ fontSize: '0.6875rem', marginBottom: '0.75rem' }}>
              WHY WAS THIS FLAGGED?
            </h2>
            <p
              style={{
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: '1rem',
                lineHeight: 1.65,
                color: 'var(--paper-900)',
                margin: '0 0 1rem 0',
              }}
            >
              {finding.explanation}
            </p>

            <div
              style={{
                fontFamily: "'IBM Plex Mono'",
                fontSize: '0.6875rem',
                color: 'var(--paper-500)',
                display: 'flex',
                gap: '1.5rem',
                borderTop: '1px solid var(--paper-100)',
                paddingTop: '0.75rem',
              }}
            >
              <span>DETECTION METHOD: {finding.method}</span>
              <span>CONFIDENCE: {Math.round(finding.score * 100)}%</span>
              <span>CLASSIFICATION: {finding.type.toUpperCase()}</span>
            </div>
          </section>

          {/* Section: Supporting Evidence Passages */}
          <section
            style={{
              background: 'var(--paper-0)',
              border: '1px solid var(--paper-200)',
              borderRadius: '2px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-paper-rest)',
            }}
          >
            <h2 className="meta-label" style={{ fontSize: '0.6875rem', marginBottom: '1rem' }}>
              CROSS-DOCUMENT EVIDENTIARY PASSAGES
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontFamily: "'IBM Plex Mono'", color: 'var(--paper-500)', marginBottom: '0.5rem' }}>
                  SOURCE DOCUMENT A
                </div>
                <EvidenceCard
                  quote={finding.docA.excerpt}
                  docName={finding.docA.name}
                  page={finding.docA.page}
                />
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontFamily: "'IBM Plex Mono'", color: 'var(--paper-500)', marginBottom: '0.5rem' }}>
                  SOURCE DOCUMENT B
                </div>
                <EvidenceCard
                  quote={finding.docB.excerpt}
                  docName={finding.docB.name}
                  page={finding.docB.page}
                />
              </div>
            </div>
          </section>

          {/* Section: Verification Strip */}
          <section
            style={{
              background: 'var(--paper-0)',
              border: '1px solid var(--paper-200)',
              borderRadius: '2px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-paper-rest)',
            }}
          >
            <h2 className="meta-label" style={{ fontSize: '0.6875rem', marginBottom: '0.75rem' }}>
              PIPELINE VERIFICATION STAGE
            </h2>
            <VerificationStatus
              status={finding.verification?.verdict || 'verified'}
              checks={finding.verification || { quoteFound: true, supportsFindig: true }}
            />
          </section>

          {/* Section: Human Review & Stamp Feedback */}
          <section
            style={{
              background: 'var(--paper-0)',
              border: '1px solid var(--paper-200)',
              borderRadius: '2px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-paper-rest)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 className="meta-label" style={{ fontSize: '0.6875rem', margin: 0 }}>
                HUMAN REVIEW ACTION
              </h2>
              {reviewStatus && (
                <div
                  className="stamp-animate"
                  style={{
                    fontFamily: "'IBM Plex Mono'",
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    padding: '0.25rem 0.6rem',
                    borderRadius: '2px',
                    letterSpacing: '0.06em',
                    background: reviewStatus === 'confirmed' ? 'var(--paper-900)' : 'var(--state-warn-bg)',
                    color: reviewStatus === 'confirmed' ? 'var(--paper-0)' : 'var(--state-warn-text)',
                    border: reviewStatus === 'confirmed' ? '1px solid var(--paper-900)' : '1px solid var(--state-warn-text)',
                    transform: 'rotate(-2deg)',
                  }}
                >
                  {reviewStatus === 'confirmed' ? '✓ COUNSEL CONFIRMED' : '✗ DISMISSED'}
                </div>
              )}
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--paper-700)', marginBottom: '1.25rem' }}>
              Examine the cross-document spans. Confirming pins this finding into the matter brief.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <button
                className={`btn btn-md ${reviewStatus === 'confirmed' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={handleConfirm}
              >
                <Check size={14} /> Confirm Inconsistency
              </button>
              <button
                className={`btn btn-md ${reviewStatus === 'dismissed' ? 'btn-destructive' : 'btn-secondary'}`}
                onClick={handleDismiss}
              >
                <X size={14} /> Dismiss Candidate
              </button>
            </div>

            {/* Counsel Note Field */}
            <form onSubmit={handleSaveNote} style={{ borderTop: '1px solid var(--paper-100)', paddingTop: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--paper-700)',
                  marginBottom: '0.35rem',
                }}
              >
                Annotate for Case File
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  value={counselNote}
                  onChange={(e) => setCounselNote(e.target.value)}
                  placeholder="e.g. Cross-examine complainant on cheque date discrepancies during trial..."
                  className="input-base"
                  style={{ flex: 1, fontSize: '0.8125rem' }}
                />
                <button type="submit" className="btn btn-secondary btn-sm">
                  {noteSaved ? 'Saved ✓' : 'Save Note'}
                </button>
              </div>
            </form>
          </section>

          {/* Audit History */}
          <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.6875rem', color: 'var(--paper-500)', padding: '0.5rem 0' }}>
            AUDIT: Flagged by DETECT pipeline on 2026-11-03 08:42:19 UTC · Model v1.2
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
          This finding is a possible difference between documents and is not a determination of truth. CaseIntel is a research and review aid, NOT legal advice.
        </aside>
      </div>
    </div>
  );
}
