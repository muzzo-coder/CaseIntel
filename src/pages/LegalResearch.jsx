/**
 * LegalResearch — §13.6 / Placeholder (/app/research)
 * Info panel: "Legal Research across a large curated legal corpus is planned, not part of the current release."
 * Disabled search controls with "Coming later" label.
 * No statutes or external citations displayed.
 */
import { BookOpen, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMatter } from '../context/MatterContext';
import { MOCK_MATTER } from '../mocks/data';
import DemoTag from '../components/ui/DemoTag';

export default function LegalResearch() {
  const { activeMatter = MOCK_MATTER } = useMatter() || {};
  const matter = activeMatter || MOCK_MATTER;

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
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <span className="case-id" style={{ color: 'var(--gold-400)', fontSize: '0.8125rem' }}>
                {matter.id}
              </span>
              <span style={{ color: 'var(--ink-600)' }}>·</span>
              <span className="meta-label on-black" style={{ fontSize: '0.6875rem' }}>
                CORPUS REPOSITORY
              </span>
              <DemoTag />
            </div>
            <h1
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: '1.5rem',
                fontWeight: 400,
                color: 'var(--paper-0)',
                margin: 0,
              }}
            >
              Legal Research
            </h1>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' }}>
        {/* Informational Panel */}
        <div
          style={{
            background: 'var(--paper-0)',
            border: '1px solid var(--paper-200)',
            borderRadius: '2px',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-paper-lift)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '2px',
                background: 'var(--gold-100)',
                color: 'var(--gold-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <BookOpen size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="meta-label" style={{ fontSize: '0.6875rem' }}>PLANNED FEATURE</span>
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono'",
                    fontSize: '0.6875rem',
                    background: 'var(--paper-100)',
                    color: 'var(--paper-700)',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '2px',
                  }}
                >
                  ROADMAP v2.0
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  color: 'var(--paper-900)',
                  margin: 0,
                }}
              >
                External Statutory & Case Law Corpus
              </h2>
            </div>
          </div>

          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1rem',
              lineHeight: 1.7,
              color: 'var(--paper-800)',
              margin: '0 0 1.5rem 0',
            }}
          >
            Legal Research across a large curated legal corpus is planned, not part of the current release. CaseIntel currently operates strictly on uploaded matter exhibits and evidence files to guarantee evidentiary precision and prevent external hallucination.
          </p>

          {/* Disabled Search Bar */}
          <div
            style={{
              background: 'var(--paper-50)',
              border: '1px solid var(--paper-200)',
              borderRadius: '2px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              opacity: 0.6,
              cursor: 'not-allowed',
            }}
          >
            <Search size={16} style={{ color: 'var(--paper-400)' }} />
            <span
              style={{
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: '0.9375rem',
                color: 'var(--paper-400)',
                flex: 1,
              }}
            >
              Search Indian Kanoon, Supreme Court Judgments, Central Acts…
            </span>
            <span
              style={{
                fontFamily: "'IBM Plex Mono'",
                fontSize: '0.6875rem',
                color: 'var(--paper-500)',
                background: 'var(--paper-200)',
                padding: '0.2rem 0.5rem',
                borderRadius: '2px',
                textTransform: 'uppercase',
              }}
            >
              Coming Later
            </span>
          </div>
        </div>

        {/* Back Link */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/app/investigation" className="btn btn-secondary btn-sm">
            <ArrowLeft size={13} /> Return to AI Investigation
          </Link>

          <aside
            role="note"
            style={{
              fontSize: '0.75rem',
              color: 'var(--paper-500)',
              fontStyle: 'italic',
            }}
          >
            CaseIntel is a research and review aid, NOT legal advice.
          </aside>
        </div>
      </div>
    </div>
  );
}
