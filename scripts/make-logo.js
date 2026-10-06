// Builds the AURA360LAB logo set. The full logo ("ΛURΛ" + ring over "L A B")
// is the path traced from the studio's artwork in components/logo-path.json;
// the app icon is a Λ + ring monogram drawn from the geometry below.
// Writes SVGs + PNG renders.
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

const LOGO = require("../components/logo-path.json");

// Open ring (the "360°"): a circle with a gap facing down-left.
const ring = (cx, cy, r) => {
  const rad = (d) => (d * Math.PI) / 180;
  const a0 = 250, a1 = a0 + 290; // 70° gap centred on 215°
  const p = (a) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))].map((n) => n.toFixed(2));
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0} ${y0} A${r} ${r} 0 1 1 ${x1} ${y1}`;
};

const wordmark = (color, { title = "AURA360LAB" } = {}) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO.viewBox}" role="img" aria-label="${title}">
  <title>${title}</title>
  <path fill="${color}" fill-rule="evenodd" d="${LOGO.d}"/>
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
