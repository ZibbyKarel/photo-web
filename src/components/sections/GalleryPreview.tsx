import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Stack } from "@/components/ui/Stack";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { ButtonLink } from "@/components/ui/Button";
import { categories, getPreviewPhotos } from "@/lib/gallery";
import { Reveal } from "@/components/animations/Reveal";

/**
 * Homepage gallery preview section — shows 3 categories with 4 preview images each
 * and a link to the full category page.
 * Server component — Reveal client wrappers are fine inside RSC.
 */
export async function GalleryPreview() {
  const t = await getTranslations("gallery");
  // Resolve photos for each category upfront (cannot await inside the .map render).
  const previewsByCat = await Promise.all(categories.map((cat) => getPreviewPhotos(cat.slug, 4)));

  // Pair each category with its previews and drop the empty ones — a category
  // with no photos yet (e.g. a newly added one) would otherwise render a broken
  // heading with an empty grid.
  const blocks = categories
    .map((cat, index) => ({ cat, previews: previewsByCat[index] }))
    .filter((block) => block.previews.length > 0);

  return (
    <Section id="gallery" className="border-border scroll-mt-24 border-t">
      <Container>
        <Stack gap="xl">
          {/* Section header */}
          <div className="max-w-xl">
            <Stack gap="sm">
              <Eyebrow>{t("eyebrow")}</Eyebrow>
              <Heading as="h2" size="xl">
                {t("previewHeading")}
              </Heading>
            </Stack>
          </div>

          {/* Category blocks — Reveal becomes the grid, children are category blocks */}
          <Reveal stagger={0.12} className="grid w-full grid-cols-1 gap-16 md:gap-20">
            {blocks.map(({ cat, previews }) => {
              return (
                <div key={cat.slug}>
                  <Stack gap="lg">
                    {/* Category title + description */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <Stack gap="xs">
                        <Heading as="h3" size="md">
                          {t(`categories.${cat.slug}.title`)}
                        </Heading>
                        <Text tone="muted" size="sm" className="max-w-md">
                          {t(`categories.${cat.slug}.description`)}
                        </Text>
                      </Stack>
                      <ButtonLink
                        href={`/gallery#${cat.slug}`}
                        variant="ghost"
                        className="shrink-0 self-start sm:self-auto"
                      >
                        {t("viewAll")}
                      </ButtonLink>
                    </div>

                    {/* Preview grid — Reveal becomes the grid, children are individual photo links */}
                    {/*
                     * w-full is load-bearing: this grid sits inside a Stack
                     * (flex flex-col items-start), which does NOT stretch its
                     * children horizontally. Without w-full the grid shrink-wraps
                     * to its content; with `fill` images (no intrinsic width) that
                     * collapses the tracks to 0 and the photos vanish.
                     */}
                    <Reveal
                      stagger={0.07}
                      className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3"
                    >
                      {previews.map((photo) => (
                        <Link
                          key={photo.src}
                          href={`/gallery#${cat.slug}`}
                          className="group block overflow-hidden"
                          tabIndex={-1}
                          aria-hidden="true"
                        >
                          <div className="relative aspect-square overflow-hidden">
                            {/* `fill` (absolute inset-0), matching Hero/About.
                             * Requires the box to have real dimensions — see the
                             * w-full note on the grid above. */}
                            <Image
                              src={photo.src}
                              alt={photo.alt}
                              fill
                              {...(photo.blurDataURL
                                ? { placeholder: "blur" as const, blurDataURL: photo.blurDataURL }
                                : {})}
                              loading="lazy"
                              sizes="(min-width: 640px) 25vw, 50vw"
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                            />
                          </div>
                        </Link>
                      ))}
                    </Reveal>
                  </Stack>
                </div>
              );
            })}
          </Reveal>
        </Stack>
      </Container>
    </Section>
  );
}
