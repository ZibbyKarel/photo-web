/**
 * Gallery data layer — hand-written, imports the generated manifest.
 *
 * Edit category metadata here (slugs, titles, descriptions).
 * Run `npm run gallery` to regenerate images and update gallery.generated.ts.
 */

import { galleryPhotos } from "./gallery.generated";

/* ---------------------------------------------------------------------------
   Types
--------------------------------------------------------------------------- */

export type CategorySlug = "rodina" | "svatby" | "udalosti" | "dron";

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
    slug: "svatby",
    title: "Svatby",
    description: "Reportáž z vašeho dne — emoce, detaily i velké momenty.",
  },
  {
    slug: "udalosti",
    title: "Události",
    description: "Oslavy, křtiny, firemní i společenské akce zachycené v pohybu.",
  },
  {
    slug: "dron",
    title: "Z dronu",
    description: "Letecké snímky — místa a okamžiky z ptačí perspektivy.",
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

/** Returns all photos for a given category slug. */
export function getPhotosByCategory(slug: CategorySlug): GalleryPhoto[] {
  return (galleryPhotos as readonly GalleryPhoto[]).filter((p) => p.category === slug);
}

/** Returns the first n photos for a category — used in the homepage preview. */
export function getPreviewPhotos(slug: CategorySlug, n: number): GalleryPhoto[] {
  return getPhotosByCategory(slug).slice(0, n);
}
