/**
 * Single source of truth for site-wide content & contact details.
 * TODO: nahradit skutečným jménem / brandingem a kontakty (viz docs/plans, otevřená otázka #1).
 */
export const site = {
  name: "Jméno Fotografa",
  shortName: "Fotograf",
  tagline: "Fotograf — Plzeň a okolí",
  description:
    "Rodinné focení, reality a krajiny v Plzni a okolí. Autentické fotografie zachycující skutečné okamžiky.",
  url: "https://example.cz",
  email: "ahoj@example.cz",
  phone: "+420 000 000 000",
  phoneHref: "tel:+420000000000",
  location: "Plzeň",
  instagram: "https://instagram.com",
  instagramHandle: "@fotograf",
  nav: [
    { label: "Galerie", href: "/#galerie" },
    { label: "O mně", href: "/#o-mne" },
    { label: "Ceník", href: "/#cenik" },
    { label: "Kontakt", href: "/#kontakt" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
