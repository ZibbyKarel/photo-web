import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Stack } from "@/components/ui/Stack";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { Placeholder } from "@/components/ui/Placeholder";
import { getTestimonials } from "@/lib/content";

export async function Testimonials() {
  const testimonials = await getTestimonials();

  return (
    <Section className="bg-surface border-border border-t">
      <Container>
        <Stack gap="xl">
          {/* Záhlaví */}
          <div className="max-w-xl">
            <Stack gap="sm">
              <Eyebrow>Reference</Eyebrow>
              <Heading as="h2" size="xl">
                Co říkají klienti
              </Heading>
            </Stack>
          </div>

          {/* Citace */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((item) => (
              <figure key={item.id} className="flex flex-col gap-6">
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
