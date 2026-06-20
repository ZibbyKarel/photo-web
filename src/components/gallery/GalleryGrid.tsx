"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useLightbox } from "@/hooks/useLightbox";
import { Lightbox } from "./Lightbox";
import type { GalleryPhoto } from "@/lib/gallery";

type GalleryGridProps = {
  photos: GalleryPhoto[];
};

/**
 * Masonry gallery grid using CSS columns.
 * Client component — manages lightbox state on click.
 *
 * Vertical spacing is applied via mb-3 on each item (CSS columns don't support row-gap).
 */
export function GalleryGrid({ photos }: GalleryGridProps) {
  const lb = useLightbox();
  const ta = useTranslations("a11y");

  const handleNext = () => lb.next(photos.length);
  const handlePrev = () => lb.prev(photos.length);

  return (
    <>
      {/* Masonry grid */}
      <div className="columns-1 gap-3 sm:columns-2 lg:columns-3">
        {photos.map((photo, index) => (
          <div key={photo.src} className="mb-3 break-inside-avoid overflow-hidden">
            <button
              onClick={() => lb.open(index)}
              className="group focus-visible:outline-accent-strong relative block w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label={ta("openPhoto", { alt: photo.alt })}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                {...(photo.blurDataURL
                  ? { placeholder: "blur" as const, blurDataURL: photo.blurDataURL }
                  : {})}
                loading="lazy"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            </button>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lb.openIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={lb.openIndex}
          onClose={lb.close}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </>
  );
}
