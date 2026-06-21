import { defineField, defineType } from "sanity";

/**
 * Gallery photo — the photographer adds images via Studio.
 * Categories match the static slug values (family|weddings-events|commercial|drone|other).
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
          { title: "Rodina", value: "family" },
          { title: "Svatby a jiné události", value: "weddings-events" },
          { title: "Reklamní focení", value: "commercial" },
          { title: "Z dronu", value: "drone" },
          { title: "Ostatní", value: "other" },
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
