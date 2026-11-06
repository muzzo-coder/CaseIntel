/**
 * Settings — §21 / System Preferences (/app/settings)
 * Sections: Appearance, Data, Notifications, Quality.
 * No billing/RBAC/org fields shown.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sliders,
  ShieldAlert,
  Bell,
  BarChart2,
  Trash2,
  Check,
  ArrowRight,
} from 'lucide-react';
import { useMatter } from '../context/MatterContext';
import { MOCK_MATTER } from '../mocks/data';
import DemoTag from '../components/ui/DemoTag';

export default function Settings() {
  const { activeMatter = MOCK_MATTER } = useMatter() || {};
  const matter = activeMatter || MOCK_MATTER;

  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState('medium'); // 'small' | 'medium' | 'large'
  const [notifyPipeline, setNotifyPipeline] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [dataDeleted, setDataDeleted] = useState(false);

  const handleDeleteData = () => {
    setDataDeleted(true);
    setDeleteConfirmOpen(false);
    setTimeout(() => setDataDeleted(false), 3000);
  };

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
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <span className="meta-label on-black" style={{ fontSize: '0.6875rem' }}>
              ENVIRONMENT PREFERENCES
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
            Settings
          </h1>
        </div>
      </header>

      {/* ── Settings Sections ── */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Section 1: Appearance */}
          <section
            style={{
              background: 'var(--paper-0)',
              border: '1px solid var(--paper-200)',
              borderRadius: '2px',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-paper-rest)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Sliders size={18} style={{ color: 'var(--gold-500)' }} />
              <h2 className="meta-label" style={{ fontSize: '0.75rem', margin: 0 }}>
                APPEARANCE & ACCESSIBILITY
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Reduced Motion Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--paper-900)' }}>
                    Reduced Motion
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--paper-500)' }}>
                    Disable decorative stamp press and span animations.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--gold-500)', cursor: 'pointer' }}
                />
              </div>

              {/* High Contrast Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--paper-100)', paddingTop: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--paper-900)' }}>
                    High Contrast Surfaces
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--paper-500)' }}>
                    Enforce pure #000000 on black and #FFFFFF on paper surfaces.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--gold-500)', cursor: 'pointer' }}
                />
              </div>

              {/* Text Size Segmented */}
              <div style={{ borderTop: '1px solid var(--paper-100)', paddingTop: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--paper-900)', marginBottom: '0.5rem' }}>
                  Document Reader Text Size
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    background: 'var(--paper-100)',
                    border: '1px solid var(--paper-300)',
                    borderRadius: '2px',
                    padding: '2px',
                  }}
                >
                  {['small', 'medium', 'large'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setTextSize(sz)}
                      style={{
                        background: textSize === sz ? 'var(--paper-0)' : 'transparent',
                        color: textSize === sz ? 'var(--paper-900)' : 'var(--paper-500)',
                        border: 'none',
                        fontSize: '0.75rem',
                        fontWeight: textSize === sz ? 600 : 400,
                        padding: '0.35rem 0.85rem',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        boxShadow: textSize === sz ? 'var(--shadow-paper-rest)' : 'none',
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Notifications */}
          <section
            style={{
              background: 'var(--paper-0)',
              border: '1px solid var(--paper-200)',
              borderRadius: '2px',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-paper-rest)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Bell size={18} style={{ color: 'var(--gold-500)' }} />
              <h2 className="meta-label" style={{ fontSize: '0.75rem', margin: 0 }}>
                NOTIFICATIONS
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--paper-900)' }}>
                  Pipeline Completion Alerts
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--paper-500)' }}>
                  Show in-app toasts when long-running OCR and inconsistency detection runs conclude.
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifyPipeline}
                onChange={(e) => setNotifyPipeline(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--gold-500)', cursor: 'pointer' }}
              />
            </div>
          </section>

          {/* Section 3: Quality & Evaluation */}
          <section
            style={{
              background: 'var(--paper-0)',
              border: '1px solid var(--paper-200)',
              borderRadius: '2px',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-paper-rest)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <BarChart2 size={18} style={{ color: 'var(--gold-500)' }} />
              <h2 className="meta-label" style={{ fontSize: '0.75rem', margin: 0 }}>
                BENCHMARKS & QUALITY
              </h2>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--paper-700)', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
              CaseIntel maintains empirical evaluation ledgers measuring retrieval recall, extraction precision, and false-positive inconsistency rates.
            </p>

            <Link to="/app/reports" className="btn btn-secondary btn-sm">
              <span>View Evaluation Ledger</span>
              <ArrowRight size={13} />
            </Link>
          </section>

          {/* Section 4: Data Management (Destructive) */}
          <section
            style={{
              background: 'var(--paper-0)',
              border: '1px solid var(--state-error-text)',
              borderRadius: '2px',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-paper-rest)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--state-error-text)' }}>
              <ShieldAlert size={18} />
              <h2 className="meta-label" style={{ fontSize: '0.75rem', margin: 0, color: 'var(--state-error-text)' }}>
                DESTRUCTIVE DATA MANAGEMENT
              </h2>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--paper-700)', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
              Purge all cached OCR indexes, extracted entities, and finding records associated with active matter <strong>{matter.id}</strong>. Ingested original documents will require re-analysis.
            </p>

            {dataDeleted && (
              <div
                style={{
                  background: 'var(--state-ok-bg)',
                  border: '1px solid var(--state-ok-text)',
                  color: 'var(--state-ok-text)',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.75rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Check size={14} /> Matter analysis cache purged successfully.
              </div>
            )}

            {deleteConfirmOpen ? (
              <div style={{ background: 'var(--state-error-bg)', padding: '1rem', border: '1px solid var(--state-error-text)', borderRadius: '2px' }}>
                <div style={{ fontSize: '0.8125rem', color: 'var(--state-error-text)', fontWeight: 500, marginBottom: '0.75rem' }}>
                  Confirm purge of all analysis data for {matter.id}? This action cannot be reversed.
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={handleDeleteData} className="btn btn-sm btn-destructive">
                    Yes, Purge Matter Cache
                  </button>
                  <button onClick={() => setDeleteConfirmOpen(false)} className="btn btn-sm btn-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setDeleteConfirmOpen(true)} className="btn btn-sm btn-destructive">
                <Trash2 size={13} />
                Purge Matter Data…
              </button>
            )}
          </section>

          {/* Footer note */}
          <aside
            role="note"
            style={{
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
    </div>
  );
}
