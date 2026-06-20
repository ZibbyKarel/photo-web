import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { ButtonLink } from "@/components/ui/Button";
import { Parallax } from "@/components/animations/Parallax";
import { Reveal } from "@/components/animations/Reveal";

const HERO_BLUR =
  "data:image/jpeg;base64,/9j/2wBDAA4KCw0LCQ4NDA0QDw4RFiQXFhQUFiwgIRokNC43NjMuMjI6QVNGOj1OPjIySGJJTlZYXV5dOEVmbWVabFNbXVn/2wBDAQ8QEBYTFioXFypZOzI7WVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVn/wAARCAALABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABgX/xAAgEAACAQQBBQAAAAAAAAAAAAABAgMABAURBhIxUZGS/8QAFQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAXEQADAQAAAAAAAAAAAAAAAAAAAQIR/9oADAMBAAIRAxEAPwApjb9La4WUopI8ikmU5JHNZGIICe2yNj3QXdW8goTDQFRrqYE/NS50VWH/2Q==";

export function Hero() {
  const t = useTranslations("hero");
  const tc = useTranslations("common");

  return (
    <section className="relative flex min-h-svh items-end pt-16 pb-20 md:items-center md:pb-0">
      {/* Background — hero photo with parallax */}
      <Parallax amount={12} className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt=""
          fill
          priority
          placeholder="blur"
          blurDataURL={HERO_BLUR}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Gradient overlays for text legibility (bottom + left) */}
        <div className="from-background via-background/65 to-background/25 absolute inset-0 bg-gradient-to-t" />
        <div className="from-background/85 absolute inset-0 bg-gradient-to-r to-transparent md:to-40%" />
      </Parallax>

      {/* Content */}
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
          <Eyebrow>{tc("tagline")}</Eyebrow>
          <Heading as="h1" size="display">
            {t("heading")}
          </Heading>
          <Text size="lg" tone="muted" className="max-w-xl">
            {t("text")}
          </Text>
          <div className="flex flex-wrap gap-4 pt-2">
            <ButtonLink href="/#kontakt" size="lg">
              {t("ctaPrimary")}
            </ButtonLink>
            <ButtonLink href="/#galerie" variant="ghost" size="lg">
              {t("ctaSecondary")}
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
