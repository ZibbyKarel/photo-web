import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Stack } from "@/components/ui/Stack";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { processSteps } from "@/lib/content";
import { Reveal } from "@/components/animations/Reveal";

export function Process() {
  return (
    <Section className="bg-surface border-border border-t">
      <Container>
        <Stack gap="xl">
          {/* Záhlaví */}
          <div className="max-w-xl">
            <Stack gap="sm">
              <Eyebrow>Průběh spolupráce</Eyebrow>
              <Heading as="h2" size="xl">
                Jak to funguje
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
            {processSteps.map((step) => (
              <div key={step.number} className="bg-surface p-8 md:p-10">
                <Stack gap="md">
                  <span className="text-accent font-serif text-4xl font-semibold opacity-60">
                    {step.number}
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
