/**
 * Sanity datová vrstva — čte fotky a reference ze Sanity.
 *
 * Tyto funkce volej POUZE když je `isSanityConfigured === true`. Mapují
 * Sanity odpověď na PŘESNĚ stejné tvary, jaké používá statický obsah
 * (`GalleryPhoto`, `Testimonial`), aby komponenty fungovaly beze změny.
 */

import "server-only";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "./client";
import { urlFor } from "./image";
import { photosByCategoryQuery, testimonialsQuery } from "./queries";
import type { CategorySlug, GalleryPhoto } from "@/lib/gallery";
import type { Testimonial } from "@/lib/content";

type SanityPhoto = {
  id: string;
  alt: string | null;
  category: string | null;
  asset: {
    lqip: string | null;
    dimensions: { width: number; height: number } | null;
  } | null;
  image: SanityImageSource;
};

type SanityTestimonial = {
  id: string;
  name: string | null;
  role: string | null;
  quote: string | null;
};

/** Načte fotky kategorie ze Sanity a namapuje je na `GalleryPhoto`. */
export async function fetchPhotosByCategory(category: CategorySlug): Promise<GalleryPhoto[]> {
  if (!client) return [];
  const rows = await client.fetch<SanityPhoto[]>(photosByCategoryQuery, { category });

  return rows.flatMap((row) => {
    const url = urlFor(row.image);
    const dims = row.asset?.dimensions;
    if (!url || !dims) return [];

    return [
      {
        category,
        src: url.auto("format").fit("max").url(),
        width: dims.width,
        height: dims.height,
        alt: row.alt ?? "",
        // LQIP je base64 data URL → použitelné jako blurDataURL.
        blurDataURL: row.asset?.lqip ?? "",
      },
    ];
  });
}

/** Načte reference ze Sanity a namapuje je na `Testimonial` (quote → text). */
export async function fetchTestimonials(): Promise<Testimonial[]> {
  if (!client) return [];
  const rows = await client.fetch<SanityTestimonial[]>(testimonialsQuery, {});

  return rows.map((row) => ({
    id: row.id,
    name: row.name ?? "",
    role: row.role ?? "",
    text: row.quote ?? "",
  }));
}
