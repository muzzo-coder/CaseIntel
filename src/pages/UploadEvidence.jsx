/**
 * UploadEvidence — §15 / Evidentiary Intake (/app/upload)
 * Left dropzone with dashed border, right case folder visual.
 * Queue rows with document classification selector and simulated pipeline staging.
 */
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useMatter } from '../context/MatterContext';
import { MOCK_MATTER } from '../mocks/data';
import GoldSeal from '../components/ui/GoldSeal';
import DemoTag from '../components/ui/DemoTag';

const DOC_TYPES = [
  'Complaint',
  'Statement',
  'Report',
  'Notice',
  'Judgment',
  'Agreement',
  'Affidavit',
  'Other',
];

export default function UploadEvidence() {
  const fileInputRef = useRef(null);
  const { activeMatter = MOCK_MATTER } = useMatter() || {};
  const matter = activeMatter || MOCK_MATTER;

  const [files, setFiles] = useState([
    {
      id: 'FILE-01',
      name: 'Bank_Statement_March2024.pdf',
      size: '2.4 MB',
      type: 'Report',
      status: 'completed', // 'queued' | 'uploading' | 'completed' | 'failed'
    },
    {
      id: 'FILE-02',
      name: 'Affidavit_Priya_Mehta.pdf',
      size: '1.1 MB',
      type: 'Statement',
      status: 'queued',
    },
  ]);

  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSimulateAdd = (name, size, type) => {
    setErrorMessage('');
    const newDoc = {
      id: `FILE-${String(files.length + 1).padStart(2, '0')}`,
      name,
      size,
      type: type || 'Report',
      status: 'queued',
    };
    setFiles((prev) => [...prev, newDoc]);
  };

  const handleNativeFileSelect = (e) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;
    setErrorMessage('');
    const newItems = Array.from(selected).map((f, i) => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      if (ext !== 'pdf' && ext !== 'docx') {
        setErrorMessage('Unsupported file format. Please upload PDF or DOCX only.');
      }
      return {
        id: `FILE-${Date.now()}-${i}`,
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        type: 'Complaint',
        status: 'queued',
      };
    });
    setFiles((prev) => [...prev, ...newItems]);
  };

  const handleTypeChange = (id, newType) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, type: newType } : f))
    );
  };

  const handleRemove = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleStartUpload = () => {
    setUploading(true);
    // Move all queued to uploading
    setFiles((prev) =>
      prev.map((f) => (f.status === 'queued' ? { ...f, status: 'uploading' } : f))
    );

    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) => ({ ...f, status: 'completed' }))
      );
      setUploading(false);
    }, 1200);
  };

  const completedCount = files.filter((f) => f.status === 'completed').length;
  const queuedCount = files.filter((f) => f.status === 'queued' || f.status === 'uploading').length;

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
                EVIDENTIARY INTAKE
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
              Upload Evidence
            </h1>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => handleSimulateAdd('Deposition_Transcript_2024.pdf', '3.8 MB', 'Statement')}
              className="btn btn-sm btn-hero"
            >
              + Add Sample Exhibit
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '1.5rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* ── Left 2/3: Dropzone & Staging Queue ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Dropzone */}
          <div
            style={{
              background: 'var(--paper-0)',
              border: '1.5px dashed var(--paper-300)',
              borderRadius: '2px',
              padding: '3rem 2rem',
              minHeight: '280px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'border-color var(--motion-quick)',
            }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = 'var(--gold-500)';
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--paper-300)';
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = 'var(--paper-300)';
              if (e.dataTransfer.files?.length) {
                const f = e.dataTransfer.files[0];
                handleSimulateAdd(f.name, `${(f.size / (1024 * 1024)).toFixed(1)} MB`, 'Report');
              }
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleNativeFileSelect}
              multiple
              accept=".pdf,.docx"
              style={{ display: 'none' }}
            />
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '2px',
                background: 'var(--paper-100)',
                border: '1px solid var(--paper-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold-600)',
                marginBottom: '1rem',
              }}
            >
              <Upload size={22} />
            </div>

            <h3
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: '1.25rem',
                fontWeight: 500,
                color: 'var(--paper-900)',
                margin: '0 0 0.5rem 0',
                letterSpacing: '0.02em',
              }}
            >
              DROP DOCUMENTS HERE
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--paper-500)', margin: '0 0 1rem 0' }}>
              or click to browse your local workspace
            </p>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Select Files
            </button>

            <div
              style={{
                marginTop: '1.5rem',
                fontFamily: "'IBM Plex Mono'",
                fontSize: '0.6875rem',
                color: 'var(--paper-500)',
              }}
            >
              ACCEPTED FORMATS: PDF, DOCX · RECOMMENDED: 3–5 RELATED DOCUMENTS
            </div>
          </div>

          {errorMessage && (
            <div
              style={{
                background: 'var(--state-error-bg)',
                border: '1px solid var(--state-error-text)',
                color: 'var(--state-error-text)',
                padding: '0.75rem 1rem',
                fontSize: '0.8125rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={15} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Queue Rows */}
          <div
            style={{
              background: 'var(--paper-0)',
              border: '1px solid var(--paper-200)',
              borderRadius: '2px',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-paper-rest)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--paper-200)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <span className="meta-label" style={{ fontSize: '0.6875rem' }}>
                  INTAKE STAGING QUEUE ({files.length})
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--paper-500)', marginLeft: '0.5rem' }}>
                  Assign legal document categories prior to analysis
                </span>
              </div>
              {queuedCount > 0 && (
                <button
                  onClick={handleStartUpload}
                  disabled={uploading}
                  className="btn btn-primary btn-sm"
                >
                  {uploading ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" /> Uploading…
                    </>
                  ) : (
                    `Upload ${queuedCount} Items`
                  )}
                </button>
              )}
            </div>

            {files.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--paper-500)', fontSize: '0.875rem' }}>
                No exhibits currently queued. Drag and drop files above.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {files.map((file) => (
                  <div
                    key={file.id}
                    style={{
                      border: '1px solid var(--paper-200)',
                      borderRadius: '2px',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: 'var(--paper-50)',
                    }}
                  >
                    <FileText size={18} style={{ color: 'var(--gold-600)', flexShrink: 0 }} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--paper-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {file.name}
                      </div>
                      <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.6875rem', color: 'var(--paper-500)' }}>
                        {file.size}
                      </div>
                    </div>

                    {/* Doc Type Selector */}
                    <div>
                      <select
                        value={file.type}
                        onChange={(e) => handleTypeChange(file.id, e.target.value)}
                        className="input-base"
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem',
                          background: 'var(--paper-0)',
                          borderRadius: '2px',
                        }}
                      >
                        {DOC_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status Chip */}
                    <div>
                      {file.status === 'completed' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
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
                          <CheckCircle2 size={11} /> Ready
                        </span>
                      ) : file.status === 'uploading' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.6875rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '2px',
                            background: 'var(--gold-100)',
                            color: 'var(--gold-600)',
                            border: '1px solid var(--gold-500)',
                            fontFamily: "'IBM Plex Mono'",
                            textTransform: 'uppercase',
                          }}
                        >
                          <RefreshCw size={11} className="animate-spin" /> Ingesting
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '2px',
                            background: 'var(--paper-200)',
                            color: 'var(--paper-700)',
                            border: '1px solid var(--paper-300)',
                            fontFamily: "'IBM Plex Mono'",
                            textTransform: 'uppercase',
                          }}
                        >
                          Queued
                        </span>
                      )}
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleRemove(file.id)}
                      title="Remove from queue"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--paper-400)',
                        cursor: 'pointer',
                        padding: '0.25rem',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.color = 'var(--state-error-text)')}
                      onMouseOut={(e) => (e.currentTarget.style.color = 'var(--paper-400)')}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

            <Link
              to="/app/analysis"
              className={`btn btn-primary btn-md ${completedCount === 0 ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <span>Run Pipeline Analysis</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* ── Right 1/3: Case Dossier Visual ── */}
        <div
          style={{
            background: 'var(--paper-0)',
            border: '1px solid var(--paper-200)',
            borderRadius: '2px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-paper-rest)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--paper-200)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <GoldSeal size={18} />
            <span className="meta-label" style={{ fontSize: '0.6875rem' }}>
              MATTER DOSSIER
            </span>
          </div>

          {/* Case Folder Graphic */}
          <div
            style={{
              background: 'var(--paper-50)',
              border: '1px solid var(--paper-200)',
              borderRadius: '2px',
              padding: '1.5rem',
              textAlign: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <svg width="120" height="90" viewBox="0 0 120 90" fill="none" style={{ margin: '0 auto 0.75rem auto' }}>
              <path d="M10 24C10 21.7909 11.7909 20 14 20H42L52 28H106C108.209 28 110 29.7909 110 32V78C110 80.2091 108.209 82 106 82H14C11.7909 82 10 80.2091 10 78V24Z" fill="var(--paper-200)" stroke="var(--paper-300)" strokeWidth="1.5" />
              <rect x="20" y="36" width="80" height="40" rx="1" fill="var(--paper-0)" stroke="var(--paper-300)" />
              <line x1="28" y1="46" x2="68" y2="46" stroke="var(--paper-300)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="28" y1="54" x2="84" y2="54" stroke="var(--paper-300)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="28" y1="62" x2="52" y2="62" stroke="var(--paper-300)" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="86" cy="62" r="5" stroke="var(--gold-500)" strokeWidth="1" fill="none" />
            </svg>

            <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.8125rem', color: 'var(--gold-600)', fontWeight: 500 }}>
              {matter.id}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--paper-700)', marginTop: '0.25rem' }}>
              {matter.title}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--paper-100)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--paper-500)' }}>Exhibits Ingested</span>
              <span style={{ fontFamily: "'IBM Plex Mono'", color: 'var(--paper-900)' }}>{matter.documentCount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--paper-100)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--paper-500)' }}>New Staged Files</span>
              <span style={{ fontFamily: "'IBM Plex Mono'", color: 'var(--paper-900)' }}>{files.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--paper-100)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--paper-500)' }}>OCR Extraction Engine</span>
              <span style={{ color: 'var(--state-ok-text)', fontFamily: "'IBM Plex Mono'" }}>Tesseract / Layout</span>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'var(--paper-50)', border: '1px solid var(--paper-200)', borderRadius: '2px', fontSize: '0.75rem', color: 'var(--paper-500)', lineHeight: 1.5 }}>
            Ingested documents undergo text extraction, entity linking, timeline event anchoring, and cross-source consistency detection.
          </div>
        </div>
      </div>
    </div>
  );
}
