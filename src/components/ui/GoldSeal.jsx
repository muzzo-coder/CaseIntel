/* GoldSeal — original CI mark: double ring + balance-and-folio glyph */
export default function GoldSeal({ size = 24, className = '' }) {
  const r1 = size / 2 - 1;
  const r2 = size / 2 - 3.5;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r1} stroke="var(--gold-500)" strokeWidth="0.8" />
      {/* Inner ring */}
      <circle cx={cx} cy={cy} r={r2} stroke="var(--gold-500)" strokeWidth="0.5" />
      {/* Balance beam */}
      <line
        x1={cx - size * 0.22}
        y1={cy}
        x2={cx + size * 0.22}
        y2={cy}
        stroke="var(--gold-500)"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      {/* Left pan */}
      <path
        d={`M ${cx - size * 0.22} ${cy} l -${size * 0.07} ${size * 0.1}`}
        stroke="var(--gold-500)"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
      {/* Right pan */}
      <path
        d={`M ${cx + size * 0.22} ${cy} l ${size * 0.07} ${size * 0.1}`}
        stroke="var(--gold-500)"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
      {/* Centre post */}
      <line
        x1={cx}
        y1={cy - size * 0.14}
        x2={cx}
        y2={cy + size * 0.06}
        stroke="var(--gold-500)"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
      {/* Folio base */}
      <rect
        x={cx - size * 0.1}
        y={cy + size * 0.06}
        width={size * 0.2}
        height={size * 0.08}
        rx="0.5"
        stroke="var(--gold-500)"
        strokeWidth="0.6"
        fill="none"
      />
      {/* CI letters */}
      <text
        x={cx}
        y={cy + size * 0.38}
        textAnchor="middle"
        fontSize={size * 0.18}
        fontFamily="'IBM Plex Mono', ui-monospace"
        fontWeight="500"
        letterSpacing="0.08em"
        fill="var(--gold-500)"
      >
        CI
      </text>
    </svg>
  );
}
