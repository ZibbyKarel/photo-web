import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Stack } from "@/components/ui/Stack";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { ButtonLink } from "@/components/ui/Button";
import { pricingPackages, pricingNote } from "@/lib/content";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/animations/Reveal";

export function Pricing() {
  return (
    <Section id="cenik" className="border-border scroll-mt-24 border-t">
      <Container>
        <Stack gap="xl">
          {/* Záhlaví */}
          <div className="max-w-xl">
            <Stack gap="sm">
              <Eyebrow>Ceník</Eyebrow>
              <Heading as="h2" size="xl">
                Transparentní ceny
              </Heading>
            </Stack>
          </div>

          {/*
           * Reveal becomes the card grid so its DIRECT children are the price cards.
           * Grid classes carried from the original div.
           */}
          <Reveal stagger={0.1} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {pricingPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={cn(
                  "flex flex-col gap-6 border p-8",
                  pkg.highlight
                    ? "border-border-strong bg-surface-raised"
                    : "border-border bg-surface",
                )}
              >
                <Stack gap="xs">
                  {pkg.highlight && (
                    <span className="text-accent text-xs font-medium tracking-[0.2em] uppercase">
                      Nejoblíbenější
                    </span>
                  )}
                  <h3 className="text-foreground font-serif text-xl font-semibold tracking-tight">
                    {pkg.title}
                  </h3>
                  <Text tone="muted" size="sm">
                    {pkg.description}
                  </Text>
                </Stack>

                <div className="border-border border-t pt-6">
                  <p className="text-foreground font-serif text-3xl font-semibold tracking-tight">
                    {pkg.price}
                  </p>
                </div>

                <ul className="flex flex-1 flex-col gap-2">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="text-muted flex items-start gap-2 text-sm">
                      <span className="text-accent mt-0.5 select-none" aria-hidden="true">
                        —
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <ButtonLink href="/#kontakt" variant={pkg.highlight ? "primary" : "ghost"}>
                  Nezávazně poptat
                </ButtonLink>
              </div>
            ))}
          </Reveal>

          {/* Poznámka */}
          <p className="text-faint max-w-xl text-sm leading-relaxed">{pricingNote}</p>
        </Stack>
      </Container>
    </Section>
  );
}
