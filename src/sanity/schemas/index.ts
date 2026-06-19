import type { SchemaTypeDefinition } from "sanity";
import { galleryPhoto } from "./galleryPhoto";
import { testimonial } from "./testimonial";
import { pricingPackage } from "./pricingPackage";
import { siteSettings } from "./siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  galleryPhoto,
  testimonial,
  // Namodelováno, ale NEPROPOJENO do webu (ceník/texty zůstávají statické):
  pricingPackage,
  siteSettings,
];
