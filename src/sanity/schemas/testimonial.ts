import { defineField, defineType } from "sanity";

/**
 * Reference (testimonial) — citace klienta.
 */
export const testimonial = defineType({
  name: "testimonial",
  title: "Reference",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Jméno",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / typ focení",
      type: "string",
      description: 'Např. "Rodinné focení" nebo "Svatba — Plzeň".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "quote",
      title: "Citace",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Fotka klienta (volitelné)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Pořadí",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Pořadí (vzestupně)",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
