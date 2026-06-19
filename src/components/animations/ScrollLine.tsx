"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Signature scroll-line: a fixed SVG organic curve on the left edge that
 * "draws" itself as the user scrolls down the full page.
 *
 * - Visible only on md+ (hidden on mobile via Tailwind).
 * - Animation only for (prefers-reduced-motion: no-preference) users.
 * - For reduced-motion users the path is shown fully drawn (strokeDashoffset 0).
 * - Uses vector-effect="non-scaling-stroke" for consistent stroke width.
 */
export function ScrollLine() {
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const path = pathRef.current;
    if (!path) return;

    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len });

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        path,
        { strokeDashoffset: len },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
          },
        },
      );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(path, { strokeDashoffset: 0 });
    });

    return () => mm.revert();
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-0 left-4 z-30 hidden h-screen w-6 md:block lg:left-8"
    >
      <svg className="h-full w-full" viewBox="0 0 20 800" preserveAspectRatio="none" fill="none">
        <path
          ref={pathRef}
          d="M10 0 C4 150 16 300 10 450 C4 600 16 700 10 800"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.45"
        />
      </svg>
    </div>
  );
}
