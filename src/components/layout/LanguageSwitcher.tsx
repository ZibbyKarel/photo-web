"use client";

import { Fragment } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

type LanguageSwitcherProps = {
  className?: string;
  /** Larger touch targets for the mobile menu. */
  size?: "sm" | "lg";
};

/**
 * CS / EN toggle. Switches the active locale while preserving the current path
 * (next-intl rewrites the prefix and persists the choice via the NEXT_LOCALE cookie).
 */
export function LanguageSwitcher({ className, size = "sm" }: LanguageSwitcherProps) {
  const active = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        size === "lg" ? "text-base" : "text-xs",
        className,
      )}
    >
      {routing.locales.map((locale, i) => (
        <Fragment key={locale}>
          {i > 0 && <span className="text-faint select-none">/</span>}
          <button
            type="button"
            onClick={() => router.replace(pathname, { locale })}
            aria-current={locale === active ? "true" : undefined}
            className={cn(
              "font-medium tracking-wide uppercase transition-colors",
              locale === active
                ? "text-foreground"
                : "text-muted hover:text-foreground cursor-pointer",
            )}
          >
            {locale}
          </button>
        </Fragment>
      ))}
    </div>
  );
}
