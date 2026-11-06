/**
 * EvidenceCard — §15.1
 * Block component: quoted passage + source + actions
 */
import SourceCitation from './SourceCitation';

export default function EvidenceCard({ quote, docName, page, charStart, charEnd, onOpenDoc, onCopy }) {
  return (
    <div
      style={{
        border: '1px solid var(--paper-200)',
        borderLeft: '2px solid var(--gold-500)',
        borderRadius: '2px',
        background: 'var(--paper-0)',
        padding: '0.875rem 1rem',
        boxShadow: 'var(--shadow-paper-rest)',
      }}
    >
      {/* Quote */}
      <blockquote
        style={{
          margin: 0,
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: '0.9375rem',
          lineHeight: 1.65,
          color: 'var(--paper-900)',
        }}
      >
        "{quote}"
      </blockquote>

      {/* Source line */}
      <div
        style={{
          marginTop: '0.625rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        <span className="meta-label" style={{ fontSize: '0.6875rem' }}>SOURCE</span>
        <SourceCitation docName={docName} page={page} onClick={onOpenDoc} />
        {charStart != null && charEnd != null && (
          <span
            style={{
              fontFamily: "'IBM Plex Mono'",
              fontSize: '0.6875rem',
              color: 'var(--paper-500)',
            }}
          >
            chars {charStart}–{charEnd}
          </span>
        )}
      </div>

      {/* Actions */}
      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
        {onOpenDoc && (
          <button className="btn btn-sm btn-secondary" onClick={onOpenDoc}>
            Open in document
          </button>
        )}
        {onCopy && (
          <button className="btn btn-sm btn-tertiary" onClick={onCopy}>
            Copy citation
          </button>
        )}
      </div>
    </div>
  );
}
