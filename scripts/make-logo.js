// Builds the AURA360LAB logo set from one geometry: a monoline "ΛURΛ" wordmark
// (crossbar-less A, open-bowl R, rounded ends) with the open "360°" ring,
// redrawn from the studio's printed logo. Writes SVGs + PNG renders.
//
// Usage (renderer is not a project dependency):
//   npm i --no-save @resvg/resvg-js
//   node scripts/make-logo.js public/brand <preview-dir>
// then copy public/brand/aura360lab-icon.svg -> app/icon.svg and
// public/brand/apple-icon-180.png -> app/apple-icon.png.
const fs = require("fs");
const path = require("path");
const { Resvg } = require("@resvg/resvg-js");

const OUT = process.argv[2];
const PREVIEW = process.argv[3];
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(PREVIEW, { recursive: true });

const INK = "#161615";
const BONE = "#F5F5F3";

// ---- glyphs (cap height 100, origin top-left) ----------------------------
const A = (x) => `M${x} 100 L${x + 42} 0 L${x + 84} 100`;
const U = (x) => `M${x} 0 V70 A30 30 0 0 0 ${x + 60} 70 V0`;
const R = (x) =>
  `M${x} 100 V0 M${x} 0 H${x + 22} A24 24 0 0 1 ${x + 22} 48 M${x + 27} 58 L${x + 55} 100`;
// Open ring (the "360°"): a circle with a gap facing down-left.
const ring = (cx, cy, r) => {
  const rad = (d) => (d * Math.PI) / 180;
  const a0 = 250, a1 = a0 + 290; // 70° gap centred on 215°
  const p = (a) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))].map((n) => n.toFixed(2));
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0} ${y0} A${r} ${r} 0 1 1 ${x1} ${y1}`;
};

const WORD = [A(0), U(110), R(196), A(272)].join(" ");
const RING = ring(374, 12, 10);
const SW = 6;

const wordmark = (color, { title = "AURA360LAB" } = {}) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 400 116" role="img" aria-label="${title}">
  <title>${title}</title>
  <g fill="none" stroke="${color}" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round">
    <path d="${WORD}"/>
    <path d="${RING}" stroke-width="${SW * 0.8}"/>
  </g>
</svg>
`;

// App icon: the Λ + ring monogram on an ink tile (512 grid).
const icon = ({ bg = INK, fg = BONE, rounded = true } = {}) => {
  // Λ 230 tall, centred slightly left so the ring balances it.
  const s = 2.3, ox = 256 - 42 * s - 14, oy = 256 - 50 * s + 6;
  const a = `M${ox} ${oy + 100 * s} L${ox + 42 * s} ${oy} L${ox + 84 * s} ${oy + 100 * s}`;
  const rg = ring(ox + 84 * s + 22, oy + 18, 24);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="AURA360LAB">
  <rect width="512" height="512" ${rounded ? 'rx="112"' : ""} fill="${bg}"/>
  <g fill="none" stroke="${fg}" stroke-linecap="round" stroke-linejoin="round">
    <path d="${a}" stroke-width="26"/>
    <path d="${rg}" stroke-width="20"/>
  </g>
</svg>
`;
};

const files = {
  "aura360lab-logo-dark.svg": wordmark(INK),
  "aura360lab-logo-light.svg": wordmark(BONE),
  "aura360lab-icon.svg": icon(),
  "aura360lab-icon-square.svg": icon({ rounded: false }),
};
for (const [name, svg] of Object.entries(files)) fs.writeFileSync(path.join(OUT, name), svg);

const png = (svg, width, file, background) => {
  const r = new Resvg(svg, { fitTo: { mode: "width", value: width }, background });
  fs.writeFileSync(file, r.render().asPng());
};
// PNGs for apps/social + previews.
png(files["aura360lab-logo-dark.svg"], 2000, path.join(OUT, "aura360lab-logo-dark.png"));
png(files["aura360lab-logo-light.svg"], 2000, path.join(OUT, "aura360lab-logo-light.png"));
png(files["aura360lab-icon.svg"], 512, path.join(OUT, "aura360lab-icon-512.png"));
png(files["aura360lab-icon-square.svg"], 180, path.join(OUT, "apple-icon-180.png"));
png(files["aura360lab-icon.svg"], 192, path.join(OUT, "aura360lab-icon-192.png"));
png(files["aura360lab-icon.svg"], 32, path.join(PREVIEW, "icon-32.png"));
png(files["aura360lab-icon.svg"], 16, path.join(PREVIEW, "icon-16.png"));
png(files["aura360lab-logo-dark.svg"], 900, path.join(PREVIEW, "logo-on-bone.png"), BONE);
png(files["aura360lab-logo-light.svg"], 900, path.join(PREVIEW, "logo-on-ink.png"), INK);
console.log(fs.readdirSync(OUT).join("\n"));
