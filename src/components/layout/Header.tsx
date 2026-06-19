"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { useScrolled } from "@/hooks/useScrolled";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || menuOpen
          ? "border-border bg-background/80 border-b backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-6 md:h-20 md:px-10">
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
              className="text-muted hover:text-foreground text-sm transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="relative z-50 flex h-10 w-10 items-center justify-center md:hidden"
          aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
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

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
