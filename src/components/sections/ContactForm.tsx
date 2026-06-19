"use client";

import { useRef } from "react";
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
  const formRef = useRef<HTMLFormElement>(null);
  const { status, fieldErrors, errorMessage, submit, reset } = useContactForm();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    // Normalize data: empty string for 'type' → undefined (zod enum doesn't accept "")
    const rawType = fd.get("type") as string | null;

    const data = {
      name: (fd.get("name") as string | null) ?? "",
      email: (fd.get("email") as string | null) ?? "",
      phone: (fd.get("phone") as string | null) ?? undefined,
      type: rawType && rawType.length > 0 ? rawType : undefined,
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
          <p className="text-accent text-sm font-medium tracking-[0.2em] uppercase">Odesláno</p>
          <p className="text-foreground font-serif text-2xl font-semibold">Děkuji za zprávu!</p>
          <p className="text-muted text-sm leading-relaxed">
            Ozvu se vám do 48 hodin. Těším se na spolupráci.
          </p>
          <Button type="button" variant="ghost" size="md" onClick={handleReset} className="mt-2">
            Odeslat další zprávu
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
      {/* Honeypot — skryté před uživatelem, viditelné pro boty */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-website">Web (nevyplňujte)</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Jméno a příjmení
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
            placeholder="Jan Novák"
            className={inputClass}
            aria-invalid={!!fieldErrors.name?.length}
            aria-describedby={fieldErrors.name?.length ? "error-name" : undefined}
          />
          <FieldError id="error-name" messages={fieldErrors.name} />
        </div>
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            Telefon
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+420 000 000 000"
            className={inputClass}
            aria-invalid={!!fieldErrors.phone?.length}
            aria-describedby={fieldErrors.phone?.length ? "error-phone" : undefined}
          />
          <FieldError id="error-phone" messages={fieldErrors.phone} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClass}>
          E-mail
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
          placeholder="jan@example.cz"
          className={inputClass}
          aria-invalid={!!fieldErrors.email?.length}
          aria-describedby={fieldErrors.email?.length ? "error-email" : undefined}
        />
        <FieldError id="error-email" messages={fieldErrors.email} />
      </div>

      <div>
        <label htmlFor="contact-type" className={labelClass}>
          Typ focení
        </label>
        <select
          id="contact-type"
          name="type"
          defaultValue=""
          className={inputClass}
          aria-invalid={!!fieldErrors.type?.length}
          aria-describedby={fieldErrors.type?.length ? "error-type" : undefined}
        >
          <option value="" disabled>
            Vyberte typ...
          </option>
          <option value="rodina">Rodinné focení</option>
          <option value="svatba">Svatba</option>
          <option value="udalost">Událost / oslava</option>
          <option value="dron">Focení z dronu</option>
          <option value="jine">Jiné</option>
        </select>
        <FieldError id="error-type" messages={fieldErrors.type} />
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Zpráva
          <span className="text-accent ml-1" aria-hidden="true">
            *
          </span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Napište mi, co máte v plánu, kdy a kde by se mohlo fotit..."
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
            Souhlasím se zpracováním osobních údajů za účelem odpovědi na moji zprávu. Údaje nebudou
            předány třetím stranám.
          </label>
          <FieldError id="error-gdpr" messages={fieldErrors.gdpr} />
        </div>
      </div>

      {/* Obecná chybová hláška */}
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
        {isSubmitting ? "Odesílám…" : "Odeslat zprávu"}
      </Button>
    </form>
  );
}
