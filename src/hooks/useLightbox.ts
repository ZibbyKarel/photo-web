"use client";

import { useState, useEffect, useCallback } from "react";

export type LightboxState = {
  openIndex: number | null;
  open: (index: number) => void;
  close: () => void;
  next: (total: number) => void;
  prev: (total: number) => void;
};

/**
 * Manages lightbox open/close state, keyboard navigation, and scroll lock.
 *
 * Usage:
 *   const lb = useLightbox();
 *   // Open:  lb.open(index)
 *   // Close: lb.close()
 *   // Next:  lb.next(photos.length)
 *   // Prev:  lb.prev(photos.length)
 */
export function useLightbox(): LightboxState {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const isOpen = openIndex !== null;

  // Scroll lock: save the previous overflow value and restore it on close/unmount
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenIndex(null);
      }
      // Arrow navigation handled inside the Lightbox component via callbacks
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const open = useCallback((index: number) => {
    setOpenIndex(index);
  }, []);

  const close = useCallback(() => {
    setOpenIndex(null);
  }, []);

  const next = useCallback((total: number) => {
    setOpenIndex((prev) => (prev === null ? 0 : (prev + 1) % total));
  }, []);

  const prev = useCallback((total: number) => {
    setOpenIndex((prev) => (prev === null ? 0 : (prev - 1 + total) % total));
  }, []);

  return { openIndex, open, close, next, prev };
}
