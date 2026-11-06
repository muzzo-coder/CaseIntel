/**
 * Mock data for CaseIntel MVP
 * All outputs marked _demo: true
 * UI must show DEMO tag on any screen using this data
 */

export const MOCK_MATTER = {
  _demo: true,
  id: 'CI-2026-0042',
  title: 'Sharma v. Regional Bank of Delhi',
  jurisdiction: 'Delhi High Court',
  status: 'active',
  lastAnalysis: '2026-11-03T08:42:00Z',
  documentCount: 4,
  entityCount: 23,
  eventCount: 18,
  findingCount: 5,
  verifiedCount: 2,
  awaitingReviewCount: 3,
};

export const MOCK_MATTERS = [
  { _demo: true, id: 'CI-2026-0042', title: 'Sharma v. Regional Bank of Delhi', documents: 4, status: 'active', findings: 5, updatedAt: '2026-11-03' },
  { _demo: true, id: 'CI-2026-0038', title: 'Patel Property Dispute', documents: 7, status: 'analysis-complete', findings: 12, updatedAt: '2026-11-01' },
  { _demo: true, id: 'CI-2026-0031', title: 'Kumar v. Insurance Co.', documents: 3, status: 'review', findings: 3, updatedAt: '2026-10-28' },
];

export const MOCK_DOCUMENTS = [
  { _demo: true, id: 'DOC-001', name: 'Complaint.pdf', type: 'Complaint', pages: 12, status: 'analyzed', uploaded: '2026-11-01', mimeType: 'application/pdf' },
  { _demo: true, id: 'DOC-002', name: 'Witness_Statement_A.pdf', type: 'Statement', pages: 8, status: 'analyzed', uploaded: '2026-11-01', mimeType: 'application/pdf' },
  { _demo: true, id: 'DOC-003', name: 'Incident_Report.pdf', type: 'Report', pages: 5, status: 'analyzed', uploaded: '2026-11-02', mimeType: 'application/pdf' },
  { _demo: true, id: 'DOC-004', name: 'Follow_up_Report.docx', type: 'Report', pages: 3, status: 'ocr-applied', uploaded: '2026-11-02', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
];

export const MOCK_ENTITIES = [
  { _demo: true, id: 'ENT-001', type: 'Person', value: 'Rajesh Sharma', count: 14 },
  { _demo: true, id: 'ENT-002', type: 'Organization', value: 'Regional Bank of Delhi', count: 9 },
  { _demo: true, id: 'ENT-003', type: 'Person', value: 'Priya Mehta', count: 6 },
  { _demo: true, id: 'ENT-004', type: 'Date', value: '12 March 2024', count: 3 },
  { _demo: true, id: 'ENT-005', type: 'Date', value: '14 March 2024', count: 2 },
  { _demo: true, id: 'ENT-006', type: 'Amount', value: '₹2,40,000', count: 4 },
  { _demo: true, id: 'ENT-007', type: 'Amount', value: '₹2,50,000', count: 2 },
  { _demo: true, id: 'ENT-008', type: 'Location', value: 'Connaught Place Branch', count: 5 },
  { _demo: true, id: 'ENT-009', type: 'Section', value: 'Section 138 NI Act', count: 3 },
  { _demo: true, id: 'ENT-010', type: 'Case/FIR', value: 'FIR No. 204/2024', count: 2 },
];

export const MOCK_EVENTS = [
  { _demo: true, id: 'EV-001', date: '2024-03-12', dateRaw: '12/3/24', description: 'Cheque issued by Rajesh Sharma to Regional Bank of Delhi', actors: ['Rajesh Sharma', 'Regional Bank of Delhi'], sourceDoc: 'Complaint.pdf', sourcePage: 2 },
  { _demo: true, id: 'EV-002', date: '2024-03-14', dateRaw: '14 March 2024', description: 'Cheque dishonoured due to insufficient funds', actors: ['Regional Bank of Delhi'], sourceDoc: 'Incident_Report.pdf', sourcePage: 1 },
  { _demo: true, id: 'EV-003', date: '2024-03-20', dateRaw: '20-03-2024', description: 'Legal notice issued under Section 138 NI Act', actors: ['Rajesh Sharma'], sourceDoc: 'Complaint.pdf', sourcePage: 4 },
  { _demo: true, id: 'EV-004', date: '2024-04-05', dateRaw: 'April 5, 2024', description: 'Witness Priya Mehta submitted statement', actors: ['Priya Mehta'], sourceDoc: 'Witness_Statement_A.pdf', sourcePage: 1 },
];

export const MOCK_FINDINGS = [
  {
    _demo: true,
    id: 'FN-0042-001',
    type: 'date-mismatch',
    status: 'likely',
    method: 'rule-based date comparison',
    score: 0.82,
    summary: 'Cheque issuance date differs between Complaint and Incident Report.',
    docA: { name: 'Complaint.pdf', page: 2, excerpt: 'on 12 March 2024' },
    docB: { name: 'Incident_Report.pdf', page: 1, excerpt: 'on 14 March 2024' },
    explanation: 'The complaint states the cheque was issued on 12 March 2024, while the incident report references 14 March 2024 for the same event. This difference may arise from different reference points or a transcription error.',
    verification: { quoteFound: true, supportsFindig: true, verdict: 'verified' },
    review: { status: null },
  },
  {
    _demo: true,
    id: 'FN-0042-002',
    type: 'amount-mismatch',
    status: 'possible',
    method: 'rule-based amount comparison',
    score: 0.64,
    summary: 'Cheque amount differs between Complaint (₹2,40,000) and Follow-up Report (₹2,50,000).',
    docA: { name: 'Complaint.pdf', page: 3, excerpt: 'a sum of ₹2,40,000' },
    docB: { name: 'Follow_up_Report.docx', page: 1, excerpt: 'amount of ₹2,50,000' },
    explanation: 'Discrepancy in the cheque amount across two documents. Could be a typographical error or reference to a different transaction.',
    verification: { quoteFound: true, supportsFindig: null, verdict: 'partial' },
    review: { status: null },
  },
  {
    _demo: true,
    id: 'FN-0042-003',
    type: 'entity-mismatch',
    status: 'possible',
    method: 'embedding',
    score: 0.57,
    summary: 'Bank branch name differs across documents.',
    docA: { name: 'Complaint.pdf', page: 1, excerpt: 'Connaught Place Branch' },
    docB: { name: 'Incident_Report.pdf', page: 1, excerpt: 'CP Branch, New Delhi' },
    explanation: 'Two documents refer to the branch by different names. Auto-resolution merged these as the same entity; this match should be reviewed.',
    verification: { quoteFound: null, supportsFindig: null, verdict: 'unverified' },
    review: { status: null },
  },
];

export const MOCK_PIPELINE = [
  { number: 1, name: 'EXTRACT', purpose: 'Text extraction (+ OCR fallback)', status: 'complete', count: '4 documents', elapsed: '1.2s' },
  { number: 2, name: 'ENTITIES', purpose: 'People, orgs, locations, dates, amounts, sections, case/FIR numbers', status: 'complete', count: '23 entities', elapsed: '3.4s' },
  { number: 3, name: 'EVENTS', purpose: 'Events and claims, grounded to spans', status: 'complete', count: '18 events', elapsed: '4.1s' },
  { number: 4, name: 'RESOLVE', purpose: 'Merge aliases, normalise dates/amounts, build timeline', status: 'complete', count: '4 merges', elapsed: '2.8s' },
  { number: 5, name: 'DETECT', purpose: 'Cross-document inconsistency candidates', status: 'complete', count: '5 findings', elapsed: '6.2s' },
  { number: 6, name: 'VERIFY', purpose: 'Evidence checks (quote found, supports finding)', status: 'complete', count: '2 verified', elapsed: '8.9s' },
];

export const MOCK_CONVERSATIONS = [
  {
    _demo: true,
    id: 'QA-001',
    question: 'What date did Rajesh Sharma issue the cheque?',
    status: 'answered',
    answeredAt: '2026-11-03T10:15:00Z',
    citations: [{ docName: 'Complaint.pdf', page: 2 }],
  },
  {
    _demo: true,
    id: 'QA-002',
    question: 'Who was the witness for the dishonour event?',
    status: 'answered',
    answeredAt: '2026-11-03T10:20:00Z',
    citations: [{ docName: 'Witness_Statement_A.pdf', page: 1 }],
  },
  {
    _demo: true,
    id: 'QA-003',
    question: 'What section of the NI Act was invoked?',
    status: 'insufficient-evidence',
    answeredAt: '2026-11-03T10:25:00Z',
    citations: [],
  },
];

export const MOCK_EVALUATION = {
  _demo: true,
  retrieval: { recall: 'TBD', mrr: 'TBD', ndcg10: 'TBD', latencyP50: 'TBD', latencyP95: 'TBD' },
  extraction: { precision: 'TBD', recall: 'TBD', f1: 'TBD', dateNorm: 'TBD', eventGrounding: 'TBD' },
  detection: { precision: 'TBD', recall: 'TBD', f1: 'TBD', fpRate: 'TBD', costPerMatter: 'TBD', latency: 'TBD' },
  verification: { unsupportedRate: 'TBD', citationCorrectness: 'TBD', sourceAttribution: 'TBD' },
};
