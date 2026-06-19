/**
 * Konfigurace Sanity Studia.
 *
 * Použito jak embedded Studiem (route /studio), tak samostatným
 * `npx sanity dev` (přes sanity.cli.ts).
 *
 * projectId/dataset jdou z env. Bez nich Studio nelze spustit — to je v pořádku,
 * web v takovém případě běží ve statickém fallback režimu a route /studio
 * zobrazí jen hlášku (viz src/app/studio/[[...tool]]/page.tsx).
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "default",
  title: "photo-web",
  // Prázdné stringy jsou OK pro samotný build modulu; reálné Studio
  // vyžaduje nastavené env proměnné.
  projectId: projectId || "",
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
