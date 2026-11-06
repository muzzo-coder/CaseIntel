/**
 * EvidenceComparison — §17.4 / Flagship Screen (/app/findings/:id/compare)
 * Full-bleed black backdrop (ink-950).
 * Two pristine white paper sheets (Document A & Document B) side-by-side.
 * Center 56px column with thin brass vertical rule + paper label tab.
 * Gold hairline connector SVG lines between spans.
 * Neutral explanation sheet, verification status strip, and human review action with stamp animation.
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { MOCK_FINDINGS } from '../mocks/data';
import GoldSeal from '../components/ui/GoldSeal';
import DemoTag from '../components/ui/DemoTag';
import UncertaintyBadge from '../components/ui/UncertaintyBadge';
import VerificationStatus from '../components/ui/VerificationStatus';

export default function EvidenceComparison() {
  const { id } = useParams();
  const navigate = useNavigate();

  const findingIndex = MOCK_FINDINGS.findIndex((f) => f.id === id);
  const currentIndex = findingIndex >= 0 ? findingIndex : 0;
  const finding = MOCK_FINDINGS[currentIndex];

  const prevFinding = currentIndex > 0 ? MOCK_FINDINGS[currentIndex - 1] : null;
  const nextFinding =
    currentIndex < MOCK_FINDINGS.length - 1 ? MOCK_FINDINGS[currentIndex + 1] : null;

  const [reviewState, setReviewState] = useState(finding.review?.status || null);
  const [note, setNote] = useState('');
  const [showNoteField, setShowNoteField] = useState(false);

  // Keyboard navigation: Escape closes comparison
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        navigate(`/app/findings/${finding.id}`);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, finding.id]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--ink-950)',
        color: 'var(--ink-300)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Top Bar (Black Surface) ── */}
      <header
        style={{
          borderBottom: '1px solid var(--ink-700)',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <GoldSeal size={22} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono'",
                  fontSize: '0.875rem',
                  color: 'var(--gold-400)',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                {finding.id}
              </span>
              <span style={{ color: 'var(--ink-600)' }}>·</span>
              <span className="meta-label on-black" style={{ fontSize: '0.6875rem' }}>
                {finding.type.toUpperCase()}
              </span>
              <UncertaintyBadge status={finding.status} score={finding.score} />
              <DemoTag />
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--paper-100)', marginTop: '0.125rem' }}>
              {finding.summary}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Prev / Next navigation */}
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {prevFinding ? (
              <Link
                to={`/app/findings/${prevFinding.id}/compare`}
                className="btn btn-sm btn-secondary"
                style={{ color: 'var(--paper-0)', borderColor: 'var(--ink-600)' }}
                title="Previous finding"
              >
                <ChevronLeft size={14} />
              </Link>
            ) : (
              <button
                disabled
                className="btn btn-sm btn-secondary"
                style={{ opacity: 0.3, color: 'var(--paper-0)', borderColor: 'var(--ink-600)' }}
              >
                <ChevronLeft size={14} />
              </button>
            )}

            {nextFinding ? (
              <Link
                to={`/app/findings/${nextFinding.id}/compare`}
                className="btn btn-sm btn-secondary"
                style={{ color: 'var(--paper-0)', borderColor: 'var(--ink-600)' }}
                title="Next finding"
              >
                <ChevronRight size={14} />
              </Link>
            ) : (
              <button
                disabled
                className="btn btn-sm btn-secondary"
                style={{ opacity: 0.3, color: 'var(--paper-0)', borderColor: 'var(--ink-600)' }}
              >
                <ChevronRight size={14} />
              </button>
            )}
          </div>

          {/* Close Desk */}
          <button
            onClick={() => navigate(`/app/findings/${finding.id}`)}
            className="btn btn-sm btn-primary-on-black"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <X size={14} />
            <span>Close (Esc)</span>
          </button>
        </div>
      </header>

      {/* ── Center Stage: Side-by-Side Paper Sheets ── */}
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 56px 1fr',
            gap: 0,
            alignItems: 'stretch',
            position: 'relative',
          }}
        >
          {/* ── Document Sheet A (White Paper) ── */}
          <div
            style={{
              background: 'var(--paper-0)',
              color: 'var(--paper-900)',
              borderRadius: '2px',
              padding: '2rem',
              boxShadow: 'var(--shadow-on-black)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {/* Sheet Header */}
            <div style={{ borderBottom: '1px solid var(--paper-200)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                <span className="meta-label" style={{ fontSize: '0.6875rem' }}>
                  DOCUMENT A
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.75rem', color: 'var(--gold-600)' }}>
                  PAGE {finding.docA.page}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '1.1875rem',
                  fontWeight: 500,
                  color: 'var(--paper-900)',
                  margin: 0,
                }}
              >
                {finding.docA.name}
              </h3>
            </div>

            {/* Document Body with Highlighted Span */}
            <div
              style={{
                flex: 1,
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: '0.9375rem',
                lineHeight: 1.75,
                color: 'var(--paper-800)',
              }}
            >
              <p style={{ opacity: 0.5, margin: '0 0 1rem 0' }}>
                1. That the complainant is a reputed financial firm carrying on business within the jurisdiction of this Hon'ble Court.
              </p>
              <p style={{ opacity: 0.5, margin: '0 0 1rem 0' }}>
                2. That in discharge of existing legal debt and obligations, the respondent tendered payment via cheque instrument as hereunder:
              </p>

              {/* Highlighted Inconsistency Span */}
              <div
                style={{
                  background: 'rgba(239, 230, 208, 0.9)',
                  borderLeft: '3px solid var(--gold-500)',
                  padding: '0.75rem 1rem',
                  margin: '1.25rem 0',
                  borderRadius: '1px',
                  position: 'relative',
                }}
              >
                <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.625rem', color: 'var(--gold-600)', marginBottom: '0.25rem' }}>
                  KEY EVIDENTIARY PASSAGE
                </div>
                <div style={{ fontWeight: 500, color: 'var(--paper-900)' }}>
                  "{finding.docA.excerpt}"
                </div>
              </div>

              <p style={{ opacity: 0.5, margin: '1rem 0 0 0' }}>
                3. That the said instrument was duly deposited for clearance within the prescribed validity timeframe through regular clearing channels.
              </p>
            </div>

            {/* Sheet Footer Link */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--paper-100)' }}>
              <Link
                to={`/app/documents/${finding.docA.name}`}
                className="btn btn-sm btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Open {finding.docA.name} at Source ↗
              </Link>
            </div>
          </div>

          {/* ── Center Column: Brass Line + Discrepancy Tab ── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Vertical Brass Rule */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '1px',
                background: 'var(--gold-line)',
              }}
            />

            {/* Central Badge Tab */}
            <div
              style={{
                zIndex: 5,
                background: 'var(--paper-50)',
                color: 'var(--paper-900)',
                border: '1px solid var(--gold-500)',
                borderRadius: '2px',
                padding: '0.75rem 0.25rem',
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                fontFamily: "'IBM Plex Mono'",
                fontSize: '0.625rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              }}
            >
              POSSIBLE INCONSISTENCY
            </div>
          </div>

          {/* ── Document Sheet B (White Paper) ── */}
          <div
            style={{
              background: 'var(--paper-0)',
              color: 'var(--paper-900)',
              borderRadius: '2px',
              padding: '2rem',
              boxShadow: 'var(--shadow-on-black)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {/* Sheet Header */}
            <div style={{ borderBottom: '1px solid var(--paper-200)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                <span className="meta-label" style={{ fontSize: '0.6875rem' }}>
                  DOCUMENT B
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.75rem', color: 'var(--gold-600)' }}>
                  PAGE {finding.docB.page}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '1.1875rem',
                  fontWeight: 500,
                  color: 'var(--paper-900)',
                  margin: 0,
                }}
              >
                {finding.docB.name}
              </h3>
            </div>

            {/* Document Body with Highlighted Span */}
            <div
              style={{
                flex: 1,
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: '0.9375rem',
                lineHeight: 1.75,
                color: 'var(--paper-800)',
              }}
            >
              <p style={{ opacity: 0.5, margin: '0 0 1rem 0' }}>
                MEMORANDUM OF INTERNAL INQUIRY & DISHONOUR LOG
              </p>
              <p style={{ opacity: 0.5, margin: '0 0 1rem 0' }}>
                On dispatch of clearing batches for the relevant clearing cycle, branch ledger records indicate:
              </p>

              {/* Highlighted Inconsistency Span */}
              <div
                style={{
                  background: 'rgba(239, 230, 208, 0.9)',
                  borderLeft: '3px solid var(--gold-500)',
                  padding: '0.75rem 1rem',
                  margin: '1.25rem 0',
                  borderRadius: '1px',
                  position: 'relative',
                }}
              >
                <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.625rem', color: 'var(--gold-600)', marginBottom: '0.25rem' }}>
                  KEY EVIDENTIARY PASSAGE
                </div>
                <div style={{ fontWeight: 500, color: 'var(--paper-900)' }}>
                  "{finding.docB.excerpt}"
                </div>
              </div>

              <p style={{ opacity: 0.5, margin: '1rem 0 0 0' }}>
                Return memo issued with objection 'Funds Insufficient'. Notice forwarded to recovery team.
              </p>
            </div>

            {/* Sheet Footer Link */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--paper-100)' }}>
              <Link
                to={`/app/documents/${finding.docB.name}`}
                className="btn btn-sm btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Open {finding.docB.name} at Source ↗
              </Link>
            </div>
          </div>
        </div>

        {/* ── Below: Explanation & Human Review Section ── */}
        <div
          style={{
            marginTop: '2rem',
            background: 'var(--paper-0)',
            color: 'var(--paper-900)',
            borderRadius: '2px',
            padding: '1.75rem 2rem',
            boxShadow: 'var(--shadow-on-black)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)', gap: '2rem' }}>
            {/* Left: Neutral Explanation */}
            <div>
              <span className="meta-label" style={{ fontSize: '0.6875rem', display: 'block', marginBottom: '0.5rem' }}>
                WHY WAS THIS FLAGGED?
              </span>
              <p
                style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: '0.9375rem',
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
                  gap: '1.25rem',
                  borderTop: '1px solid var(--paper-200)',
                  paddingTop: '0.75rem',
                }}
              >
                <span>METHOD: {finding.method}</span>
                <span>CONFIDENCE SCORE: {Math.round(finding.score * 100)}%</span>
              </div>
            </div>

            {/* Right: Verification & Human Review Controls */}
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <VerificationStatus
                  status={finding.verification?.verdict || 'verified'}
                  checks={finding.verification || { quoteFound: true, supportsFindig: true }}
                />
              </div>

              {/* Review Actions */}
              <div
                style={{
                  background: 'var(--paper-50)',
                  border: '1px solid var(--paper-200)',
                  borderRadius: '2px',
                  padding: '1rem',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="meta-label" style={{ fontSize: '0.6875rem' }}>
                    HUMAN REVIEW ACTION
                  </span>
                  {reviewState && (
                    <div
                      className="stamp-animate"
                      style={{
                        fontFamily: "'IBM Plex Mono'",
                        fontSize: '0.625rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '2px',
                        background: reviewState === 'confirmed' ? 'var(--paper-900)' : 'var(--state-warn-bg)',
                        color: reviewState === 'confirmed' ? 'var(--paper-0)' : 'var(--state-warn-text)',
                        border: reviewState === 'confirmed' ? '1px solid var(--paper-900)' : '1px solid var(--state-warn-text)',
                        transform: 'rotate(-2deg)',
                      }}
                    >
                      {reviewState === 'confirmed' ? '✓ USER CONFIRMED' : '✗ DISMISSED'}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    className={`btn btn-sm ${reviewState === 'confirmed' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setReviewState('confirmed')}
                  >
                    <Check size={13} /> Confirm Finding
                  </button>
                  <button
                    className={`btn btn-sm ${reviewState === 'dismissed' ? 'btn-destructive' : 'btn-secondary'}`}
                    onClick={() => setReviewState('dismissed')}
                  >
                    <X size={13} /> Dismiss
                  </button>
                  <button
                    className="btn btn-sm btn-tertiary"
                    onClick={() => setShowNoteField(!showNoteField)}
                  >
                    + Note
                  </button>
                </div>

                {showNoteField && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Enter legal observation…"
                      className="input-base"
                      style={{ fontSize: '0.75rem', flex: 1 }}
                    />
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => setShowNoteField(false)}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: '1px solid var(--ink-700)',
          padding: '0.875rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: 'var(--ink-400)',
        }}
      >
        <aside role="note" style={{ fontStyle: 'italic', color: 'var(--ink-400)' }}>
          CaseIntel is a research and review aid, NOT legal advice.
        </aside>
        <div style={{ fontFamily: "'IBM Plex Mono'", color: 'var(--ink-500)' }}>
          CASEINTEL COMPARISON MATRIX v1.0
        </div>
      </footer>
    </div>
  );
}
