/**
 * generate-gallery.mjs
 *
 * Generates gallery images and a typed manifest for the photo-web project.
 *
 * Usage:
 *   npm run gallery
 *
 * To use REAL photos:
 *   1. Place your source images (JPG/JPEG/PNG) into:
 *        gallery-source/rodina/
 *        gallery-source/svatby/
 *        gallery-source/udalosti/
 *        gallery-source/dron/
 *   2. Run: npm run gallery
 *   The script resizes them (max 2000px wide, quality 80) and writes them to
 *   public/gallery/<category>/, then regenerates the manifest.
 *
 * When no source files exist for a category, 8 tonally-warm placeholder images
 * are generated (different aspect ratios to simulate a realistic masonry grid).
 *
 * The script is idempotent — re-running it overwrites previous output.
 */

import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const CATEGORIES = [
  {
    slug: "rodina",
    altPrefix: "Rodinné focení v Plzni",
  },
  {
    slug: "svatby",
    altPrefix: "Svatební fotografie v Plzni",
  },
  {
    slug: "udalosti",
    altPrefix: "Focení události v Plzni",
  },
  {
    slug: "dron",
    altPrefix: "Letecký snímek z dronu — Plzeňsko",
  },
];

// Aspect ratios for placeholder images — mix portrait/landscape/square
// Format: [width, height]
const PLACEHOLDER_ASPECTS = [
  [800, 1000], // portrait 4/5
  [800, 1200], // portrait 2/3
  [1200, 800], // landscape 3/2
  [1600, 900], // landscape 16/9
  [900, 900], // square
  [800, 1000], // portrait 4/5
  [1200, 800], // landscape 3/2
  [800, 1200], // portrait 2/3
];

// Tonally-rich background colors per category
const PLACEHOLDER_COLORS = {
  rodina: [
    { r: 74, g: 50, b: 38 }, // deep umber
    { r: 92, g: 65, b: 45 }, // warm brown
    { r: 110, g: 80, b: 55 }, // sienna
    { r: 130, g: 95, b: 65 }, // ochre-brown
    { r: 85, g: 58, b: 40 }, // dark sienna
    { r: 100, g: 72, b: 50 }, // mid brown
    { r: 120, g: 88, b: 60 }, // warm tan
    { r: 95, g: 68, b: 48 }, // earthy
  ],
  svatby: [
    { r: 220, g: 210, b: 195 }, // light cream
    { r: 210, g: 198, b: 182 }, // warm ivory
    { r: 225, g: 215, b: 200 }, // soft linen
    { r: 205, g: 193, b: 178 }, // warm beige
    { r: 215, g: 205, b: 190 }, // pale sand
    { r: 230, g: 218, b: 204 }, // bridal white-warm
    { r: 200, g: 190, b: 175 }, // antique linen
    { r: 218, g: 208, b: 193 }, // champagne
  ],
  udalosti: [
    { r: 160, g: 100, b: 55 }, // warm amber
    { r: 175, g: 115, b: 65 }, // golden ochre
    { r: 145, g: 90, b: 48 }, // dark amber
    { r: 190, g: 130, b: 75 }, // honey
    { r: 155, g: 95, b: 52 }, // bronze
    { r: 170, g: 110, b: 60 }, // warm copper
    { r: 140, g: 85, b: 45 }, // deep ochre
    { r: 180, g: 120, b: 68 }, // golden brown
  ],
  dron: [
    { r: 38, g: 85, b: 105 }, // aerial teal
    { r: 45, g: 95, b: 118 }, // sky blue
    { r: 32, g: 75, b: 95 }, // deep aerial
    { r: 52, g: 105, b: 128 }, // light sky
    { r: 40, g: 90, b: 110 }, // mid teal
    { r: 30, g: 68, b: 88 }, // dark teal
    { r: 58, g: 112, b: 135 }, // bright aerial
    { r: 35, g: 80, b: 100 }, // ocean-sky
  ],
};

/**
 * Generates a simple tonally-warm placeholder JPEG buffer using sharp.
 * Adds a subtle radial gradient effect via compositing.
 */
async function generatePlaceholder(width, height, color) {
  // Create a solid base color image
  const { r, g, b } = color;

  // Create slight highlight in center for depth
  const highlightR = Math.min(255, r + 20);
  const highlightG = Math.min(255, g + 20);
  const highlightB = Math.min(255, b + 20);

  // Build a simple gradient by compositing a lighter center circle
  const baseImage = sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r, g, b },
    },
  });

  // Create a highlight overlay (radial-ish via a blurred white dot)
  const dotSize = Math.floor(Math.min(width, height) * 0.6);
  const dotX = Math.floor(width / 2 - dotSize / 2);
  const dotY = Math.floor(height / 2 - dotSize / 2);

  const highlightOverlay = await sharp({
    create: {
      width: dotSize,
      height: dotSize,
      channels: 4,
      background: { r: highlightR, g: highlightG, b: highlightB, alpha: 60 },
    },
  })
    .blur(dotSize * 0.35)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const buffer = await baseImage
    .composite([
      {
        input: await sharp(highlightOverlay.data, {
          raw: {
            width: highlightOverlay.info.width,
            height: highlightOverlay.info.height,
            channels: 4,
          },
        })
          .jpeg()
          .toBuffer(),
        top: dotY,
        left: dotX,
        blend: "over",
      },
    ])
    .jpeg({ quality: 85 })
    .toBuffer();

  return buffer;
}

/**
 * Generates a tiny blur placeholder as base64 data URL.
 * The 16px-wide thumbnail is embedded directly in the manifest.
 */
