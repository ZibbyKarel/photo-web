"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Recomputes ScrollTrigger positions once the layout has actually settled.
 *
 * Reveal/ScrollLine create their triggers during hydration — before web fonts
 * and lazy images have finished loading. The start/end pixels are therefore
 * computed against a shorter page, so a scroll *jump* (anchor link, back/forward
 * scroll restoration) can land past a trigger that still thinks it's inactive,
 * leaving `gsap.from` content stuck at opacity 0. A refresh after fonts load —
 * and again on full window load — fixes the positions and re-fires any trigger
 * that should now be active. Mounted once near the root.
 */
export function ScrollRefresh() {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const refresh = () => ScrollTrigger.refresh();

    // Fonts settling is the most common cause of layout shift after hydration.
    document.fonts?.ready.then(refresh);
    // Full load covers late images that change page height.
    if (document.readyState === "complete") refresh();
    else window.addEventListener("load", refresh, { once: true });

    return () => window.removeEventListener("load", refresh);
  });

  return null;
}
