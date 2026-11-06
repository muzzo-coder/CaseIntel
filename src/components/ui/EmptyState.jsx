/**
 * EmptyState — §22
 * object: 'folder' | 'document' | 'findings' | 'timeline' | 'search'
 */
export default function EmptyState({ object = 'document', title, description, action }) {
  const illustrations = {
    folder: <ClosedFolder />,
    document: <BlankDocument />,
    findings: <EmptyFindings />,
    timeline: <EmptyTimeline />,
    search: <EmptySearch />,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
      }}
    >
      <div style={{ color: 'var(--paper-300)', marginBottom: '1.5rem' }}>
        {illustrations[object] || illustrations.document}
      </div>
      {title && (
        <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--paper-700)', margin: '0 0 0.5rem 0' }}>
          {title}
        </h3>
      )}
      {description && (
        <p style={{ fontSize: '0.875rem', color: 'var(--paper-500)', maxWidth: '320px', margin: '0 0 1.5rem 0', lineHeight: 1.6 }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

function ClosedFolder() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M8 20a3 3 0 013-3h14l4 4h24a3 3 0 013 3v24a3 3 0 01-3 3H11a3 3 0 01-3-3V20z"
        stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M8 24h48" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
    </svg>
  );
}

function BlankDocument() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="14" y="8" width="36" height="48" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M22 22h20M22 30h16M22 38h12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeDasharray="3 2" />
    </svg>
  );
}

function EmptyFindings() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="8" y="16" width="48" height="32" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 28h16M16 36h10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeDasharray="3 2" />
      <circle cx="46" cy="32" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M43 32h6M46 29v6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function EmptyTimeline() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <line x1="16" y1="8" x2="16" y2="56" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2" />
      <circle cx="16" cy="20" r="3" stroke="currentColor" strokeWidth="1.5" />
      <rect x="24" y="14" width="24" height="12" rx="1" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
      <circle cx="16" cy="40" r="3" stroke="currentColor" strokeWidth="1.5" />
      <rect x="24" y="34" width="24" height="12" rx="1" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
    </svg>
  );
}

function EmptySearch() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="28" cy="28" r="16" stroke="currentColor" strokeWidth="1.5" />
      <path d="M40 40l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 28h12M28 22v12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeDasharray="3 2" />
    </svg>
  );
}
