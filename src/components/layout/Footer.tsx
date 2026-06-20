import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export function Footer() {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");
  const tc = useTranslations("common");
  const year = 2026;

  return (
    <footer className="border-border mt-auto border-t">
      <Container className="flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <p className="font-serif text-xl font-semibold tracking-tight">{site.name}</p>
          <p className="text-muted mt-3 text-sm leading-relaxed">{tc("tagline")}</p>
        </div>

        <nav className="flex flex-col gap-3">
          <p className="text-faint text-xs tracking-[0.2em] uppercase">{tf("navLabel")}</p>
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted hover:text-foreground text-sm transition-colors"
            >
              {t(item.id)}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <p className="text-faint text-xs tracking-[0.2em] uppercase">{tf("contactLabel")}</p>
          <a
            href={`mailto:${site.email}`}
            className="text-muted hover:text-foreground text-sm transition-colors"
          >
            {site.email}
          </a>
          <a
            href={site.phoneHref}
            className="text-muted hover:text-foreground text-sm transition-colors"
          >
            {site.phone}
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-foreground text-sm transition-colors"
          >
            Instagram {site.instagramHandle}
          </a>
        </div>
      </Container>

      <Container className="border-border flex flex-col gap-2 border-t py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p className="text-faint">
          © {year} {site.name}. {tf("rights")}
        </p>
        <p className="text-faint">{tf("location")}</p>
      </Container>
    </footer>
  );
}
