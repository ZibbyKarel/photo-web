import { z } from "zod";

/** A translator scoped to the `contactForm.errors` namespace. */
type ErrorTranslator = (key: string) => string;

/**
 * Builds the contact schema with localized validation messages. Pass a
 * translator from the active locale (client: useTranslations; server:
 * getTranslations) so errors are shown in the visitor's language.
 */
export function createContactSchema(t: ErrorTranslator) {
  return z.object({
    name: z.string().min(2, t("nameMin")).max(100, t("nameMax")),

    email: z.email(t("emailInvalid")),

    phone: z.string().optional(),

    message: z.string().min(10, t("messageMin")).max(2000, t("messageMax")),

    gdpr: z.literal(true, {
      error: t("gdpr"),
    }),

    /** Honeypot — must stay empty; bots usually fill it in. */
    website: z.string().optional(),
  });
}

export type ContactInput = z.infer<ReturnType<typeof createContactSchema>>;
