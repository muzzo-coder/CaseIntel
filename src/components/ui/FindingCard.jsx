/**
 * FindingCard — §17.2
 */
import { useState } from 'react';
import UncertaintyBadge from './UncertaintyBadge';
import SourceCitation from './SourceCitation';

const TYPE_ICONS = {
  'date-mismatch': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" rx="1" stroke="currentColor" strokeWidth="1" />
      <path d="M5 2v2M11 2v2M2 7h12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  'amount-mismatch': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1" />
      <path d="M8 5v1.5M8 9.5V11M6.5 7.5h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  'entity-mismatch': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1" />
      <path d="M3 13c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  'statement-conflict': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 4h12M2 8h8M2 12h6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <circle cx="13" cy="12" r="2" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
};

const TYPE_LABELS = {
  'date-mismatch': 'DATE MISMATCH',
  'amount-mismatch': 'AMOUNT MISMATCH',
  'entity-mismatch': 'ENTITY MISMATCH',
  'statement-conflict': 'STATEMENT CONFLICT',
};

const SCORE_BAND = (score) => {
  if (score >= 0.75) return 'High';
  if (score >= 0.45) return 'Medium';
  return 'Low';
};

export default function FindingCard({
  finding,
  onOpenDesk,
  onConfirm,
  onDismiss,
  onAddNote,
}) {
  const [confirmStamp, setConfirmStamp] = useState(false);
  const [dismissStamp, setDismissStamp] = useState(false);

  const handleConfirm = () => {
    setConfirmStamp(true);
    onConfirm?.(finding.id);
  };
  const handleDismiss = () => {
    setDismissStamp(true);
    onDismiss?.(finding.id);
  };

  const isDismissed = finding.review?.status === 'dismissed' || dismissStamp;
  const isConfirmed = finding.review?.status === 'confirmed' || confirmStamp;

  return (
    <article
      style={{
        border: '1px solid var(--paper-200)',
        borderRadius: '2px',
        background: 'var(--paper-0)',
        boxShadow: 'var(--shadow-paper-rest)',
        padding: '1rem',
        opacity: isDismissed ? 0.7 : 1,
        transition: 'opacity var(--motion-base)',
        position: 'relative',
      }}
      aria-label={`Finding: ${TYPE_LABELS[finding.type] || finding.type}`}
    >
      {/* Stamps */}
      {isConfirmed && (
        <div className="stamp-animate" style={{
          position: 'absolute', top: '0.75rem', right: '1rem',
          fontFamily: "'IBM Plex Mono'", fontSize: '0.625rem', fontWeight: 500,
          color: 'var(--paper-0)', background: 'var(--paper-900)',
          padding: '0.25rem 0.5rem', borderRadius: '2px',
          transform: 'rotate(-2deg)', letterSpacing: '0.06em',
          border: '1px solid var(--paper-900)',
        }}>
          ✓ USER CONFIRMED
        </div>
      )}
      {isDismissed && (
        <div className="stamp-animate" style={{
          position: 'absolute', top: '0.75rem', right: '1rem',
          fontFamily: "'IBM Plex Mono'", fontSize: '0.625rem', fontWeight: 500,
          color: 'var(--paper-500)', border: '1px dashed var(--paper-300)',
          padding: '0.25rem 0.5rem', borderRadius: '2px',
          transform: 'rotate(-2deg)', letterSpacing: '0.06em',
        }}>
          DISMISSED
        </div>
      )}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <span style={{ color: 'var(--paper-700)', marginTop: '1px', flexShrink: 0 }}>
          {TYPE_ICONS[finding.type] || TYPE_ICONS['statement-conflict']}
        </span>
        <span className="meta-label" style={{ flex: 1 }}>
          {TYPE_LABELS[finding.type] || finding.type}
        </span>
        <span className="case-id" style={{ flexShrink: 0, marginRight: '0.5rem' }}>
          {finding.id}
        </span>
        <UncertaintyBadge status={isConfirmed ? 'confirmed' : isDismissed ? 'dismissed' : finding.status} score={finding.score} />
      </div>

      {/* Summary */}
      <p style={{ fontSize: '0.9375rem', color: 'var(--paper-900)', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
        {finding.summary}
      </p>

      {/* Document excerpts */}
      {finding.docA && finding.docB && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <DocExcerpt label="DOC A" doc={finding.docA} />
          <DocExcerpt label="DOC B" doc={finding.docB} />
        </div>
      )}

      {/* Meta row */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <MetaItem label="Method" value={finding.method || 'unspecified'} />
        {finding.score != null && (
          <MetaItem label="Score" value={`${finding.score.toFixed(2)} · ${SCORE_BAND(finding.score)}`} />
        )}
        {finding.verification && (
          <MetaItem label="Verification" value={finding.verification.verdict || 'Not yet run'} />
        )}
        <MetaItem label="Human review" value={isConfirmed ? 'User confirmed' : isDismissed ? 'User dismissed' : 'Not reviewed'} />
      </div>

      <p style={{ fontSize: '0.6875rem', color: 'var(--paper-500)', margin: '0 0 0.875rem 0', fontStyle: 'italic' }}>
        Score reflects detection strength, not legal truth.
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--paper-200)', paddingTop: '0.75rem' }}>
        {onOpenDesk && (
          <button className="btn btn-sm btn-primary" onClick={() => onOpenDesk(finding.id)}>
            Open Evidence Desk
          </button>
        )}
        {!isConfirmed && !isDismissed && (
          <>
            <button className="btn btn-sm btn-secondary" onClick={handleConfirm}>Confirm</button>
            <button className="btn btn-sm btn-secondary" onClick={handleDismiss}>Dismiss</button>
          </>
        )}
        <button className="btn btn-sm btn-tertiary" onClick={() => onAddNote?.(finding.id)}>Add note</button>
      </div>
    </article>
  );
}

function DocExcerpt({ label, doc }) {
  return (
    <div style={{
      border: '1px solid var(--paper-200)', borderRadius: '2px', padding: '0.5rem 0.625rem',
      background: 'var(--paper-50)',
    }}>
      <div className="meta-label" style={{ marginBottom: '0.25rem', fontSize: '0.625rem' }}>{label}: {doc.name}</div>
      <div style={{ fontFamily: "'Source Serif 4'", fontSize: '0.8125rem', color: 'var(--paper-900)', lineHeight: 1.5 }}>
        "…{doc.excerpt}…"
      </div>
      <SourceCitation docName={doc.name} page={doc.page} />
    </div>
  );
}

function MetaItem({ label, value }) {
  return (
    <div style={{ fontSize: '0.75rem' }}>
      <span style={{ color: 'var(--paper-500)', marginRight: '0.25rem' }}>{label}:</span>
      <span style={{ color: 'var(--paper-700)' }}>{value}</span>
    </div>
  );
}
