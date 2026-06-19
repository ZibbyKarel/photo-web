/**
 * Embedded Sanity Studio na route /studio.
 *
 * `force-dynamic` + `force-static = false` brání prerenderování při buildu
 * (kdy nemusí být nastaveno projectId). Bez Sanity env proměnných route
 * zobrazí jen informační hlášku místo Studia.
 */
import { isSanityConfigured } from "@/sanity/env";
import { Studio } from "./Studio";

export const dynamic = "force-dynamic";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
        <h1>Sanity Studio není nakonfigurováno</h1>
        <p>
          Nastav proměnnou <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> (viz <code>.env.example</code>{" "}
          a <code>docs/cms-sanity.md</code>) a restartuj server.
        </p>
      </div>
    );
  }

  return <Studio />;
}
