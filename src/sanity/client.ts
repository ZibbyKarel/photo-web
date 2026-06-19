import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

/**
 * Sanity client.
 *
 * Vytváří se POUZE když je nastaveno `projectId` — jinak je `null` a datová
 * vrstva spadne na statický fallback. Nikdy nevoláme createClient bez projectId,
 * aby modul nespadl při importu / buildu bez env proměnných.
 */
export const client: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // Veřejné publikované čtení přes CDN (rychlé, cacheované).
      useCdn: true,
      perspective: "published",
    })
  : null;
