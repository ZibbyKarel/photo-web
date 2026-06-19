import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, isSanityConfigured, projectId } from "./env";

/**
 * URL builder pro Sanity obrázky.
 *
 * Builder se vytváří jen když je Sanity nakonfigurováno; jinak je `null`
 * a `urlFor` vrátí prázdný řetězec (v praxi se nepoužije, protože ve fallback
 * režimu se Sanity data vůbec nečtou).
 */
const builder = isSanityConfigured ? imageUrlBuilder({ projectId: projectId!, dataset }) : null;

export function urlFor(source: SanityImageSource) {
  return builder ? builder.image(source) : null;
}
