import { defineField, defineType } from "sanity";

/**
 * Nastavení webu.
 *
 * POZN.: Namodelováno pro úplnost, ZÁMĚRNĚ NENÍ propojeno do webu — texty
 * zůstávají statické. Základ pro budoucí rozšíření.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Nastavení webu",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Název webu", type: "string" }),
    defineField({ name: "description", title: "Popis (meta)", type: "text", rows: 2 }),
    defineField({ name: "email", title: "Kontaktní e-mail", type: "string" }),
    defineField({ name: "phone", title: "Telefon", type: "string" }),
  ],
  preview: { select: { title: "title" } },
});
