// Generates the social-share image (Open Graph / Twitter / SMS link preview)
// at public/og-image.png — 1200×630, the de-facto OG card size.
//
// Composition: brand monogram logo over the warm near-black background, with
// the photographer's name + a small accent line. Intentionally minimal — link
// previews are tiny, so just the logo and name read cleanly.
//
// Run with `npm run og`. The output PNG is committed; this script only needs to
// be re-run when the logo or brand wording changes. The Fraunces font (matching
// the site's serif headings) is bundled at scripts/assets/ so the result is
// reproducible without a network fetch or a system font install.

import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// Brand tokens — kept in sync with src/app/globals.css @theme.
const BG = "#0e0d0b";
const FOREGROUND = "#ede7db";
const ACCENT = "#c2724e";

const NAME = "Karel Zíbar";
const TAGLINE = "FOTOGRAF · PLZEŇ";

const W = 1200;
const H = 630;
const LOGO_SIZE = 300;

const fontData = readFileSync(resolve(__dirname, "assets/Fraunces-600.ttf")).toString("base64");

// Vertically-centered stack: logo, name, accent tagline.
const logoTop = 92;
const nameBaseline = logoTop + LOGO_SIZE + 92; // baseline below the logo
const taglineBaseline = nameBaseline + 50;

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'Fraunces';
        src: url(data:font/ttf;base64,${fontData}) format('truetype');
        font-weight: 600;
      }
      .name { font-family: 'Fraunces', serif; font-weight: 600; font-size: 82px; letter-spacing: -1px; fill: ${FOREGROUND}; }
      .tagline { font-family: 'Fraunces', serif; font-weight: 600; font-size: 26px; letter-spacing: 7px; fill: ${ACCENT}; }
    </style>
    <radialGradient id="glow" cx="50%" cy="34%" r="60%">
      <stop offset="0%" stop-color="#1c1813" />
      <stop offset="100%" stop-color="${BG}" />
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#glow)" />
  <text x="${W / 2}" y="${nameBaseline}" text-anchor="middle" class="name">${NAME}</text>
  <text x="${W / 2}" y="${taglineBaseline}" text-anchor="middle" class="tagline">${TAGLINE}</text>
</svg>`;

const logo = await sharp(resolve(root, "public/logo.png"))
  .resize(LOGO_SIZE, LOGO_SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toBuffer();

await sharp(Buffer.from(svg))
  .composite([{ input: logo, top: logoTop, left: Math.round((W - LOGO_SIZE) / 2) }])
  .png()
  .toFile(resolve(root, "public/og-image.png"));

console.log("✓ public/og-image.png (1200×630)");
