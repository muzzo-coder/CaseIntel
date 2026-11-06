/**
 * Timeline — §16 / Chronological Evidence Wall (/app/timeline)
 * Vertical brass rule on paper-100 wall.
 * Pinned index cards with normalized + raw dates, document initial badges, source citations.
 * Inconsistency marker between 12 Mar and 14 Mar.
 * Right side drawer for selected event's verbatim source span.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  BookOpen,
  X,
} from 'lucide-react';
import { useMatter } from '../context/MatterContext';
import { MOCK_MATTER, MOCK_EVENTS, MOCK_DOCUMENTS } from '../mocks/data';
import DemoTag from '../components/ui/DemoTag';
import SourceCitation from '../components/ui/SourceCitation';

export default function Timeline() {
  const { activeMatter = MOCK_MATTER } = useMatter() || {};
  const matter = activeMatter || MOCK_MATTER;

  const [events] = useState(MOCK_EVENTS);
  const [selectedDoc, setSelectedDoc] = useState('all');
  const [density, setDensity] = useState('comfortable'); // 'compact' | 'comfortable'
  const [selectedEvent, setSelectedEvent] = useState(MOCK_EVENTS[0]);
  const [drawerOpen, setDrawerOpen] = useState(true);

  const filteredEvents = events.filter((ev) => {
    if (selectedDoc !== 'all' && ev.sourceDoc !== selectedDoc) return false;
    return true;
  });

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
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <span className="case-id" style={{ color: 'var(--gold-400)', fontSize: '0.8125rem' }}>
                {matter.id}
              </span>
              <span style={{ color: 'var(--ink-600)' }}>·</span>
              <span className="meta-label on-black" style={{ fontSize: '0.6875rem' }}>
                GROUNDED CHRONOLOGY
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
              Event Timeline
            </h1>
          </div>

          {/* Density toggle & filters */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Segmented Control */}
            <div
              style={{
                display: 'inline-flex',
                background: 'var(--ink-900)',
                border: '1px solid var(--ink-700)',
                borderRadius: '2px',
                padding: '2px',
              }}
            >
              <button
                onClick={() => setDensity('compact')}
                style={{
                  background: density === 'compact' ? 'var(--ink-800)' : 'transparent',
                  color: density === 'compact' ? 'var(--paper-0)' : 'var(--ink-400)',
                  border: 'none',
                  fontSize: '0.6875rem',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontFamily: "'IBM Plex Mono'",
                }}
              >
                COMPACT
              </button>
              <button
                onClick={() => setDensity('comfortable')}
                style={{
                  background: density === 'comfortable' ? 'var(--ink-800)' : 'transparent',
                  color: density === 'comfortable' ? 'var(--paper-0)' : 'var(--ink-400)',
                  border: 'none',
                  fontSize: '0.6875rem',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontFamily: "'IBM Plex Mono'",
                }}
              >
                COMFORTABLE
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Subheader Controls Bar ── */}
      <div
        style={{
          background: 'var(--paper-0)',
          borderBottom: '1px solid var(--paper-200)',
          padding: '0.75rem 2rem',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="meta-label" style={{ fontSize: '0.6875rem' }}>FILTER EXHIBIT:</span>
            <select
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              className="input-base"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'var(--paper-50)' }}
            >
              <option value="all">All exhibits ({MOCK_DOCUMENTS.length})</option>
              {MOCK_DOCUMENTS.map((doc) => (
                <option key={doc.id} value={doc.name}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--paper-500)', fontFamily: "'IBM Plex Mono'" }}>
            SHOWING {filteredEvents.length} GROUNDED EVENTS
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: drawerOpen ? 'minmax(0, 1.8fr) minmax(340px, 1.2fr)' : '1fr',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {/* ── Left: Chronology Rule & Index Cards ── */}
        <div>
          <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
            {/* Vertical Brass Rule */}
            <div
              style={{
                position: 'absolute',
                left: '1rem',
                top: '0.5rem',
                bottom: '1rem',
                width: '1px',
                background: 'var(--gold-line)',
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: density === 'compact' ? '1rem' : '1.75rem' }}>
              {filteredEvents.map((ev) => {
                const isSelected = selectedEvent?.id === ev.id;

                return (
                  <div key={ev.id} style={{ position: 'relative' }}>
                    {/* Pin Marker on Brass Line */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '-2rem',
                        top: '1.25rem',
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        background: isSelected ? 'var(--gold-500)' : 'var(--paper-0)',
                        border: '2px solid var(--gold-500)',
                        boxShadow: 'var(--shadow-paper-rest)',
                        zIndex: 2,
                      }}
                    />

                    {/* Timeline Event Index Card */}
                    <article
                      onClick={() => {
                        setSelectedEvent(ev);
                        setDrawerOpen(true);
                      }}
                      style={{
                        background: 'var(--paper-0)',
                        border: isSelected ? '1px solid var(--gold-500)' : '1px solid var(--paper-200)',
                        borderRadius: '2px',
                        padding: density === 'compact' ? '0.75rem 1rem' : '1.25rem 1.5rem',
                        boxShadow: isSelected ? 'var(--shadow-paper-lift)' : 'var(--shadow-paper-rest)',
                        cursor: 'pointer',
                        transition: 'transform var(--motion-quick), border-color var(--motion-quick)',
                      }}
                    >
                      {/* Top Row: Date Pill & Exhibit Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <span
                            style={{
                              fontFamily: "'IBM Plex Mono'",
                              fontSize: '0.8125rem',
                              fontWeight: 600,
                              color: 'var(--gold-600)',
                              letterSpacing: '0.04em',
                            }}
                          >
                            {ev.date}
                          </span>
                          <span
                            style={{
                              fontFamily: "'IBM Plex Mono'",
                              fontSize: '0.6875rem',
                              color: 'var(--paper-500)',
                              background: 'var(--paper-100)',
                              padding: '0.1rem 0.35rem',
                              borderRadius: '2px',
                            }}
                          >
                            RAW: "{ev.dateRaw}"
                          </span>
                        </div>

                        {/* Document Initial Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <span
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '2px',
                              background: 'var(--paper-900)',
                              color: 'var(--paper-0)',
                              fontSize: '0.625rem',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {ev.sourceDoc[0]}
                          </span>
                          <SourceCitation docName={ev.sourceDoc} page={ev.sourcePage} />
                        </div>
                      </div>

                      {/* Event Description */}
                      <p
                        style={{
                          fontFamily: "'Source Serif 4', Georgia, serif",
                          fontSize: '0.9375rem',
                          lineHeight: 1.6,
                          color: 'var(--paper-900)',
                          margin: '0 0 0.75rem 0',
                        }}
                      >
                        {ev.description}
                      </p>

                      {/* Actors involved */}
                      {ev.actors && ev.actors.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span className="meta-label" style={{ fontSize: '0.625rem' }}>ACTORS:</span>
                          {ev.actors.map((actor, aIdx) => (
                            <span
                              key={aIdx}
                              style={{
                                fontSize: '0.6875rem',
                                color: 'var(--paper-700)',
                                background: 'var(--paper-50)',
                                border: '1px solid var(--paper-200)',
                                padding: '0.1rem 0.4rem',
                                borderRadius: '2px',
                              }}
                            >
                              {actor}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>

                    {/* Discrepancy Callout between 12 Mar and 14 Mar */}
                    {ev.id === 'EV-001' && (
                      <div
                        style={{
                          margin: '0.75rem 0',
                          padding: '0.5rem 0.875rem',
                          background: 'var(--state-warn-bg)',
                          borderLeft: '2px solid var(--state-warn-text)',
                          border: '1px solid var(--state-warn-text)',
                          borderRadius: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <AlertTriangle size={14} style={{ color: 'var(--state-warn-text)' }} />
                          <span style={{ fontSize: '0.75rem', color: 'var(--state-warn-text)', fontWeight: 500 }}>
                            POSSIBLE DATE INCONSISTENCY (12 Mar vs 14 Mar)
                          </span>
                        </div>
                        <Link
                          to="/app/findings/FN-0042-001/compare"
                          className="btn btn-sm btn-secondary"
                          style={{ fontSize: '0.6875rem', padding: '0.2rem 0.5rem' }}
                        >
                          View Comparison ↗
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <aside
            role="note"
            style={{
              marginTop: '2rem',
              fontSize: '0.75rem',
              color: 'var(--paper-500)',
              borderLeft: '2px solid var(--gold-500)',
              paddingLeft: '0.75rem',
              fontStyle: 'italic',
            }}
          >
            CaseIntel is a research and review aid, NOT legal advice.
          </aside>
        </div>

        {/* ── Right: Selected Event Source Span Drawer ── */}
        {drawerOpen && selectedEvent && (
          <div
            style={{
              background: 'var(--paper-0)',
              border: '1px solid var(--paper-200)',
              borderRadius: '2px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-paper-rest)',
              position: 'sticky',
              top: '5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--paper-200)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={16} style={{ color: 'var(--gold-600)' }} />
                <span className="meta-label" style={{ fontSize: '0.6875rem' }}>
                  GROUNDED EXCERPT
                </span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--paper-400)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.75rem', color: 'var(--gold-600)', marginBottom: '0.25rem' }}>
                EVENT ID: {selectedEvent.id}
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--paper-900)' }}>
                {selectedEvent.description}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <SourceCitation docName={selectedEvent.sourceDoc} page={selectedEvent.sourcePage} />
            </div>

            {/* Verbatim Surrounding Text */}
            <div
              style={{
                background: 'var(--paper-50)',
                border: '1px solid var(--paper-300)',
                borderRadius: '2px',
                padding: '1.25rem',
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: '0.875rem',
                lineHeight: 1.65,
                color: 'var(--paper-800)',
              }}
            >
              <div
                style={{
                  fontFamily: "'IBM Plex Mono'",
                  fontSize: '0.625rem',
                  color: 'var(--paper-400)',
                  marginBottom: '0.5rem',
                }}
              >
                VERBATIM DOCUMENT PASSAGE
              </div>
              <p style={{ margin: '0 0 0.5rem 0', opacity: 0.6 }}>
                ...In furtherance of the transaction, the accused assured prompt encashment upon delivery of goods...
              </p>
              <mark
                style={{
                  backgroundColor: 'rgba(239, 230, 208, 0.95)',
                  color: 'var(--paper-900)',
                  padding: '0.2rem 0.35rem',
                  borderRadius: '1px',
                  borderLeft: '2px solid var(--gold-500)',
                  display: 'block',
                  margin: '0.5rem 0',
                }}
              >
                "...{selectedEvent.description.toLowerCase()}..."
              </mark>
              <p style={{ margin: '0.5rem 0 0 0', opacity: 0.6 }}>
                ...which was acknowledged by the attending clerk and placed into the ledger records accordingly...
              </p>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
              <Link
                to={`/app/documents/${selectedEvent.sourceDoc}`}
                className="btn btn-sm btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Open Document
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
