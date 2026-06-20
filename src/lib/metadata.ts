import type { Metadata } from "next";
import { site } from "@/lib/site";
import { routing, type Locale } from "@/i18n/routing";

const OG_LOCALE: Record<Locale, string> = { cs: "cs_CZ", en: "en_US" };

/** OpenGraph `locale` value (e.g. "cs_CZ") for a locale. */
export function ogLocale(locale: Locale): string {
  return OG_LOCALE[locale];
}

/**
 * Absolute, locale-prefixed URL for a locale-independent path.
 * Path is "" for the home page, or e.g. "/gallery/family". The default locale
 * (cs) is prefix-free; others get a "/<locale>" prefix.
 */
export function localizedUrl(locale: Locale, path: string): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${site.url}${prefix}${path}`;
}

/** hreflang alternates for a path: every locale plus x-default → default locale. */
export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {
    "x-default": localizedUrl(routing.defaultLocale, path),
  };
  for (const loc of routing.locales) languages[loc] = localizedUrl(loc, path);
  return languages;
}

type BuildMetadataOptions = {
  locale: Locale;
  title: string;
  description: string;
  /** Locale-independent path, e.g. "/gallery/family". */
  path: string;
};

/**
 * Per-page metadata helper (e.g. gallery category pages). Sets bare title (the
 * root title.template adds "| site"), full og:title, description, locale-aware
 * canonical + hreflang alternates, and OG/Twitter cards.
 */
export function buildMetadata({ locale, title, description, path }: BuildMetadataOptions): Metadata {
  const canonical = localizedUrl(locale, path);
  const ogTitle = `${title} | ${site.name}`;

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description,
      url: canonical,
      siteName: site.name,
      locale: OG_LOCALE[locale],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
  };
}
