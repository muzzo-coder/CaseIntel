/**
 * DemoTag — shows "DEMO" label on mock-data driven screens
 */
export default function DemoTag({ className = '' }) {
  return (
    <span className={`demo-tag ${className}`} role="note" aria-label="Demo data — not real results">
      DEMO
    </span>
  );
}
