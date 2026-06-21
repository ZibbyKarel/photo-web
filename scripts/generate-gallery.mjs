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
 *        gallery-source/family/
 *        gallery-source/weddings-events/
 *        gallery-source/commercial/
 *        gallery-source/drone/
 *        gallery-source/other/
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
    slug: "family",
    altPrefix: "Family photography in Plzeň",
  },
  {
    slug: "weddings-events",
    altPrefix: "Wedding and event in Plzeň",
  },
  {
    slug: "commercial",
    altPrefix: "Commercial and product photography in Plzeň",
  },
  {
    slug: "drone",
    altPrefix: "Aerial drone shot — Plzeň region",
  },
  {
    slug: "other",
    altPrefix: "Photography — Plzeň & surroundings",
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
  family: [
    { r: 74, g: 50, b: 38 }, // deep umber
    { r: 92, g: 65, b: 45 }, // warm brown
    { r: 110, g: 80, b: 55 }, // sienna
    { r: 130, g: 95, b: 65 }, // ochre-brown
    { r: 85, g: 58, b: 40 }, // dark sienna
    { r: 100, g: 72, b: 50 }, // mid brown
    { r: 120, g: 88, b: 60 }, // warm tan
    { r: 95, g: 68, b: 48 }, // earthy
  ],
  "weddings-events": [
    { r: 220, g: 210, b: 195 }, // light cream
    { r: 210, g: 198, b: 182 }, // warm ivory
    { r: 225, g: 215, b: 200 }, // soft linen
    { r: 205, g: 193, b: 178 }, // warm beige
    { r: 215, g: 205, b: 190 }, // pale sand
    { r: 230, g: 218, b: 204 }, // bridal white-warm
    { r: 200, g: 190, b: 175 }, // antique linen
    { r: 218, g: 208, b: 193 }, // champagne
  ],
  other: [
    { r: 160, g: 100, b: 55 }, // warm amber
    { r: 175, g: 115, b: 65 }, // golden ochre
    { r: 145, g: 90, b: 48 }, // dark amber
    { r: 190, g: 130, b: 75 }, // honey
    { r: 155, g: 95, b: 52 }, // bronze
    { r: 170, g: 110, b: 60 }, // warm copper
    { r: 140, g: 85, b: 45 }, // deep ochre
    { r: 180, g: 120, b: 68 }, // golden brown
  ],
  commercial: [
    { r: 40, g: 44, b: 52 }, // graphite
    { r: 55, g: 60, b: 70 }, // slate
    { r: 70, g: 76, b: 88 }, // cool grey
    { r: 48, g: 52, b: 62 }, // dark steel
    { r: 62, g: 68, b: 80 }, // pewter
    { r: 80, g: 86, b: 98 }, // light slate
    { r: 36, g: 40, b: 48 }, // charcoal
    { r: 74, g: 80, b: 92 }, // muted steel
  ],
  drone: [
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

      // Build a descriptive alt text (kept in English; alt is not shown visually)
      const altDescriptions = {
        family: [
          "Family on a trip together",
          "Family portrait outdoors",
          "Children's laughter and joy",
          "A family embrace and the warmth of home",
          "A spontaneous family moment",
          "Portraits in natural light",
          "A family walk through Plzeň",
          "Precious moments of family life",
        ],
        "weddings-events": [
          "The wedding couple embracing",
          "Close-up of the wedding rings",
          "The bride before the ceremony",
          "The newlyweds' first dance",
          "Wedding guests and emotion",
          "A celebration in full swing",
          "A social event and its mood",
          "Group photo from the event",
        ],
        other: [
          "A photo from free creative work",
          "Detail and atmosphere of a moment",
          "A portrait in natural light",
          "A reportage moment",
          "Composition and play of light",
          "A moment captured outside the studio",
          "A shot from the surroundings",
          "An authentic moment",
        ],
        commercial: [
          "Product shot in the studio",
          "A storefront and business interior",
          "Detail of a product on a clean background",
          "Branded product styling",
          "Business portrait of a shop owner",
          "Food and menu photography",
          "Interior of a shop or provozovna",
          "A commercial detail for marketing",
        ],
        drone: [
          "Aerial view of Plzeň",
          "The Plzeň landscape from a bird's-eye view",
          "Aerial shot of an outdoor event",
          "Drone view of the venue",
          "Aerial shot of Plzeň-region nature",
          "Aerial panorama of the city",
          "Drone over the landscape at dusk",
          "Aerial detail of an architectural landmark",
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

  // Bust the Next.js image-optimizer cache. Photos are re-generated under the
  // same filenames, so without this the optimizer (and the browser) can keep
  // serving stale thumbnails — the placeholder shows while the full image is
  // correct. Removing the cache forces a fresh optimize on next request.
  try {
    await fs.rm(path.join(ROOT, ".next", "cache", "images"), { recursive: true, force: true });
    console.log("Cleared .next/cache/images — restart dev server + hard-refresh the browser.");
  } catch {
    /* no .next yet — nothing to clear */
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
