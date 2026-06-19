import { defineQuery } from "next-sanity";

/**
 * GROQ dotazy. Pro fotky tahám metadata.lqip (→ blurDataURL) a
 * metadata.dimensions (→ width/height), aby fungoval `placeholder="blur"`.
 */

export const photosByCategoryQuery = defineQuery(
  `*[_type == "galleryPhoto" && category == $category]
    | order(order asc, _createdAt asc){
      "id": _id,
      alt,
      category,
      "asset": image.asset->{
        "lqip": metadata.lqip,
        "dimensions": metadata.dimensions,
      },
      "image": image,
    }`,
);

export const testimonialsQuery = defineQuery(
  `*[_type == "testimonial"] | order(order asc, _createdAt asc){
    "id": _id,
    name,
    role,
    quote,
  }`,
);
