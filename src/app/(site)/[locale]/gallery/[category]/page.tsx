import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Stack } from "@/components/ui/Stack";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getCategorySlugs, getPhotosByCategory, categories, isCategorySlug } from "@/lib/gallery";
import { buildMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string; category: string }>;
};

export function generateStaticParams() {
  return getCategorySlugs().map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, category } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });

  if (!isCategorySlug(category)) {
    return { title: t("notFound") };
  }

  // buildMetadata handles title (bare, for template), og:title (full), description,
  // canonical URL (prevents canonicalizing category pages to /), and OG/Twitter cards.
  return buildMetadata({
    locale: locale as Locale,
    title: `${t(`categories.${category}.title`)} — ${t("titleSuffix")}`,
    description: t(`categories.${category}.description`),
    path: `/gallery/${category}`,
  });
}

export default async function GalleryCategoryPage({ params }: PageProps) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  if (!isCategorySlug(category)) {
    notFound();
  }

  const slug = category;
  const t = await getTranslations("gallery");
  const photos = await getPhotosByCategory(slug);

  // Other categories for navigation
  const otherCategories = categories.filter((c) => c.slug !== slug);

  return (
    <>
      {/* Hero header — offset for fixed header */}
      <div className="pt-28 md:pt-36">
        <Container>
          <Stack gap="md" className="py-12 md:py-16">
            <Link
              href="/#gallery"
              className="text-muted hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              {t("backToGallery")}
            </Link>

            <Stack gap="sm">
              <Eyebrow>{t("eyebrow")}</Eyebrow>
              <Heading as="h1" size="xl">
                {t(`categories.${slug}.title`)}
              </Heading>
              <Text tone="muted" className="max-w-lg">
                {t(`categories.${slug}.description`)}
              </Text>
            </Stack>
          </Stack>
        </Container>
      </div>

      {/* Gallery grid */}
      <Section spacing="compact" className="border-border border-t">
        <Container>
          <GalleryGrid photos={photos} />
        </Container>
      </Section>

      {/* Other categories */}
      {otherCategories.length > 0 && (
        <Section spacing="compact" className="border-border border-t">
          <Container>
            <Stack gap="lg">
              <p className="text-muted text-sm font-medium tracking-[0.15em] uppercase">
                {t("otherCategories")}
              </p>
              <div className="flex flex-wrap gap-4">
                {otherCategories.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/gallery/${other.slug}`}
                    className="border-border-strong hover:border-foreground hover:text-foreground text-muted inline-flex items-center gap-2 border px-5 py-2.5 text-sm transition-colors"
                  >
                    {t(`categories.${other.slug}.title`)}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                ))}
              </div>
            </Stack>
          </Container>
        </Section>
      )}
    </>
  );
}