async function generateBlurDataURL(imageBuffer) {
  const blurBuffer = await sharp(imageBuffer).resize(16).jpeg({ quality: 60 }).toBuffer();

  return `data:image/jpeg;base64,${blurBuffer.toString("base64")}`;
}

/**
 * Checks if source files exist in gallery-source/<slug>/
 */
async function getSourceFiles(slug) {
  const sourceDir = path.join(ROOT, "gallery-source", slug);
  try {
    const entries = await fs.readdir(sourceDir);
    const imageFiles = entries
      .filter((f) => /\.(jpg|jpeg|png)$/i.test(f))
      .map((f) => path.join(sourceDir, f));
    return imageFiles;
  } catch {
    return [];
  }
}

/**
 * Processes a real source image: resizes to max 2000px wide, quality 80.
 * Returns { buffer, width, height }.
 */
async function processSourceImage(srcPath) {
  const pipeline = sharp(srcPath).resize({ width: 2000, withoutEnlargement: true });
  const buffer = await pipeline.jpeg({ quality: 80 }).toBuffer();
  const metadata = await sharp(buffer).metadata();
  return { buffer, width: metadata.width, height: metadata.height };
}

async function main() {
  const manifestEntries = [];

  for (const cat of CATEGORIES) {
    const { slug, altPrefix } = cat;
    const outDir = path.join(ROOT, "public", "gallery", slug);
    await fs.mkdir(outDir, { recursive: true });

    const sourceFiles = await getSourceFiles(slug);
    const hasRealPhotos = sourceFiles.length > 0;

    if (hasRealPhotos) {
      console.log(`[${slug}] Processing ${sourceFiles.length} real source image(s)…`);
    } else {
      console.log(`[${slug}] No source images found — generating 8 placeholders…`);
    }

    const images = [];

    if (hasRealPhotos) {
      for (let i = 0; i < sourceFiles.length; i++) {
        const srcPath = sourceFiles[i];
        const { buffer, width, height } = await processSourceImage(srcPath);
        images.push({ buffer, width, height, index: i + 1 });
      }
    } else {
      const colors = PLACEHOLDER_COLORS[slug];
      for (let i = 0; i < 8; i++) {
        const [w, h] = PLACEHOLDER_ASPECTS[i];
        const color = colors[i];
        const buffer = await generatePlaceholder(w, h, color);
        images.push({ buffer, width: w, height: h, index: i + 1 });
      }
    }

    for (const { buffer, width, height, index } of images) {
      const filename = `${slug}-${String(index).padStart(2, "0")}.jpg`;
      const outPath = path.join(outDir, filename);
      await fs.writeFile(outPath, buffer);

      const blurDataURL = await generateBlurDataURL(buffer);

      // Build a descriptive Czech alt text
      const altDescriptions = {
        rodina: [
          "Rodina při společném výletu",
          "Rodinný portrét venku",
          "Dětský smích a radost",
          "Rodinné objetí a teplo domova",
          "Spontánní rodinný moment",
          "Portréty v přirozeném světle",
          "Rodinná procházka Plzní",
          "Vzácné okamžiky rodinného života",
        ],
        svatby: [
          "Svatební pár v objetí",
          "Detail svatebních prstenů",
          "Nevěsta před obřadem",
          "První tanec novomanželů",
          "Svatební hosté a emoce",
          "Romantický moment novomanželů",
          "Výzdoba svatebního stolu",
          "Skupinové foto na svatbě",
        ],
        udalosti: [
          "Oslava narozenin v plném proudu",
          "Křtiny — první rodinná fotka",
          "Firemní akce a společná nálada",
          "Reportáž z rodinné oslavy",
          "Spontánní moment společenské akce",
          "Detaily výzdoby a prostředí akce",
          "Skupinové foto na oslavě",
          "Radostné okamžiky ze slavnostní události",
        ],
        dron: [
          "Letecký pohled na Plzeň",
          "Krajina Plzeňska z ptačí perspektivy",
          "Letecký snímek venkovní akce",
          "Drone pohled na místo konání",
          "Vzdušný záběr přírody Plzeňska",
          "Letecká panorama města",
          "Dron nad krajinou za soumraku",
          "Letecký detail architektonické dominanty",
        ],
      };

      const descriptions = altDescriptions[slug];
      const alt = `${altPrefix} — ${descriptions[(index - 1) % descriptions.length]}`;

      manifestEntries.push({
        category: slug,
        src: `/gallery/${slug}/${filename}`,
        width,
        height,
        alt,
        blurDataURL,
      });

      console.log(`  ✓ ${filename} (${width}×${height})`);
    }
  }

  // Write the typed manifest
  const manifestPath = path.join(ROOT, "src", "lib", "gallery.generated.ts");
  const manifestContent = `/**
 * AUTO-GENERATED — do not edit manually.
 * Run \`npm run gallery\` to regenerate from gallery-source/<category>/ files
 * or to refresh placeholder images.
 *
 * To use real photos:
 *   1. Place JPG/JPEG/PNG files in gallery-source/<category>/
 *   2. Run: npm run gallery
 */

export type GalleryPhotoRaw = {
  category: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL: string;
};

export const galleryPhotos = ${JSON.stringify(manifestEntries, null, 2)} as const satisfies GalleryPhotoRaw[];
`;

  await fs.writeFile(manifestPath, manifestContent, "utf8");
  console.log(
    `\nManifest written to src/lib/gallery.generated.ts (${manifestEntries.length} photos total)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
