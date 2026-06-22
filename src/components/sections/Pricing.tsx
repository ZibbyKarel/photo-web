import { Reveal } from "@/components/animations/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Stack } from "@/components/ui/Stack";
import { Eyebrow, Heading, Label, Text, Title } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";
import { pricingPackages } from "@/lib/content";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

export function Pricing() {
  const t = useTranslations("pricing");

  return (
    <Section id="pricing" className="border-border scroll-mt-24 border-t">
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
                    <Label tone="accent" className="font-medium">
                      {t("popular")}
                    </Label>
                  )}
                  <Title as="h3">{t(`packages.${pkg.id}.title`)}</Title>
                  <Text tone="muted" size="sm">
                    {t(`packages.${pkg.id}.description`)}
                  </Text>
                </Stack>

                <div className="border-border border-t pt-6">
                  <Title as="p" size="3xl">
                    {pkg.perHour
                      ? t("pricePerHour", { amount: pkg.price })
                      : t("price", { amount: pkg.price })}
                  </Title>
                </div>

                {/*
                 * Uniform feature rows, composed from the per-service config
                 * (src/lib/content.ts). Order: hours → base photos → extra-photo
                 * price → delivery. A row is omitted when its value is unset.
                 */}
                <ul className="flex flex-1 flex-col gap-2">
                  {pkg.hours && (
                    <Feature>
                      {t("feature.hours", { min: pkg.hours[0], max: pkg.hours[1] })}
                    </Feature>
                  )}
                  {pkg.basePhotos != null && (
                    <Feature>{t("feature.basePhotos", { count: pkg.basePhotos })}</Feature>
                  )}
                  {pkg.extraPhotoPrice != null && (
                    <Feature>{t("feature.extraPhoto", { amount: pkg.extraPhotoPrice })}</Feature>
                  )}
                  {pkg.deliveryDays != null && (
                    <Feature>{t("feature.delivery", { days: pkg.deliveryDays })}</Feature>
                  )}
                </ul>

                <ButtonLink href="/#contact" variant={pkg.highlight ? "primary" : "ghost"}>
                  {t("enquire")}
                </ButtonLink>
              </div>
            ))}
          </Reveal>

          {/* Satisfaction guarantee */}
          <div className="border-accent/25 bg-surface mx-auto flex max-w-xl items-start gap-4 border p-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent mt-0.5 h-5 w-5 shrink-0"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <div>
              <p className="font-serif font-semibold">{t("guarantee.heading")}</p>
              <Text tone="muted" size="sm">
                {t("guarantee.text")}
              </Text>
            </div>
          </div>

          {/* Note */}
          <Text tone="faint" size="sm" className="mx-auto max-w-xl text-center">
            {t("note")}
          </Text>
        </Stack>
      </Container>
    </Section>
  );
}

function Feature({ children }: { children: ReactNode }) {
  return (
    <li className="text-muted flex items-start gap-2 text-sm">
      <span className="text-accent mt-0.5 select-none" aria-hidden="true">
        —
      </span>
      {children}
    </li>
  );
}
