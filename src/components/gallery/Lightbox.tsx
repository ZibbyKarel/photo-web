"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { GalleryPhoto } from "@/lib/gallery";

type LightboxProps = {
  photos: GalleryPhoto[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

/**
 * Fullscreen lightbox overlay with keyboard navigation (ArrowLeft/Right/Escape).
 * Clicking the backdrop closes the lightbox.
 * Swipe is not implemented — keeping the component focused and simple.
 */
export function Lightbox({ photos, currentIndex, onClose, onNext, onPrev }: LightboxProps) {
  const photo = photos[currentIndex];
  const total = photos.length;
  const ta = useTranslations("a11y");

  // Arrow key navigation (Escape is handled in useLightbox)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrev]);

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Lightbox — ${photo.alt}`}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 py-6">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label={ta("closeLightbox")}
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Previous button */}
        <button
          onClick={onPrev}
          aria-label={ta("prevPhoto")}
          className="absolute top-1/2 left-2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Next button */}
        <button
          onClick={onNext}
          aria-label={ta("nextPhoto")}
          className="absolute top-1/2 right-2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative flex max-h-[calc(100vh-6rem)] max-w-[calc(100vw-7rem)] items-center justify-center sm:max-w-[calc(100vw-8rem)]">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            {...(photo.blurDataURL
              ? { placeholder: "blur" as const, blurDataURL: photo.blurDataURL }
              : {})}
            className="h-auto max-h-[calc(100vh-6rem)] max-w-full object-contain"
            sizes="(min-width: 1024px) 80vw, 90vw"
            priority
          />
        </div>

        {/* Counter */}
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/50">
          {currentIndex + 1} / {total}
        </p>
      </div>
    </div>
  );
}
