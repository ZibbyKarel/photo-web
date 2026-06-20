import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Stack } from "@/components/ui/Stack";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { Placeholder } from "@/components/ui/Placeholder";
import { getTestimonials } from "@/lib/content";

type TestimonialItem = { name: string; role: string; text: string };

export async function Testimonials() {
  const t = await getTranslations("testimonials");
  // Prefer Sanity content when available; otherwise use the localized fallback.
  const fromSanity = await getTestimonials();
  const testimonials: TestimonialItem[] = fromSanity ?? (t.raw("items") as TestimonialItem[]);

  return (
    <Section className="bg-surface border-border border-t">
      <Container>
        <Stack gap="xl">
          {/* Section header */}
          <div className="max-w-xl">
            <Stack gap="sm">
              <Eyebrow>{t("eyebrow")}</Eyebrow>
              <Heading as="h2" size="xl">
                {t("heading")}
              </Heading>
            </Stack>
          </div>

          {/* Quotes */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((item, i) => (
              <figure key={i} className="flex flex-col gap-6">
                <blockquote>
                  <Text tone="muted" className="leading-loose italic">
                    &ldquo;{item.text}&rdquo;
                  </Text>
                </blockquote>
                <figcaption className="border-border flex items-center gap-4 border-t pt-6">
                  {/* Avatar placeholder */}
                  <Placeholder
                    aspect="1/1"
                    className="h-12 w-12 shrink-0 rounded-full"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-foreground text-sm font-medium">{item.name}</p>
                    <p className="text-faint text-xs">{item.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </Stack>
      </Container>
    </Section>
  );
}
