import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Stack } from "@/components/ui/Stack";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { Reveal } from "@/components/animations/Reveal";

type Step = { title: string; description: string };

export function Process() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as Step[];

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

          {/*
           * Reveal becomes the grid so its DIRECT children are the step cards.
           * Grid classes carried from the original div.
           */}
          <Reveal
            stagger={0.1}
            className="border-border grid grid-cols-1 gap-px border md:grid-cols-3"
          >
            {steps.map((step, i) => (
              <div key={i} className="bg-surface p-8 md:p-10">
                <Stack gap="md">
                  <span className="text-accent font-serif text-4xl font-semibold opacity-60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Stack gap="xs">
                    <h3 className="text-foreground font-serif text-xl font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <Text tone="muted" size="sm">
                      {step.description}
                    </Text>
                  </Stack>
                </Stack>
              </div>
            ))}
          </Reveal>
        </Stack>
      </Container>
    </Section>
  );
}
