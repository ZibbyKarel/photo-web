/**
 * Embedded Sanity Studio at the /studio route.
 *
 * `force-dynamic` prevents prerendering at build time (when projectId may be
 * unset). Without Sanity env variables the route shows an info message instead
 * of the Studio.
 */
import { isSanityConfigured } from "@/sanity/env";
import { Studio } from "./Studio";

export const dynamic = "force-dynamic";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
        <h1>Sanity Studio is not configured</h1>
        <p>
          Set the <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> variable (see{" "}
          <code>.env.example</code> and <code>docs/cms-sanity.md</code>) and restart the server.
        </p>
      </div>
    );
  }

  return <Studio />;
}
