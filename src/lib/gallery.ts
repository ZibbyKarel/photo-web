/**
 * Gallery data layer — hand-written, imports the generated manifest.
 *
 * Edit category metadata here (slugs, titles, descriptions).
 * Run `npm run gallery` to regenerate images and update gallery.generated.ts.
 */

import { isSanityConfigured } from "@/sanity/env";
import { withBasePath } from "./asset";
import { galleryPhotos } from "./gallery.generated";

/* ---------------------------------------------------------------------------
   Types
--------------------------------------------------------------------------- */

export type CategorySlug = "family" | "weddings-events" | "commercial" | "drone" | "other";

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
};

/* ---------------------------------------------------------------------------
   Categories — order + slugs only. Title/description live in messages
   (gallery.categories.<slug>) and are read via next-intl.
--------------------------------------------------------------------------- */

export const categories: GalleryCategory[] = [
  { slug: "family" },
  { slug: "weddings-events" },
  { slug: "commercial" },
  { slug: "drone" },
  { slug: "other" },
] as const;

/* ---------------------------------------------------------------------------
   Helpers
--------------------------------------------------------------------------- */

/** Returns true if the given string is a known category slug. */
export function isCategorySlug(slug: string): slug is CategorySlug {
  return categories.some((c) => c.slug === slug);
}

/** Returns all category slugs — used for generateStaticParams. */
export function getCategorySlugs(): CategorySlug[] {
  return categories.map((c) => c.slug);
}

/**
 * Sorts photos by pixel area (width × height) descending — the largest photos
 * come first. Returns a new array; the input is not mutated.
 */
function sortByLargestFirst(photos: readonly GalleryPhoto[]): GalleryPhoto[] {
  return [...photos].sort((a, b) => b.width * b.height - a.width * a.height);
}

/** Static photos for a category — used as fallback when Sanity is not configured. */
function getStaticPhotosByCategory(slug: CategorySlug): GalleryPhoto[] {
  return (galleryPhotos as readonly GalleryPhoto[])
    .filter((p) => p.category === slug)
    .map((p) => ({ ...p, src: withBasePath(p.src) }));
}

/**
 * Returns all photos for a given category slug, largest first.
 *
 * Fallback: when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, reads from Sanity;
 * otherwise returns the static data. Async because of the Sanity fetch.
 */
export async function getPhotosByCategory(slug: CategorySlug): Promise<GalleryPhoto[]> {
  if (isSanityConfigured) {
    const { fetchPhotosByCategory } = await import("@/sanity/data");
    const photos = await fetchPhotosByCategory(slug);
    // Safety fallback: empty dataset → static content.
    if (photos.length > 0) return sortByLargestFirst(photos);
  }
  return sortByLargestFirst(getStaticPhotosByCategory(slug));
}

/** Returns the first n photos for a category — used in the homepage preview. */
export async function getPreviewPhotos(slug: CategorySlug, n: number): Promise<GalleryPhoto[]> {
  return (await getPhotosByCategory(slug)).slice(0, n);
}
