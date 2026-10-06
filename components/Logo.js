import logo from "@/components/logo-path.json";

// AURA360LAB logo ("ΛURΛ" + the open 360° ring over "L A B"), traced from the
// studio's artwork and drawn inline so it takes the surrounding text colour
// (currentColor). Same path as public/brand/*.svg — regenerate both with
// scripts/make-logo.js.
export default function Logo({ className = "", title = "AURA360LAB" }) {
  return (
    <svg viewBox={logo.viewBox} role="img" aria-label={title} className={className} fill="currentColor">
      <title>{title}</title>
      <path fillRule="evenodd" d={logo.d} />
    </svg>
  );
}
