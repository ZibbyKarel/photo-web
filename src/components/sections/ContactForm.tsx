"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Stack } from "@/components/ui/Stack";
import { Button } from "@/components/ui/Button";
import { useContactForm } from "@/hooks/useContactForm";

const inputClass =
  "w-full rounded-none border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-faint focus:border-accent-strong focus:outline-none transition-colors duration-200";

const labelClass = "block text-sm font-medium text-muted mb-2";

function FieldError({ id, messages }: { id: string; messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p id={id} className="text-accent mt-1.5 text-xs" role="alert">
      {messages[0]}
    </p>
  );
}

export function ContactForm() {
  const t = useTranslations("contactForm");
  const formRef = useRef<HTMLFormElement>(null);
  const { status, fieldErrors, errorMessage, submit, reset } = useContactForm();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const data = {
      name: (fd.get("name") as string | null) ?? "",
      email: (fd.get("email") as string | null) ?? "",
      phone: (fd.get("phone") as string | null) ?? undefined,
      message: (fd.get("message") as string | null) ?? "",
      // checkbox returns "on" when checked, null when unchecked
      gdpr: fd.get("gdpr") === "on" ? (true as const) : (false as unknown as true),
      // honeypot
      website: (fd.get("website") as string | null) ?? "",
    };

    await submit(data);
  }

  function handleReset() {
    reset();
    formRef.current?.reset();
  }

  const isSubmitting = status === "submitting";

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border-border bg-surface rounded-none border p-8 text-center"
      >
        <Stack gap="md" align="center">
          <p className="text-accent text-sm font-medium tracking-[0.2em] uppercase">
            {t("successEyebrow")}
          </p>
          <p className="text-foreground font-serif text-2xl font-semibold">
            {t("successHeading")}
          </p>
          <p className="text-muted text-sm leading-relaxed">{t("successText")}</p>
          <Button type="button" variant="ghost" size="md" onClick={handleReset} className="mt-2">
            {t("sendAnother")}
          </Button>
        </Stack>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className="flex flex-col gap-5"
      noValidate
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
    >
      {/* Honeypot — hidden from users, visible to bots */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-website">{t("honeypotLabel")}</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            {t("name")}
            <span className="text-accent ml-1" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder={t("namePlaceholder")}
            className={inputClass}
            aria-invalid={!!fieldErrors.name?.length}
            aria-describedby={fieldErrors.name?.length ? "error-name" : undefined}
          />
          <FieldError id="error-name" messages={fieldErrors.name} />
        </div>
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            {t("phone")}
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={t("phonePlaceholder")}
            className={inputClass}
            aria-invalid={!!fieldErrors.phone?.length}
            aria-describedby={fieldErrors.phone?.length ? "error-phone" : undefined}
          />
          <FieldError id="error-phone" messages={fieldErrors.phone} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClass}>
          {t("email")}
          <span className="text-accent ml-1" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={t("emailPlaceholder")}
          className={inputClass}
          aria-invalid={!!fieldErrors.email?.length}
          aria-describedby={fieldErrors.email?.length ? "error-email" : undefined}
        />
        <FieldError id="error-email" messages={fieldErrors.email} />
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          {t("message")}
          <span className="text-accent ml-1" aria-hidden="true">
            *
          </span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder={t("messagePlaceholder")}
          className={inputClass}
          aria-invalid={!!fieldErrors.message?.length}
          aria-describedby={fieldErrors.message?.length ? "error-message" : undefined}
        />
        <FieldError id="error-message" messages={fieldErrors.message} />
      </div>

      {/* GDPR */}
      <div className="flex items-start gap-3">
        <input
          id="contact-gdpr"
          name="gdpr"
          type="checkbox"
          required
          className="accent-accent mt-1 h-4 w-4 shrink-0"
          aria-invalid={!!fieldErrors.gdpr?.length}
          aria-describedby={fieldErrors.gdpr?.length ? "error-gdpr" : undefined}
        />
        <div>
          <label htmlFor="contact-gdpr" className="text-muted text-xs leading-relaxed">
            {t("gdpr")}
          </label>
          <FieldError id="error-gdpr" messages={fieldErrors.gdpr} />
        </div>
      </div>

      {/* General error message */}
      {status === "error" && errorMessage && (
        <div role="alert" aria-live="assertive" className="border-accent/30 bg-surface border p-4">
          <p className="text-muted text-sm">{errorMessage}</p>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="self-start"
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
      >
        {isSubmitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
