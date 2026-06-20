import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Stack } from "@/components/ui/Stack";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { site } from "@/lib/site";
import { ContactForm } from "@/components/sections/ContactForm";

export function Contact() {
  const t = useTranslations("contact");

  return (
    <Section id="kontakt" className="bg-surface border-border scroll-mt-24 border-t">
      <Container>
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:gap-24">
          {/* Form */}
          <div>
            <Stack gap="lg">
              <Stack gap="sm">
                <Eyebrow>{t("eyebrow")}</Eyebrow>
                <Heading as="h2" size="xl">
                  {t("heading")}
                </Heading>
                <Text tone="muted">{t("intro")}</Text>
              </Stack>

              <ContactForm />
            </Stack>
          </div>

          {/* Direct contact */}
          <div className="flex items-start md:justify-end">
            <Stack gap="xl">
              <Stack gap="md">
                <p className="text-faint text-xs tracking-[0.2em] uppercase">
                  {t("directContact")}
                </p>
                <Stack gap="sm">
                  <a
                    href={`mailto:${site.email}`}
                    className="text-foreground hover:text-accent text-base transition-colors"
                  >
                    {site.email}
                  </a>
                  <a
                    href={site.phoneHref}
                    className="text-foreground hover:text-accent text-base transition-colors"
                  >
                    {site.phone}
                  </a>
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-accent text-base transition-colors"
                  >
                    Instagram {site.instagramHandle}
                  </a>
                </Stack>
              </Stack>

              <Stack gap="md">
                <p className="text-faint text-xs tracking-[0.2em] uppercase">{t("areaLabel")}</p>
                <Text tone="muted" size="sm">
                  {t("areaText")}
                </Text>
              </Stack>

              <Stack gap="md">
                <p className="text-faint text-xs tracking-[0.2em] uppercase">
                  {t("responseLabel")}
                </p>
                <Text tone="muted" size="sm">
                  {t("responseText")}
                </Text>
              </Stack>
            </Stack>
          </div>
        </div>
      </Container>
    </Section>
  );
}
