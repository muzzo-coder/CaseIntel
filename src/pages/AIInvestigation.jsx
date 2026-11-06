/**
 * AIInvestigation — §14 / Evidence Question Desk (/app/investigation)
 * Left 2/3 main panel, right 1/3 Source Peek
 * White paper answer sheet (no chat bubble), numbered citations ①②, evidence cards, verification strip
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, ArrowRight, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { useMatter } from '../context/MatterContext';
import { MOCK_MATTER } from '../mocks/data';
import DemoTag from '../components/ui/DemoTag';
import EvidenceCard from '../components/ui/EvidenceCard';
import SourceCitation from '../components/ui/SourceCitation';
import VerificationStatus from '../components/ui/VerificationStatus';

const SUGGESTED_QUESTIONS = [
  'What date did Rajesh Sharma issue the cheque?',
  'Who was the witness for the dishonour event?',
  'What section of the NI Act was invoked in the notice?',
];

export default function AIInvestigation() {
  const { activeMatter = MOCK_MATTER } = useMatter() || {};
  const matter = activeMatter || MOCK_MATTER;

  const [questionInput, setQuestionInput] = useState('');
  const [activeQuestion, setActiveQuestion] = useState(
    'What date did Rajesh Sharma issue the cheque?'
  );
  const [loading, setLoading] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState({
    docName: 'Complaint.pdf',
    page: 2,
    excerpt:
      '…the accused Rajesh Sharma issued Cheque No. 492019 dated 12 March 2024 for a sum of ₹2,40,000 drawn on Regional Bank of Delhi, Connaught Place Branch in discharge of his lawful liability…',
  });

  // Mock answers dictionary
  const answers = {
    'What date did Rajesh Sharma issue the cheque?': {
      status: 'answered',
      method: 'Extracted with grounded span verification (Pipeline Stage 3 & 6)',
      text: 'According to the formal complaint filed before the Magistrate, Rajesh Sharma issued Cheque No. 492019 on 12 March 2024 ① drawn on the Regional Bank of Delhi, Connaught Place Branch. However, the subsequent Incident Report notes the event as occurring on 14 March 2024 ②, which has been flagged as a possible date discrepancy.',
      citations: [
        { docName: 'Complaint.pdf', page: 2, charStart: 340, charEnd: 420 },
        { docName: 'Incident_Report.pdf', page: 1, charStart: 110, charEnd: 180 },
      ],
      evidence: [
        {
          quote:
            '…the accused Rajesh Sharma issued Cheque No. 492019 dated 12 March 2024 for a sum of ₹2,40,000…',
          docName: 'Complaint.pdf',
          page: 2,
          charStart: 340,
          charEnd: 420,
        },
        {
          quote:
            '…dishonour incident reported with respect to cheque presented on 14 March 2024…',
          docName: 'Incident_Report.pdf',
          page: 1,
          charStart: 110,
          charEnd: 180,
        },
      ],
      verification: {
        status: 'verified',
        checks: { quoteFound: true, supportsFindig: true },
      },
    },
    'Who was the witness for the dishonour event?': {
      status: 'answered',
      method: 'Entity relation extraction (Pipeline Stage 2)',
      text: 'Priya Mehta is recorded as the key witness present during the return and notification of the cheque dishonour at the Connaught Place Branch ①.',
      citations: [{ docName: 'Witness_Statement_A.pdf', page: 1, charStart: 140, charEnd: 215 }],
      evidence: [
        {
          quote:
            'I, Priya Mehta, Branch Operations Supervisor, hereby state that on the relevant date I witnessed the return memo being generated…',
          docName: 'Witness_Statement_A.pdf',
          page: 1,
          charStart: 140,
          charEnd: 215,
        },
      ],
      verification: {
        status: 'verified',
        checks: { quoteFound: true, supportsFindig: true },
      },
    },
    'What section of the NI Act was invoked in the notice?': {
      status: 'insufficient-evidence',
      method: 'Corpus retrieval over 4 active matter exhibits',
      text: null,
      citations: [],
      evidence: [],
      verification: null,
    },
  };

  const currentResult = answers[activeQuestion] || {
    status: 'insufficient-evidence',
    method: 'Corpus retrieval over active matter exhibits',
    text: null,
    citations: [],
    evidence: [],
    verification: null,
  };

  const handleAsk = (q) => {
    const qText = q || questionInput;
    if (!qText.trim()) return;
    setLoading(true);
    setActiveQuestion(qText);
    setTimeout(() => {
      setLoading(false);
      setQuestionInput('');
    }, 450);
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
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <span className="case-id" style={{ color: 'var(--gold-400)', fontSize: '0.8125rem' }}>
                {matter.id}
              </span>
              <span style={{ color: 'var(--ink-600)' }}>·</span>
              <span className="meta-label on-black" style={{ fontSize: '0.6875rem' }}>
                EVIDENCE QUESTION DESK
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
              AI Investigation
            </h1>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--ink-400)' }}>
              Grounding: {matter.documentCount} Exhibits Ingested
            </span>
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
        {/* ── Left 2/3: Question & Answer Panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Ask Input Bar */}
          <div
            style={{
              background: 'var(--paper-0)',
              border: '1px solid var(--paper-300)',
              borderRadius: '2px',
              padding: '0.875rem 1rem',
              boxShadow: 'var(--shadow-paper-rest)',
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk();
              }}
              style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
            >
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Ask what the documents say…"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: '1rem',
                  color: 'var(--paper-900)',
                  background: 'transparent',
                }}
              />
              <button
                type="submit"
                className="btn btn-primary btn-md"
                disabled={loading || !questionInput.trim()}
              >
                {loading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                Ask Documents
              </button>
            </form>
          </div>

          {/* Suggested Questions (Flat list) */}
          <div style={{ padding: '0 0.25rem' }}>
            <span className="meta-label" style={{ fontSize: '0.6875rem', color: 'var(--paper-500)', display: 'block', marginBottom: '0.5rem' }}>
              SUGGESTED INVESTIGATION PROMPTS
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(q)}
                  style={{
                    background: 'var(--paper-0)',
                    border: '1px solid var(--paper-200)',
                    borderRadius: '2px',
                    padding: '0.5rem 0.75rem',
                    textAlign: 'left',
                    fontSize: '0.8125rem',
                    color: 'var(--paper-700)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'border-color var(--motion-quick), background var(--motion-quick)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gold-500)';
                    e.currentTarget.style.background = 'var(--paper-50)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--paper-200)';
                    e.currentTarget.style.background = 'var(--paper-0)';
                  }}
                >
                  <span>{q}</span>
                  <ArrowRight size={13} style={{ color: 'var(--gold-500)', flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>

          {/* Answer Sheet: White Paper Card */}
          <div
            style={{
              background: 'var(--paper-0)',
              border: '1px solid var(--paper-200)',
              borderRadius: '2px',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-paper-lift)',
              position: 'relative',
            }}
          >
            {/* Header: Question label */}
            <div style={{ borderBottom: '1px solid var(--paper-200)', paddingBottom: '0.875rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                <span className="meta-label" style={{ fontSize: '0.6875rem' }}>
                  ACTIVE INQUIRY
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.6875rem', color: 'var(--paper-500)' }}>
                  Grounded In Evidentiary Record
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '1.1875rem',
                  fontWeight: 500,
                  color: 'var(--paper-900)',
                  margin: 0,
                }}
              >
                {activeQuestion}
              </h2>
            </div>

            {loading ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--paper-500)' }}>
                <RefreshCw size={20} className="animate-spin" style={{ margin: '0 auto 0.75rem auto', color: 'var(--gold-500)' }} />
                <div style={{ fontSize: '0.875rem' }}>Synthesising evidence from matter dossier…</div>
              </div>
            ) : currentResult.status === 'insufficient-evidence' ? (
              /* Insufficient Evidence State */
              <div
                style={{
                  border: '1px solid var(--state-warn-text)',
                  background: 'var(--state-warn-bg)',
                  borderRadius: '2px',
                  padding: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <AlertCircle size={16} style={{ color: 'var(--state-warn-text)' }} />
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono'",
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      color: 'var(--state-warn-text)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Insufficient Evidence
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--paper-900)', margin: '0 0 1.25rem 0' }}>
                  The active matter exhibits do not contain explicit support or recorded references to answer this question. No citations or verified quotes could be grounded.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setQuestionInput(activeQuestion)}
                  >
                    Rephrase question
                  </button>
                  <Link to="/app/upload" className="btn btn-sm btn-primary">
                    Upload evidence
                  </Link>
                </div>
              </div>
            ) : (
              /* Answer Present */
              <div>
                <p
                  style={{
                    fontFamily: "'Source Serif 4', Georgia, serif",
                    fontSize: '1.0625rem',
                    lineHeight: 1.7,
                    color: 'var(--paper-900)',
                    margin: '0 0 1.5rem 0',
                  }}
                >
                  {currentResult.text}
                </p>

                {/* Evidence List */}
                <div style={{ marginTop: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span className="meta-label" style={{ fontSize: '0.6875rem' }}>
                      GROUNDED PASSAGES ({currentResult.evidence.length})
                    </span>
                    <span style={{ fontSize: '0.6875rem', fontFamily: "'IBM Plex Mono'", color: 'var(--paper-500)' }}>
                      VERBATIM RECORD
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {currentResult.evidence.map((ev, i) => (
                      <EvidenceCard
                        key={i}
                        quote={ev.quote}
                        docName={ev.docName}
                        page={ev.page}
                        charStart={ev.charStart}
                        charEnd={ev.charEnd}
                        onOpenDoc={() =>
                          setSelectedCitation({
                            docName: ev.docName,
                            page: ev.page,
                            excerpt: ev.quote,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Verification Strip */}
                {currentResult.verification && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <VerificationStatus
                      status={currentResult.verification.status}
                      checks={currentResult.verification.checks}
                    />
                  </div>
                )}

                {/* Method Line */}
                <div
                  style={{
                    marginTop: '1.25rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--paper-200)',
                    fontFamily: "'IBM Plex Mono'",
                    fontSize: '0.6875rem',
                    color: 'var(--paper-500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>METHOD: {currentResult.method}</span>
                  <span>CONFIDENCE: HIGH</span>
                </div>
              </div>
            )}
          </div>

          {/* Disclaimer */}
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

        {/* ── Right 1/3: Source Peek Panel ── */}
        <div
          style={{
            background: 'var(--paper-0)',
            border: '1px solid var(--paper-200)',
            borderRadius: '2px',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-paper-rest)',
            position: 'sticky',
            top: '5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--paper-200)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={16} style={{ color: 'var(--gold-500)' }} />
              <span className="meta-label" style={{ fontSize: '0.6875rem' }}>
                SOURCE PEEK
              </span>
            </div>
            <Link
              to={`/app/documents/${selectedCitation.docName}`}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.6875rem', padding: '0.2rem 0.5rem' }}
            >
              Full Doc ↗
            </Link>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <SourceCitation docName={selectedCitation.docName} page={selectedCitation.page} />
          </div>

          {/* Simulated Document Preview Page */}
          <div
            style={{
              background: 'var(--paper-50)',
              border: '1px solid var(--paper-300)',
              borderRadius: '2px',
              padding: '1rem',
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '0.8125rem',
              lineHeight: 1.6,
              color: 'var(--paper-700)',
              position: 'relative',
            }}
          >
            <div
              style={{
                fontSize: '0.625rem',
                fontFamily: "'IBM Plex Mono'",
                color: 'var(--paper-400)',
                textTransform: 'uppercase',
                borderBottom: '1px solid var(--paper-200)',
                paddingBottom: '0.375rem',
                marginBottom: '0.75rem',
              }}
            >
              Exemplar Leaf · Page {selectedCitation.page}
            </div>

            <p style={{ margin: '0 0 0.5rem 0', opacity: 0.6 }}>
              In the Court of the Chief Metropolitan Magistrate, Patiala House Courts, New Delhi. Criminal Complaint under Section 138 of the Negotiable Instruments Act, 1881.
            </p>

            <mark
              style={{
                backgroundColor: 'rgba(239, 230, 208, 0.95)',
                color: 'var(--paper-900)',
                padding: '0.125rem 0.25rem',
                borderRadius: '1px',
                borderLeft: '2px solid var(--gold-500)',
                display: 'block',
                margin: '0.5rem 0',
              }}
            >
              {selectedCitation.excerpt}
            </mark>

            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.6 }}>
              That the complainant repeatedly called upon the accused to make good the dishonoured amount, but the accused failed and neglected to tender the payment within the statutory fifteen days…
            </p>
          </div>

          <div style={{ marginTop: '1rem', fontSize: '0.6875rem', color: 'var(--paper-500)', textAlign: 'center' }}>
            All source extractions are indexed with character-exact offsets.
          </div>
        </div>
      </div>
    </div>
  );
}
