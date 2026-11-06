/**
 * Conversations — §18 / Inquiry Log (/app/conversations)
 * List of past evidentiary queries with status chips:
 * (Answered with evidence / Insufficient evidence), citation count, and timestamp.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Search,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useMatter } from '../context/MatterContext';
import { MOCK_MATTER, MOCK_CONVERSATIONS } from '../mocks/data';
import DemoTag from '../components/ui/DemoTag';
import EmptyState from '../components/ui/EmptyState';

export default function Conversations() {
  const { activeMatter = MOCK_MATTER } = useMatter() || {};
  const matter = activeMatter || MOCK_MATTER;

  const [conversations] = useState(MOCK_CONVERSATIONS);
  const [filter, setFilter] = useState('all'); // 'all' | 'answered' | 'insufficient-evidence'
  const [search, setSearch] = useState('');

  const filtered = conversations.filter((item) => {
    if (filter !== 'all' && item.status !== filter) return false;
    if (search && !item.question.toLowerCase().includes(search.toLowerCase())) return false;
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
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <span className="case-id" style={{ color: 'var(--gold-400)', fontSize: '0.8125rem' }}>
                {matter.id}
              </span>
              <span style={{ color: 'var(--ink-600)' }}>·</span>
              <span className="meta-label on-black" style={{ fontSize: '0.6875rem' }}>
                CONVERSATION ARCHIVE
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
              Past Investigations
            </h1>
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <Link to="/app/investigation" className="btn btn-hero btn-md">
              <MessageSquare size={14} />
              New Inquiry
            </Link>
          </div>
        </div>
      </header>

      {/* ── Controls Bar ── */}
      <div
        style={{
          background: 'var(--paper-0)',
          borderBottom: '1px solid var(--paper-200)',
          padding: '0.75rem 2rem',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter inquiry log…"
              className="input-base"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem 0.35rem 2rem', width: '100%' }}
            />
            <Search size={13} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--paper-400)' }} />
          </div>

          {/* Status selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span className="meta-label" style={{ fontSize: '0.6875rem' }}>STATUS:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-base"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem', background: 'var(--paper-50)' }}
            >
              <option value="all">All queries</option>
              <option value="answered">Answered with evidence</option>
              <option value="insufficient-evidence">Insufficient evidence</option>
            </select>
          </div>

          <div style={{ marginLeft: 'auto', fontFamily: "'IBM Plex Mono'", fontSize: '0.6875rem', color: 'var(--paper-500)' }}>
            SHOWING {filtered.length} QUERIES
          </div>
        </div>
      </div>

      {/* ── Conversations Table / List ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {filtered.length === 0 ? (
          <div
            style={{
              background: 'var(--paper-0)',
              border: '1px solid var(--paper-200)',
              borderRadius: '2px',
              padding: '3rem',
            }}
          >
            <EmptyState
              object="search"
              title="No Inquiries Recorded"
              description="No questions match the current filter. Ask what the documents say to record an investigation entry."
              action={
                <Link to="/app/investigation" className="btn btn-primary btn-sm">
                  Start Investigation
                </Link>
              }
            />
          </div>
        ) : (
          <div
            style={{
              background: 'var(--paper-0)',
              border: '1px solid var(--paper-200)',
              borderRadius: '2px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-paper-rest)',
            }}
          >
            <table className="table-legal" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--paper-50)', borderBottom: '1px solid var(--paper-200)' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.6875rem', color: 'var(--paper-500)' }}>
                    QUESTION INQUIRY
                  </th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.6875rem', color: 'var(--paper-500)' }}>
                    GROUNDING STATUS
                  </th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.6875rem', color: 'var(--paper-500)' }}>
                    CITATIONS
                  </th>
                  <th style={{ textAlign: 'right', padding: '0.75rem 1rem', fontSize: '0.6875rem', color: 'var(--paper-500)' }}>
                    TIMESTAMP
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid var(--paper-100)',
                      cursor: 'pointer',
                      transition: 'background var(--motion-quick)',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'var(--paper-50)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Question text */}
                    <td style={{ padding: '1rem', maxWidth: '480px' }}>
                      <Link
                        to="/app/investigation"
                        style={{
                          textDecoration: 'none',
                          color: 'var(--paper-900)',
                          fontFamily: "'Source Serif 4', Georgia, serif",
                          fontSize: '0.9375rem',
                          fontWeight: 500,
                        }}
                      >
                        {item.question}
                      </Link>
                      <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.6875rem', color: 'var(--paper-400)', marginTop: '0.25rem' }}>
                        ID: {item.id}
                      </div>
                    </td>

                    {/* Status chip */}
                    <td style={{ padding: '1rem' }}>
                      {item.status === 'answered' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.6875rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '2px',
                            background: 'var(--state-ok-bg)',
                            color: 'var(--state-ok-text)',
                            border: '1px solid var(--state-ok-text)',
                            fontFamily: "'IBM Plex Mono'",
                            textTransform: 'uppercase',
                          }}
                        >
                          <CheckCircle2 size={11} /> Answered with evidence
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.6875rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '2px',
                            background: 'var(--state-warn-bg)',
                            color: 'var(--state-warn-text)',
                            border: '1px solid var(--state-warn-text)',
                            fontFamily: "'IBM Plex Mono'",
                            textTransform: 'uppercase',
                          }}
                        >
                          <AlertCircle size={11} /> Insufficient evidence
                        </span>
                      )}
                    </td>

                    {/* Citations */}
                    <td style={{ padding: '1rem' }}>
                      {item.citations.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          {item.citations.map((c, i) => (
                            <span
                              key={i}
                              style={{
                                fontFamily: "'IBM Plex Mono'",
                                fontSize: '0.75rem',
                                color: 'var(--paper-700)',
                              }}
                            >
                              {c.docName} (p. {c.page})
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--paper-400)', fontStyle: 'italic' }}>
                          None
                        </span>
                      )}
                    </td>

                    {/* Timestamp */}
                    <td style={{ padding: '1rem', textAlign: 'right', fontFamily: "'IBM Plex Mono'", fontSize: '0.75rem', color: 'var(--paper-500)' }}>
                      {new Date(item.answeredAt).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Disclaimer */}
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
    </div>
  );
}
