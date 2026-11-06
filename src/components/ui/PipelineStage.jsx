/**
 * PipelineStage — §16.3
 * Stage status: 'waiting' | 'running' | 'complete' | 'error' | 'blocked'
 */
import { useState } from 'react';

export default function PipelineStage({
  stage, /* { number, name, purpose, status, progress, count, elapsed, error } */
  onRetry,
}) {
  const [open, setOpen] = useState(false);

  const statusCfg = {
    waiting: { label: 'Waiting', color: 'var(--paper-500)', bg: 'var(--paper-100)' },
    running: { label: 'Running', color: 'var(--gold-600)', bg: 'var(--gold-100)' },
    complete: { label: 'Complete', color: 'var(--state-ok-text)', bg: 'var(--state-ok-bg)' },
    error: { label: 'Error', color: 'var(--state-error-text)', bg: 'var(--state-error-bg)' },
    blocked: { label: 'Blocked', color: 'var(--paper-500)', bg: 'var(--paper-100)' },
  };

  const cfg = statusCfg[stage.status] || statusCfg.waiting;

  return (
    <div
      style={{
        borderBottom: '1px solid var(--paper-200)',
        padding: '0.875rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Stage number */}
        <span
          style={{
            fontFamily: "'IBM Plex Mono'",
            fontSize: '0.6875rem',
            fontWeight: 500,
            color: stage.status === 'complete' ? 'var(--state-ok-text)' : 'var(--paper-500)',
            width: '1.25rem',
            flexShrink: 0,
          }}
        >
          {stage.status === 'complete' ? '✓' : String(stage.number)}
        </span>

        {/* Name */}
        <span
          style={{
            fontFamily: "'IBM Plex Mono'",
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.06em',
            color: stage.status === 'blocked' ? 'var(--paper-500)' : 'var(--paper-900)',
            flex: '0 0 auto',
            minWidth: '80px',
          }}
        >
          {stage.name}
        </span>

        {/* Purpose */}
        <span style={{ fontSize: '0.8125rem', color: 'var(--paper-700)', flex: 1, minWidth: 0 }}>
          {stage.purpose}
        </span>

        {/* Count */}
        {stage.count && (
          <span style={{ fontSize: '0.75rem', color: 'var(--paper-500)', whiteSpace: 'nowrap' }}>
            {stage.count}
          </span>
        )}

        {/* Elapsed */}
        {stage.elapsed && (
          <span
            style={{
              fontFamily: "'IBM Plex Mono'",
              fontSize: '0.6875rem',
              color: 'var(--paper-500)',
              whiteSpace: 'nowrap',
            }}
          >
            {stage.elapsed}
          </span>
        )}

        {/* Status chip */}
        <span
          style={{
            fontSize: '0.6875rem',
            fontWeight: 500,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            padding: '0.125rem 0.5rem',
            borderRadius: '2px',
            color: cfg.color,
            background: cfg.bg,
            border: `1px solid ${cfg.color}`,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
          role="status"
          aria-label={`Stage ${stage.number} ${stage.name}: ${cfg.label}`}
        >
          {cfg.label}
        </span>

        {/* Retry */}
        {stage.status === 'error' && onRetry && (
          <button className="btn btn-sm btn-destructive" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>

      {/* Progress bar */}
      {stage.status === 'running' && (
        <div style={{ height: '2px', background: 'var(--paper-200)', borderRadius: '1px' }}>
          <div
            style={{
              height: '100%',
              width: stage.progress != null ? `${stage.progress}%` : '40%',
              background: 'var(--gold-500)',
              borderRadius: '1px',
              transition: 'width 400ms ease',
            }}
            role="progressbar"
            aria-valuenow={stage.progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      )}

      {/* Error */}
      {stage.status === 'error' && stage.error && (
        <div style={{ fontSize: '0.8125rem', color: 'var(--state-error-text)', marginLeft: '2rem' }}>
          <span>{stage.error.message}</span>
          {stage.error.detail && (
            <>
              {' '}
              <button
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--paper-500)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
                onClick={() => setOpen(!open)}
                aria-expanded={open}
              >
                {open ? 'Hide details' : 'Technical details'}
              </button>
              {open && (
                <pre
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.75rem',
                    fontFamily: "'IBM Plex Mono'",
                    color: 'var(--paper-700)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                  }}
                >
                  {stage.error.detail}
                </pre>
              )}
            </>
          )}
        </div>
      )}

      {/* Blocked note */}
      {stage.status === 'blocked' && (
        <div style={{ fontSize: '0.75rem', color: 'var(--paper-500)', marginLeft: '2rem', fontStyle: 'italic' }}>
          Waiting for previous stage to complete.
        </div>
      )}
    </div>
  );
}
