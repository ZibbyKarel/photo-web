import { ContactForm } from "@/components/sections/ContactForm";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Stack } from "@/components/ui/Stack";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { useTranslations } from "next-intl";

export function Contact() {
  const t = useTranslations("contact");

  return (
    <Section id="contact" className="bg-surface border-border scroll-mt-24 border-t">
      <Container width="narrow">
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
      </Container>
    </Section>
  );
}
