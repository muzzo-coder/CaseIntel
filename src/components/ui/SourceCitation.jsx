/**
 * SourceCitation — §15.1
 * Inline chip: [Doc name · p.N]
 */
export default function SourceCitation({ docName, page, onClick, status = 'default' }) {
  const styles = {
    default: {
      color: 'var(--gold-600)',
      border: '1px solid var(--gold-line)',
      background: 'rgba(239,230,208,0.4)',
      cursor: 'pointer',
    },
    visited: {
      color: 'var(--paper-700)',
      border: '1px solid var(--paper-200)',
      background: 'var(--paper-100)',
      cursor: 'pointer',
    },
    broken: {
      color: 'var(--state-error-text)',
      border: '1px solid var(--state-error-text)',
      background: 'var(--state-error-bg)',
      cursor: 'default',
    },
  };

  const style = styles[status] || styles.default;

  return (
    <button
      type="button"
      onClick={status !== 'broken' ? onClick : undefined}
      title={status === 'broken' ? 'Source could not be located' : `Open ${docName} at page ${page}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        fontFamily: "'IBM Plex Mono', ui-monospace",
        fontSize: '0.75rem',
        fontWeight: 500,
        padding: '0.125rem 0.375rem',
        borderRadius: '2px',
        lineHeight: 1.4,
        transition: 'background 180ms ease',
        ...style,
      }}
      aria-label={`Source: ${docName}, page ${page}`}
    >
      {docName}
      <span style={{ opacity: 0.5 }}>·</span>
      <span>p.{page}</span>
      {status === 'broken' && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M5 2v3M5 7v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
