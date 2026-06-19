import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Stack } from "@/components/ui/Stack";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import {
  getCategorySlugs,
  getCategory,
  getPhotosByCategory,
  categories,
  type CategorySlug,
} from "@/lib/gallery";
import { buildMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ kategorie: string }>;
};

export function generateStaticParams() {
  return getCategorySlugs().map((kategorie) => ({ kategorie }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { kategorie } = await params;
  const cat = getCategory(kategorie as CategorySlug);

  if (!cat) {
    return { title: "Stránka nenalezena" };
  }

  // buildMetadata handles title (bare, for template), og:title (full), description,
  // canonical URL (prevents canonicalizing category pages to /), and OG/Twitter cards.
  return buildMetadata({
    title: `${cat.title} — Galerie`,
    description: cat.description,
    path: `/galerie/${kategorie}`,
  });
}

export default async function GaleriePage({ params }: PageProps) {
  const { kategorie } = await params;

  // Validate slug
  const validSlugs = getCategorySlugs();
  if (!validSlugs.includes(kategorie as CategorySlug)) {
    notFound();
  }

  const slug = kategorie as CategorySlug;
  const cat = getCategory(slug)!;
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
              href="/#galerie"
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
              Zpět na galerii
            </Link>

            <Stack gap="sm">
              <Eyebrow>Galerie</Eyebrow>
              <Heading as="h1" size="xl">
                {cat.title}
              </Heading>
              <Text tone="muted" className="max-w-lg">
                {cat.description}
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
                Další kategorie
              </p>
              <div className="flex flex-wrap gap-4">
                {otherCategories.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/galerie/${other.slug}`}
                    className="border-border-strong hover:border-foreground hover:text-foreground text-muted inline-flex items-center gap-2 border px-5 py-2.5 text-sm transition-colors"
                  >
                    {other.title}
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
