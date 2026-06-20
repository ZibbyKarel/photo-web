"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { useScrolled } from "@/hooks/useScrolled";
import { MobileMenu } from "./MobileMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const scrolled = useScrolled();
  const t = useTranslations("nav");
  const ta = useTranslations("a11y");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || menuOpen
          ? "border-border bg-background/80 border-b backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      {/* Dark scrim at the top — keeps the logo and menu legible over the light
          hero photo until the user scrolls (then the blurred background takes over). */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent transition-opacity duration-300",
          scrolled || menuOpen ? "opacity-0" : "opacity-100",
        )}
      />

      <div className="relative mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-6 md:h-20 md:px-10">
        <Link
          href="/"
          className="font-serif text-lg font-semibold tracking-tight md:text-xl"
          onClick={() => setMenuOpen(false)}
        >
          {site.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm transition-colors",
                scrolled
                  ? "text-muted hover:text-foreground"
                  : "text-foreground/80 hover:text-foreground",
              )}
            >
              {t(item.id)}
            </Link>
          ))}
          <LanguageSwitcher className="border-border-strong border-l pl-6" />
        </nav>

        <button
          type="button"
          className="relative z-50 flex h-10 w-10 items-center justify-center md:hidden"
          aria-label={menuOpen ? ta("closeMenu") : ta("openMenu")}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="relative block h-4 w-6">
            <span
              className={cn(
                "bg-foreground absolute left-0 block h-0.5 w-6 transition-transform duration-300",
                menuOpen ? "top-1/2 rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "bg-foreground absolute bottom-0 left-0 block h-0.5 w-6 transition-transform duration-300",
                menuOpen ? "bottom-1/2 -rotate-45" : "",
              )}
            />
          </span>
        </button>
      </div>

      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
