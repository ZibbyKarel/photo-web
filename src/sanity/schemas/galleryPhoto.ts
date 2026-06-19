import { defineField, defineType } from "sanity";

/**
 * Fotka galerie — fotograf přidává obrázky přes Studio.
 * Kategorie odpovídají statickým slug hodnotám (rodina|svatby|udalosti|dron).
 */
export const galleryPhoto = defineType({
  name: "galleryPhoto",
  title: "Fotka galerie",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Fotka",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alternativní text (alt)",
      type: "string",
      description: "Popis fotky pro přístupnost a SEO.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategorie",
      type: "string",
      options: {
        list: [
          { title: "Rodina", value: "rodina" },
          { title: "Svatby", value: "svatby" },
          { title: "Události", value: "udalosti" },
          { title: "Z dronu", value: "dron" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Pořadí",
      type: "number",
      description: "Nižší číslo = dříve. Fotky se řadí vzestupně.",
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
    select: { title: "alt", subtitle: "category", media: "image" },
  },
});
