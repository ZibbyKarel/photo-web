import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Jméno musí mít alespoň 2 znaky.")
    .max(100, "Jméno může mít nejvýše 100 znaků."),

  email: z.email("Zadejte platnou e-mailovou adresu."),

  phone: z.string().optional(),

  /** Prázdný řetězec (žádná volba) je normalizován na undefined před validací. */
  type: z.enum(["rodina", "svatba", "udalost", "dron", "jine"]).optional(),

  message: z
    .string()
    .min(10, "Zpráva musí mít alespoň 10 znaků.")
    .max(2000, "Zpráva může mít nejvýše 2 000 znaků."),

  gdpr: z.literal(true, {
    error: "Je třeba souhlas se zpracováním údajů.",
  }),

  /** Honeypot — musí zůstat prázdný; boti ho obvykle vyplní. */
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
