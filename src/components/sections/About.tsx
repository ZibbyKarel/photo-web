import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Stack } from "@/components/ui/Stack";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { ButtonLink } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Placeholder";

export function About() {
  const t = useTranslations("about");

  return (
    <Section id="o-mne" className="border-border scroll-mt-24 border-t">
      <Container>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
          {/* Portrait */}
          <div className="order-2 md:order-1">
            <Placeholder
              aspect="4/5"
              label={t("portraitLabel")}
              className="w-full max-w-sm md:max-w-none"
            />
          </div>

          {/* Text */}
          <div className="order-1 flex items-center md:order-2">
            <Stack gap="lg" className="w-full">
              <Stack gap="sm">
                <Eyebrow>{t("eyebrow")}</Eyebrow>
                <Heading as="h2" size="xl">
                  {t("heading")}
                </Heading>
              </Stack>

              <Stack gap="md">
                <Text tone="muted">{t("p1")}</Text>
                <Text tone="muted">{t("p2")}</Text>
              </Stack>

              <ButtonLink href="/#galerie" variant="ghost">
                {t("cta")}
              </ButtonLink>
            </Stack>
          </div>
        </div>
      </Container>
    </Section>
  );
}
