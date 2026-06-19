import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Stack } from "@/components/ui/Stack";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { ButtonLink } from "@/components/ui/Button";

export default function Home() {
  return (
    <Section spacing="large" className="flex min-h-svh items-center pt-16">
      <Container>
        <Stack gap="lg" className="max-w-3xl">
          <Eyebrow>Fotograf — Plzeň a okolí</Eyebrow>
          <Heading as="h1" size="display">
            Zachytím vaše skutečné okamžiky
          </Heading>
          <Text size="lg" tone="muted">
            Rodinné focení, reality a krajiny. Začínající fotograf s citem pro přirozené světlo a
            autentické momenty.
          </Text>
          <div className="flex flex-wrap gap-4 pt-2">
            <ButtonLink href="/#kontakt" size="lg">
              Domluvit focení
            </ButtonLink>
            <ButtonLink href="/#galerie" variant="ghost" size="lg">
              Prohlédnout galerii
            </ButtonLink>
          </div>
        </Stack>
      </Container>
    </Section>
  );
}
