import type { MetadataRoute } from "next";
import { getCategorySlugs } from "@/lib/gallery";
import { routing } from "@/i18n/routing";
import { localizedUrl, languageAlternates } from "@/lib/metadata";

// Static date for deterministic builds — update on major content changes.
const LAST_MODIFIED = new Date("2026-01-01");

/** One sitemap entry per (locale, path), each carrying hreflang alternates. */
function entriesForPath(
  path: string,
  changeFrequency: "weekly" | "monthly",
  priority: number,
): MetadataRoute.Sitemap {
  const languages = languageAlternates(path);
  return routing.locales.map((locale) => ({
    url: localizedUrl(locale, path),
    lastModified: LAST_MODIFIED,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...entriesForPath("", "weekly", 1),
    ...getCategorySlugs().flatMap((slug) => entriesForPath(`/gallery/${slug}`, "monthly", 0.8)),
  ];
}
