/**
 * EntityBadge — §15.2
 */
const TYPE_ICONS = {
  Person: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="4" r="2" stroke="currentColor" strokeWidth="1" />
      <path d="M2 10c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  Organization: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="8" height="6" rx="0.5" stroke="currentColor" strokeWidth="1" />
      <path d="M4 5V3.5A2 2 0 018 3.5V5" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  Location: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6 11C6 11 2 7.2 2 5a4 4 0 018 0c0 2.2-4 6-4 6z" stroke="currentColor" strokeWidth="1" />
      <circle cx="6" cy="5" r="1.2" fill="currentColor" />
    </svg>
  ),
  Date: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="1.5" y="2.5" width="9" height="8" rx="0.5" stroke="currentColor" strokeWidth="1" />
      <path d="M4 1.5v2M8 1.5v2M1.5 5.5h9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  Amount: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1" />
      <path d="M6 4v.8M6 7.2V8M4.5 6h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  Section: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 3h8M2 6h6M2 9h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  'Case/FIR': (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="8" height="8" rx="0.5" stroke="currentColor" strokeWidth="1" />
      <path d="M4.5 5h3M4.5 7h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
};

export default function EntityBadge({ type, value, count, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.25rem 0.5rem',
        border: '1px solid var(--paper-200)',
        borderRadius: '2px',
        background: 'var(--paper-50)',
        color: 'var(--paper-700)',
        fontSize: '0.8125rem',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background var(--motion-quick)',
      }}
      onMouseOver={e => { if (onClick) e.currentTarget.style.background = 'var(--paper-100)'; }}
      onMouseOut={e => { e.currentTarget.style.background = 'var(--paper-50)'; }}
      aria-label={`${type}: ${value}${count ? `, ${count} mentions` : ''}`}
    >
      <span style={{ color: 'var(--gold-600)', flexShrink: 0 }}>
        {TYPE_ICONS[type] || TYPE_ICONS.Section}
      </span>
      <span style={{ fontWeight: 500, color: 'var(--paper-900)' }}>{value}</span>
      {count != null && (
        <span style={{
          fontFamily: "'IBM Plex Mono'",
          fontSize: '0.6875rem',
          color: 'var(--paper-500)',
          marginLeft: '0.125rem',
        }}>
          ×{count}
        </span>
      )}
    </button>
  );
}
