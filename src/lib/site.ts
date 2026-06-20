/**
 * Single source of truth for site-wide contact details and brand facts.
 * Locale-dependent copy (tagline, description, nav labels) lives in messages/.
 */
export const site = {
  name: "Karel Zíbar",
  url: "https://example.cz",
  email: "karel.zibar@icloud.com",
  phone: "+420 722 616 617",
  phoneHref: "tel:+420722616617",
  location: "Plzeň",
  instagram: "https://instagram.com/zibbykarel",
  instagramHandle: "@zibbykarel",
  nav: [
    { id: "gallery", href: "/#gallery" },
    { id: "about", href: "/#about" },
    { id: "pricing", href: "/#pricing" },
    { id: "contact", href: "/#contact" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
