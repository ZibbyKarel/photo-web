import { Container } from "@/components/ui/Container";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { ButtonLink } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Placeholder";
import { Parallax } from "@/components/animations/Parallax";
import { Reveal } from "@/components/animations/Reveal";

export function Hero() {
  return (
    <section className="relative flex min-h-svh items-end pt-16 pb-20 md:items-center md:pb-0">
      {/* Pozadí — placeholder foto s parallaxem */}
      <Parallax amount={12} className="absolute inset-0">
        <Placeholder aspect="auto" className="h-full w-full" label="Titulní fotografie" />
        {/* Gradient overlay pro čitelnost textu */}
        <div className="from-background via-background/60 to-background/20 absolute inset-0 bg-gradient-to-t" />
      </Parallax>

      {/* Obsah */}
      <Container className="relative z-10">
        {/*
         * Reveal replaces the Stack here so it is the DIRECT parent of the
         * four staggered children (Eyebrow, Heading, Text, button row).
         * Stack classes (flex flex-col gap-8 items-start) are carried over.
         */}
        <Reveal
          stagger={0.12}
          start="top 90%"
          className="flex max-w-3xl flex-col items-start gap-8 py-20 md:py-28"
        >
          <Eyebrow>Fotograf — Plzeň a okolí</Eyebrow>
          <Heading as="h1" size="display">
            Zachytím vaše skutečné okamžiky
          </Heading>
          <Text size="lg" tone="muted" className="max-w-xl">
            Rodinné focení, reality a krajiny. Přirozené světlo, autentické momenty — bez přehnaných
            pózování.
          </Text>
          <div className="flex flex-wrap gap-4 pt-2">
            <ButtonLink href="/#kontakt" size="lg">
              Domluvit focení
            </ButtonLink>
            <ButtonLink href="/#galerie" variant="ghost" size="lg">
              Prohlédnout galerii
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
