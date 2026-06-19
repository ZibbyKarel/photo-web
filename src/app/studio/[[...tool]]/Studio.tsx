"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

/** Klientský wrapper embedded Studia. */
export function Studio() {
  return <NextStudio config={config} />;
}
