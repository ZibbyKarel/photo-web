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
        gsap.set(targets, { opacity: 0, y });

        let revealed = false;
        const reveal = () => {
          if (revealed) return;
          revealed = true;
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger,
            overwrite: "auto",
          });
        };

        ScrollTrigger.create({
          trigger: el,
          start,
          onEnter: reveal,
          onEnterBack: reveal,
          // Anchor jumps / scroll restoration can land us already past `start`
          // without an onEnter ever firing. On every (re)compute, if we're at or
          // beyond the start, reveal — guarantees content is never stuck hidden.
          onRefresh: (self) => {
            if (self.scroll() >= self.start) reveal();
          },
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
