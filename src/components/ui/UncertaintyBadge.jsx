/**
 * UncertaintyBadge — §19
 * status: 'possible' | 'likely' | 'unsupported' | 'confirmed' | 'dismissed'
 */
export default function UncertaintyBadge({ status, score, className = '' }) {
  const configs = {
    possible: {
      icon: (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
        </svg>
      ),
      label: 'POSSIBLE',
      style: {
        color: 'var(--paper-700)',
        border: '1px solid var(--paper-300)',
        background: 'transparent',
      },
    },
    likely: {
      icon: (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
          <path d="M6 1 A5 5 0 0 1 11 6 L6 6Z" fill="currentColor" />
        </svg>
      ),
      label: 'LIKELY',
      style: {
        color: 'var(--gold-600)',
        border: '1px solid var(--gold-600)',
        background: 'var(--gold-100)',
      },
    },
    unsupported: {
      icon: (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 1L11 10H1L6 1Z" stroke="currentColor" strokeWidth="1" />
        </svg>
      ),
      label: 'UNSUPPORTED',
      style: {
        color: 'var(--state-warn-text)',
        border: '1px solid var(--state-warn-text)',
        background: 'var(--state-warn-bg)',
      },
    },
    confirmed: {
      icon: (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <circle cx="6" cy="6" r="5" fill="currentColor" />
          <path d="M3.5 6l2 2 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      label: 'USER CONFIRMED',
      style: {
        color: 'var(--paper-0)',
        border: '1px solid var(--paper-900)',
        background: 'var(--paper-900)',
        fontFamily: "'IBM Plex Mono', ui-monospace",
        transform: 'rotate(-2deg)',
      },
    },
    dismissed: {
      icon: (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <rect x="1.5" y="2.5" width="9" height="7" rx="1" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1" />
        </svg>
      ),
      label: 'USER DISMISSED',
      style: {
        color: 'var(--paper-500)',
        border: '1px dashed var(--paper-300)',
        background: 'transparent',
        opacity: '0.7',
      },
    },
  };

  const cfg = configs[status] || configs.possible;
  const ariaLabel = `Status: ${cfg.label}${score !== undefined ? `, score ${score}` : ''}`;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 text-xs font-medium tracking-wider select-none ${className}`}
      style={{
        height: '24px',
        borderRadius: '2px',
        ...cfg.style,
      }}
      aria-label={ariaLabel}
      role="status"
    >
      {cfg.icon}
      <span>{cfg.label}</span>
      {score !== undefined && (
        <span style={{ opacity: 0.65, marginLeft: '2px', fontFamily: "'IBM Plex Mono', ui-monospace", fontSize: '0.6875rem' }}>
          {score.toFixed(2)}
        </span>
      )}
    </span>
  );
}
