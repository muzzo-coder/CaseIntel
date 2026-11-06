/**
 * DocumentViewer — §15.2 / Evidentiary Leaf Reader (/app/documents/:docId)
 * Clean paper-styled reader:
 * Black topbar with doc name, page navigation, zoom controls, and metadata.
 * White leaf container with Source Serif 4 typography and highlighted spans.
 */
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useMatter } from '../context/MatterContext';
import { MOCK_MATTER, MOCK_DOCUMENTS } from '../mocks/data';
import DemoTag from '../components/ui/DemoTag';

export default function DocumentViewer() {
  const { docId } = useParams();
  const { activeMatter = MOCK_MATTER } = useMatter() || {};
  const matter = activeMatter || MOCK_MATTER;

  const doc =
    MOCK_DOCUMENTS.find((d) => d.id === docId || d.name === docId) ||
    MOCK_DOCUMENTS[0];

  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  const totalPages = doc.pages || 8;

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-200)', display: 'flex', flexDirection: 'column' }}>
      {/* ── Top Bar (Black Surface) ── */}
      <header
        style={{
          background: 'var(--ink-950)',
          color: 'var(--ink-300)',
          borderBottom: '1px solid var(--ink-700)',
          padding: '0.75rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            to="/app/documents"
            className="btn btn-sm btn-secondary"
            style={{ color: 'var(--paper-0)', borderColor: 'var(--ink-600)' }}
          >
            <ArrowLeft size={13} /> Back to Library
          </Link>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '1rem',
                  color: 'var(--paper-0)',
                  fontWeight: 500,
                }}
              >
                {doc.name}
              </span>
              <DemoTag />
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.6875rem', color: 'var(--gold-400)' }}>
              {doc.type} · {matter.id}
            </div>
          </div>
        </div>

        {/* Page navigation controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="btn btn-sm btn-secondary"
              style={{ color: 'var(--paper-0)', borderColor: 'var(--ink-600)' }}
              title="Previous Page"
            >
              <ChevronLeft size={14} />
            </button>

            <span
              style={{
                fontFamily: "'IBM Plex Mono'",
                fontSize: '0.75rem',
                color: 'var(--paper-0)',
                padding: '0 0.5rem',
              }}
            >
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="btn btn-sm btn-secondary"
              style={{ color: 'var(--paper-0)', borderColor: 'var(--ink-600)' }}
              title="Next Page"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Zoom controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', borderLeft: '1px solid var(--ink-700)', paddingLeft: '1rem' }}>
            <button
              onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
              className="btn btn-sm btn-secondary"
              style={{ color: 'var(--paper-0)', borderColor: 'var(--ink-600)' }}
              title="Zoom out"
            >
              <ZoomOut size={13} />
            </button>
            <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.6875rem', color: 'var(--paper-400)', minWidth: '40px', textAlign: 'center' }}>
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
              className="btn btn-sm btn-secondary"
              style={{ color: 'var(--paper-0)', borderColor: 'var(--ink-600)' }}
              title="Zoom in"
            >
              <ZoomIn size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Document Page Canvas ── */}
      <main
        style={{
          flex: 1,
          padding: '2.5rem 1rem',
          display: 'flex',
          justifyContent: 'center',
          overflowY: 'auto',
        }}
      >
        <article
          style={{
            background: 'var(--paper-0)',
            width: `${Math.round(800 * (zoomLevel / 100))}px`,
            minHeight: '1050px',
            padding: '4rem 4.5rem',
            boxShadow: 'var(--shadow-paper-lift)',
            borderRadius: '2px',
            color: 'var(--paper-900)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Leaf Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--paper-200)',
              paddingBottom: '1rem',
              marginBottom: '2rem',
              fontFamily: "'IBM Plex Mono'",
              fontSize: '0.6875rem',
              color: 'var(--paper-500)',
            }}
          >
            <span>CASEINTEL VERIFIED EXHIBIT · {doc.id}</span>
            <span>LEAF {currentPage}</span>
          </div>

          {/* Document Content */}
          <div
            style={{
              flex: 1,
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '1rem',
              lineHeight: 1.85,
              color: 'var(--paper-900)',
            }}
          >
            <h1
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: '1.25rem',
                textAlign: 'center',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                margin: '0 0 2rem 0',
                color: 'var(--paper-900)',
              }}
            >
              In the Court of the Chief Metropolitan Magistrate<br />
              Patiala House Courts, New Delhi
            </h1>

            <p style={{ textAlign: 'center', fontStyle: 'italic', margin: '0 0 2rem 0', color: 'var(--paper-700)' }}>
              In the matter of: <strong>{matter.title}</strong>
            </p>

            <p>
              1. That the complainant is a scheduled banking institution incorporated under the provisions of the Banking Companies Act, having its registered branch office situated at Connaught Place, New Delhi.
            </p>

            <p>
              2. That the accused Rajesh Sharma approached the complainant bank for extension of financial credit facilities and in discharge of existing legally enforceable debts and liabilities, issued instrument bearing Cheque No. 492019.
            </p>

            {/* Inconsistency Span Highlight */}
            {currentPage === 2 && (
              <div
                style={{
                  background: 'rgba(239, 230, 208, 0.9)',
                  borderLeft: '3px solid var(--gold-500)',
                  padding: '0.75rem 1rem',
                  margin: '1.5rem 0',
                  borderRadius: '1px',
                }}
              >
                <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.625rem', color: 'var(--gold-600)', marginBottom: '0.25rem' }}>
                  GROUNDED CITATION (FN-0042-001)
                </div>
                <strong>
                  "…the accused Rajesh Sharma issued Cheque No. 492019 dated 12 March 2024 for a sum of ₹2,40,000 drawn on Regional Bank of Delhi…"
                </strong>
              </div>
            )}

            <p>
              3. That upon presentation through proper clearing channels, the said cheque was dishonoured with the statutory return memo citing insufficiency of funds.
            </p>

            <p>
              4. That a statutory demand notice under Section 138 of the Negotiable Instruments Act was issued within the period of limitation, calling upon the accused to make good the tendered payment.
            </p>

            <p>
              5. That the accused failed, neglected, and refused to comply with the said requisition, thereby committing an offence punishable under Section 138 of the Negotiable Instruments Act, 1881.
            </p>
          </div>

          {/* Leaf Footer */}
          <div
            style={{
              borderTop: '1px solid var(--paper-200)',
              paddingTop: '1rem',
              marginTop: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: "'IBM Plex Mono'",
              fontSize: '0.6875rem',
              color: 'var(--paper-500)',
            }}
          >
            <span>{matter.id} · EXHIBIT CONFIDENTIAL</span>
            <span>PAGE {currentPage} OF {totalPages}</span>
          </div>
        </article>
      </main>
    </div>
  );
}
