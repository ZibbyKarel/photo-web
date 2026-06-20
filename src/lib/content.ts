/**
 * Structural content data. Display strings (titles, descriptions, prices, FAQ,
 * testimonials…) live in `messages/{cs,en}.json` and are read via next-intl.
 * Only locale-independent structure (ids, ordering, highlight flags) stays here.
 */

/* ---------------------------------------------------------------------------
   Pricing — package order + highlight (text in messages: pricing.packages.<id>)
--------------------------------------------------------------------------- */
export type PricingPackage = {
  id: string;
  highlight?: boolean;
};

export const pricingPackages: PricingPackage[] = [
  { id: "rodina", highlight: true },
  { id: "svatba" },
  { id: "udalost" },
  { id: "dron" },
] as const;

/* ---------------------------------------------------------------------------
   Testimonials — Sanity-backed, with a localized static fallback in messages
--------------------------------------------------------------------------- */
export type Testimonial = {
  id: string;
  name: string;
  role: string;
  text: string;
};

/**
 * Returns testimonials from Sanity when configured and non-empty, otherwise
 * `null` so the caller can fall back to the localized `testimonials.items`
 * messages. (Sanity content is not localized in this pass.)
 */
export async function getTestimonials(): Promise<Testimonial[] | null> {
  const { isSanityConfigured } = await import("@/sanity/env");
  if (isSanityConfigured) {
    const { fetchTestimonials } = await import("@/sanity/data");
    const fromSanity = await fetchTestimonials();
    if (fromSanity.length > 0) return fromSanity;
  }
  return null;
}
