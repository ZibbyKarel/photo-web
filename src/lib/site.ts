/**
 * Single source of truth for site-wide content & contact details.
 * TODO: nahradit skutečným jménem / brandingem a kontakty (viz docs/plans, otevřená otázka #1).
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
