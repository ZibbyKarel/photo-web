/**
 * Single source of truth for site-wide contact details and brand facts.
 * Locale-dependent copy (tagline, description, nav labels) lives in messages/.
 */
export const site = {
  name: "Karel Zíbar",
  shortName: "Karel Zíbar",
  tagline: "Fotograf — Plzeň a okolí",
  description:
    "Rodinné focení, svatby, události a letecké snímky z dronu v Plzni a okolí. Autentické fotografie, které zachytí skutečné okamžiky.",
  url: "https://example.cz",
  email: "karel.zibar@icloud.com",
  phone: "+420 722 616 617",
  phoneHref: "tel:+420722616617",
  location: "Plzeň",
  instagram: "https://instagram.com/zibbykarel",
  instagramHandle: "@zibbykarel",
  nav: [
    { id: "gallery", href: "/#galerie" },
    { id: "about", href: "/#o-mne" },
    { id: "pricing", href: "/#cenik" },
    { id: "contact", href: "/#kontakt" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
