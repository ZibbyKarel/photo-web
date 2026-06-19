"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ParallaxProps = {
  children: React.ReactNode;
  amount?: number;
  className?: string;
};

/**
 * Subtle parallax wrapper: shifts content by `amount` yPercent as the element
 * scrolls out of view. Intended for hero background images.
 *
 * Only animates for (prefers-reduced-motion: no-preference) users.
 * Reduced-motion users see no transform.
 */
export function Parallax({ children, amount = 15, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(el, {
          yPercent: amount,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
