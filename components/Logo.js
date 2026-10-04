// AURA360LAB wordmark ("ΛURΛ" + the open 360° ring), drawn inline so it takes
// the surrounding text colour (currentColor). Same geometry as
// public/brand/*.svg — regenerate both with scripts/make-logo.js.
export default function Logo({ className = "", title = "AURA360LAB" }) {
  return (
    <svg
      viewBox="-8 -8 400 116"
      role="img"
      aria-label={title}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>{title}</title>
      <path d="M0 100 L42 0 L84 100 M110 0 V70 A30 30 0 0 0 170 70 V0 M196 100 V0 M196 0 H218 A24 24 0 0 1 218 48 M223 58 L251 100 M272 100 L314 0 L356 100" />
      <path d="M370.58 2.60 A10 10 0 1 1 364.00 12.00" strokeWidth="4.8" />
    </svg>
  );
}
