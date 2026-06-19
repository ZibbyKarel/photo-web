import { defineField, defineType } from "sanity";

/**
 * Cenový balíček.
 *
 * POZN.: Toto schéma je namodelováno pro úplnost, ale ZÁMĚRNĚ NENÍ propojeno
 * do webu — ceník zůstává statický v `src/lib/content.ts`. Slouží jako základ
 * pro budoucí rozšíření CMS.
 */
export const pricingPackage = defineType({
  name: "pricingPackage",
  title: "Cenový balíček",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Název",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Cena",
      type: "string",
      description: 'Volný text, např. "od 1 800 Kč".',
    }),
    defineField({ name: "description", title: "Popis", type: "text", rows: 2 }),
    defineField({
      name: "features",
      title: "Co je v ceně",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "highlight", title: "Zvýraznit", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Pořadí", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "title", subtitle: "price" } },
});
