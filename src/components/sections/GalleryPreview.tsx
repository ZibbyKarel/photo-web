import Image from "next/image";
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
  // Fotky pro každou kategorii vyřešíme dopředu (nelze awaitovat uvnitř .map render).
  const previewsByCat = await Promise.all(categories.map((cat) => getPreviewPhotos(cat.slug, 4)));

  return (
    <Section id="galerie" className="border-border scroll-mt-24 border-t">
      <Container>
        <Stack gap="xl">
          {/* Section header */}
          <div className="max-w-xl">
            <Stack gap="sm">
              <Eyebrow>Galerie</Eyebrow>
              <Heading as="h2" size="xl">
                Práce, která mluví za mě
              </Heading>
            </Stack>
          </div>

          {/* Category blocks — Reveal becomes the grid, children are category blocks */}
          <Reveal stagger={0.12} className="grid grid-cols-1 gap-16 md:gap-20">
            {categories.map((cat, catIndex) => {
              const previews = previewsByCat[catIndex];
              return (
                <div key={cat.slug}>
                  <Stack gap="lg">
                    {/* Category title + description */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <Stack gap="xs">
                        <h3 className="text-foreground font-serif text-2xl font-semibold tracking-tight md:text-3xl">
                          {cat.title}
                        </h3>
                        <Text tone="muted" size="sm" className="max-w-md">
                          {cat.description}
                        </Text>
                      </Stack>
                      <ButtonLink
                        href={`/galerie/${cat.slug}`}
                        variant="ghost"
                        className="shrink-0 self-start sm:self-auto"
                      >
                        Zobrazit vše
                      </ButtonLink>
                    </div>

                    {/* Preview grid — Reveal becomes the grid, children are individual photo links */}
                    <Reveal
                      stagger={0.07}
                      className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3"
                    >
                      {previews.map((photo) => (
                        <a
                          key={photo.src}
                          href={`/galerie/${cat.slug}`}
                          className="group block overflow-hidden"
                          tabIndex={-1}
                          aria-hidden="true"
                        >
                          <div className="relative aspect-square overflow-hidden">
                            <Image
                              src={photo.src}
                              alt={photo.alt}
                              width={photo.width}
                              height={photo.height}
                              {...(photo.blurDataURL
                                ? { placeholder: "blur" as const, blurDataURL: photo.blurDataURL }
                                : {})}
                              loading="lazy"
                              sizes="(min-width: 640px) 25vw, 50vw"
                              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                            />
                          </div>
                        </a>
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
