"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { LanguageSwitcher } from "./LanguageSwitcher";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const t = useTranslations("nav");

  // Lock body scroll + close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      className={cn(
        "bg-background fixed inset-0 z-40 flex flex-col transition-opacity duration-300 md:hidden",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
    >
      <nav className="flex flex-1 flex-col items-center justify-center gap-8">
        {site.nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="hover:text-accent font-serif text-3xl font-medium tracking-tight transition-colors"
          >
            {t(item.id)}
          </Link>
        ))}
        <LanguageSwitcher size="lg" className="mt-4" />
      </nav>
    </div>
  );
}
