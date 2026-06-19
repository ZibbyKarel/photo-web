"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Signature scroll-line: a fixed SVG organic curve on the left edge that
 * "draws" itself as the user scrolls, led by a glowing dot that rides the
 * line's leading edge — a clear scroll-progress indicator.
 *
 * - Visible only on md+ (hidden on mobile via Tailwind).
 * - Animation only for (prefers-reduced-motion: no-preference) users.
 * - Reduced-motion: the path is shown fully drawn and the dot is hidden.
 * - The dot is positioned in real pixels (mapped from the path's user space)
 *   so the non-uniform SVG stretch never distorts it into an ellipse.
 */
const VIEW_W = 24;
const VIEW_H = 800;

export function ScrollLine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const container = containerRef.current;
      const path = pathRef.current;
      const dot = dotRef.current;
      if (!container || !path || !dot) return;

      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len });

      // Map a point in the path's user space (VIEW_W × VIEW_H) onto the rendered
      // container, which is stretched with preserveAspectRatio="none".
      const placeDot = (progress: number) => {
        const pt = path.getPointAtLength(len * progress);
        const x = (pt.x / VIEW_W) * container.clientWidth;
        const y = (pt.y / VIEW_H) * container.clientHeight;
        dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      };

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const state = { p: 0 };
        gsap.set(path, { strokeDashoffset: len });
        gsap.set(dot, { opacity: 1 });
        placeDot(0);

        gsap.to(state, {
          p: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.5, invalidateOnRefresh: true },
          onUpdate: () => {
            path.style.strokeDashoffset = String(len * (1 - state.p));
            placeDot(state.p);
          },
          onRefresh: () => placeDot(state.p),
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(path, { strokeDashoffset: 0 });
        gsap.set(dot, { opacity: 0 });
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-3 z-30 hidden h-screen w-10 md:block lg:left-6"
    >
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        fill="none"
      >
        {/* soft underlay for presence */}
        <path
          d="M12 0 C2 160 22 320 12 470 C2 620 22 710 12 800"
          stroke="var(--color-accent)"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.12"
        />
        <path
          ref={pathRef}
          d="M12 0 C2 160 22 320 12 470 C2 620 22 710 12 800"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.6"
        />
      </svg>

      {/* Glowing leading dot — real-pixel positioned, never distorted. */}
      <div
        ref={dotRef}
        className="bg-accent absolute top-0 left-0 h-2.5 w-2.5 rounded-full opacity-0"
        style={{ boxShadow: "0 0 12px 2px var(--color-accent)" }}
      />
    </div>
  );
}
