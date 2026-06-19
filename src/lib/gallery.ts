/**
 * Gallery data layer — hand-written, imports the generated manifest.
 *
 * Edit category metadata here (slugs, titles, descriptions).
 * Run `npm run gallery` to regenerate images and update gallery.generated.ts.
 */

import { isSanityConfigured } from "@/sanity/env";
import { galleryPhotos } from "./gallery.generated";

/* ---------------------------------------------------------------------------
   Types
--------------------------------------------------------------------------- */

export type CategorySlug = "rodina" | "svatby_udalosti" | "dron" | "ostatni";

export type GalleryPhoto = {
  category: CategorySlug;
  src: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL: string;
};

export type GalleryCategory = {
  slug: CategorySlug;
  title: string;
  description: string;
};

/* ---------------------------------------------------------------------------
   Categories
--------------------------------------------------------------------------- */

export const categories: GalleryCategory[] = [
  {
    slug: "rodina",
    title: "Rodina",
    description: "Přirozené rodinné okamžiky — doma, venku, ve světle běžného dne.",
  },
  {
    slug: "svatby_udalosti",
    title: "Svatby a jiné události",
    description: "Svatby, oslavy, křtiny, firemní i společenské akce zachycené v pohybu.",
  },
  {
    slug: "dron",
    title: "Z dronu",
    description: "Letecké snímky — místa a okamžiky z ptačí perspektivy.",
  },
  {
    slug: "ostatni",
    title: "Ostatní",
    description: "Volnější tvorba a momenty, které se nevešly do ostatních kategorií.",
  },
] as const;

/* ---------------------------------------------------------------------------
   Helpers
--------------------------------------------------------------------------- */

/** Returns category metadata by slug, or undefined if not found. */
export function getCategory(slug: CategorySlug): GalleryCategory | undefined {
  return categories.find((c) => c.slug === slug);
}

/** Returns all category slugs — used for generateStaticParams. */
export function getCategorySlugs(): CategorySlug[] {
  return categories.map((c) => c.slug);
}

/** Static photos for a category — used as fallback when Sanity is not configured. */
function getStaticPhotosByCategory(slug: CategorySlug): GalleryPhoto[] {
  return (galleryPhotos as readonly GalleryPhoto[]).filter((p) => p.category === slug);
}

/**
 * Returns all photos for a given category slug.
 *
 * Fallback: pokud je nastaveno `NEXT_PUBLIC_SANITY_PROJECT_ID`, čte ze Sanity;
 * jinak vrací statická data jako dosud. Async kvůli Sanity fetch.
 */
export async function getPhotosByCategory(slug: CategorySlug): Promise<GalleryPhoto[]> {
  if (isSanityConfigured) {
    const { fetchPhotosByCategory } = await import("@/sanity/data");
    const photos = await fetchPhotosByCategory(slug);
    // Bezpečnostní fallback: prázdný dataset → statický obsah.
    if (photos.length > 0) return photos;
  }
  return getStaticPhotosByCategory(slug);
}

/** Returns the first n photos for a category — used in the homepage preview. */
export async function getPreviewPhotos(slug: CategorySlug, n: number): Promise<GalleryPhoto[]> {
  return (await getPhotosByCategory(slug)).slice(0, n);
}
