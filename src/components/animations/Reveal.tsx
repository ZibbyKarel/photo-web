"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type RevealProps = React.ComponentProps<"div"> & {
  y?: number;
  stagger?: number;
  start?: string;
};

/**
 * Fade-up reveal for direct children with stagger.
 * Wrap the direct parent of the items you want to stagger — Reveal animates
 * el.children, so make sure the staggered elements are DIRECT children.
 *
 * Respects prefers-reduced-motion: animation only runs for no-preference users.
 * Content is always visible (no bare gsap.set opacity:0 outside the guard).
 */
export function Reveal({
  y = 24,
  stagger = 0.08,
  start = "top 85%",
  className,
  children,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const el = ref.current;
      if (!el) return;

      const targets = el.children.length ? Array.from(el.children) : [el];
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(targets, {
          opacity: 0,
          y,
          duration: 0.8,
          ease: "power2.out",
          stagger,
          scrollTrigger: { trigger: el, start },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
}
