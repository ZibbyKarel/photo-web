/**
 * Structural content data. Display strings (titles, descriptions, prices, FAQ,
 * testimonials…) live in `messages/{cs,en}.json` and are read via next-intl.
 * Only locale-independent structure (ids, ordering, highlight flags) stays here.
 */

/* ---------------------------------------------------------------------------
   Pricing — single source of truth for every numeric fact per service.

   Only locale-independent VALUES live here: prices (in CZK), shooting hours,
   base photo count, extra-photo price, delivery time. The surrounding WORDS are
   generic templates in messages (`pricing.price*`, `pricing.feature.*`) and the
   numbers are interpolated + locale-formatted by next-intl (so `1 500 Kč` in cs
   vs `1,500 CZK` in en come out automatically). Change a number here and both
   locales update — no need to touch messages/{cs,en}.json.

   Service-specific copy (titles, descriptions, bespoke notes) stays in messages
   under `pricing.packages.<id>`.
--------------------------------------------------------------------------- */
export type PricingPackage = {
  id: "family" | "wedding" | "event" | "commercial" | "drone";
  highlight?: boolean;
  /** Headline "from" price, in CZK. */
  price: number;
  /** Headline price is per hour of shooting (renders the `/ hod` variant). */
  perHour?: boolean;
  /** Shooting-time range in hours, [min, max]. Omit if not applicable. */
  hours?: [number, number];
  /** Edited photos included in the base package. Omit if not applicable. */
  basePhotos?: number;
  /** Price of one extra edited photo, in CZK. Omit to hide the row. */
  extraPhotoPrice?: number;
  /** Delivery time in days. Omit if not applicable. */
  deliveryDays?: number;
};

export const pricingPackages: PricingPackage[] = [
  {
    id: "family",
    highlight: true,
    price: 1500,
    hours: [1, 1.5],
    basePhotos: 10,
    extraPhotoPrice: 150,
    deliveryDays: 15,
  },
  {
    id: "wedding",
    price: 8900,
    basePhotos: 300,
    extraPhotoPrice: 50,
    deliveryDays: 30,
  },
  {
    id: "event",
    price: 1500,
    perHour: true,
    deliveryDays: 30,
    hours: [3, 6],
  },
  // {
  //   id: "commercial",
  //   price: 1200,
  //   perHour: true,
  //   deliveryDays: 30,
  //   hours: [3, 6],
  // },
  {
    id: "drone",
    price: 1200,
    perHour: true,
    hours: [0.5, 6],
    deliveryDays: 30,
  },
];

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
