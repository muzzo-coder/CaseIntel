/**
 * VerificationStatus — §18
 * status: 'unverified' | 'processing' | 'verified' | 'partial' | 'unsupported' | 'failed'
 * checks: { quoteFound: bool|null, supportsFindig: bool|null }
 */
import GoldSeal from './GoldSeal';

export default function VerificationStatus({ status = 'unverified', checks = {}, onRetry }) {
  const rows = [
    {
      label: 'Quote found',
      value: checks.quoteFound,
      desc: 'The cited quote exists verbatim (or normalised match) in the cited span.',
    },
    {
      label: 'Evidence supports finding',
      value: checks.supportsFindig,
      desc: 'Verification model or rule result.',
    },
  ];

  const verdictCfg = {
    unverified: {
      icon: <DashedCircle />,
      label: 'NOT YET VERIFIED',
      style: { color: 'var(--paper-500)', borderColor: 'var(--paper-300)' },
    },
    processing: {
      icon: <SteppedRing />,
      label: 'VERIFYING…',
      style: { color: 'var(--paper-500)', borderColor: 'var(--paper-300)' },
    },
    verified: {
      icon: <GoldSeal size={20} />,
      label: 'VERIFIED',
      style: { color: 'var(--state-ok-text)', borderColor: 'var(--state-ok-text)', background: 'var(--state-ok-bg)' },
    },
    partial: {
      icon: <HalfSeal />,
      label: 'PARTIAL SUPPORT',
      style: { color: 'var(--state-warn-text)', borderColor: 'var(--state-warn-text)', background: 'var(--state-warn-bg)' },
    },
    unsupported: {
      icon: <WarnTriangle />,
      label: 'UNSUPPORTED',
      style: { color: 'var(--state-warn-text)', borderColor: 'var(--state-warn-text)', background: 'var(--state-warn-bg)' },
      hatch: true,
    },
    failed: {
      icon: <XCircle />,
      label: 'VERIFICATION FAILED',
      style: { color: 'var(--state-error-text)', borderColor: 'var(--state-error-text)', background: 'var(--state-error-bg)' },
    },
  };

  const verdict = verdictCfg[status] || verdictCfg.unverified;

  return (
    <div style={{ border: '1px solid var(--paper-200)', borderRadius: '2px', overflow: 'hidden' }}>
      {/* Verdict header */}
      <div
        className={verdict.hatch ? 'hatch-bg' : ''}
        style={{
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          borderBottom: '1px solid var(--paper-200)',
          ...verdict.style,
        }}
        title="'Verified' means evidence is present and consistent, not that the finding is true."
      >
        {verdict.icon}
        <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.06em' }}>
          {verdict.label}
        </span>
      </div>

      {/* Checklist */}
      <div style={{ background: 'var(--paper-50)' }}>
        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.625rem 1rem',
              borderBottom: i < rows.length - 1 ? '1px solid var(--paper-200)' : 'none',
            }}
          >
            <CheckIcon value={row.value} />
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--paper-900)' }}>{row.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Retry */}
      {status === 'failed' && onRetry && (
        <div style={{ padding: '0.625rem 1rem', background: 'var(--state-error-bg)', borderTop: '1px solid var(--paper-200)' }}>
          <button className="btn btn-sm btn-destructive" onClick={onRetry}>Retry verification</button>
        </div>
      )}
    </div>
  );
}

/* Icon sub-components */
function CheckIcon({ value }) {
  if (value === true) return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="Pass">
      <circle cx="8" cy="8" r="7" fill="var(--state-ok-bg)" stroke="var(--state-ok-text)" strokeWidth="1" />
      <path d="M5 8l2 2 4-4" stroke="var(--state-ok-text)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (value === false) return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="Fail">
      <circle cx="8" cy="8" r="7" fill="var(--state-error-bg)" stroke="var(--state-error-text)" strokeWidth="1" />
      <path d="M6 6l4 4M10 6l-4 4" stroke="var(--state-error-text)" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="Pending">
      <circle cx="8" cy="8" r="7" stroke="var(--paper-300)" strokeWidth="1" strokeDasharray="3 2" />
    </svg>
  );
}

function DashedCircle() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
    </svg>
  );
}

function SteppedRing() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
      <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function HalfSeal() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" />
      <path d="M8 1 A7 7 0 0 1 15 8 L8 8Z" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function WarnTriangle() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2L14 13H2L8 2Z" stroke="currentColor" strokeWidth="1" />
      <line x1="8" y1="7" x2="8" y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

function XCircle() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" />
      <path d="M6 6l4 4M10 6l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
