"use client";

import { useEffect, useRef, useState } from "react";

import { buildGallerySrcSet } from "@/lib/share-images";
import { formatShareTemplate, type ShareCopy } from "@/lib/share-copy";

type ShareGalleryProps = {
  copy: ShareCopy;
  images: string[];
  title: string;
};

// A CSS scroll-snap strip rather than a carousel library: swiping is handled by
// the browser's own momentum scrolling, which is smoother on a phone than any
// JS implementation and costs nothing on the LCP path. The script here only
// drives the counter and the desktop arrows — with JS disabled the gallery
// still scrolls and every photo is still reachable.
export function ShareGallery({ copy, images, title }: ShareGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    let frame = 0;

    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const index = Math.round(track.scrollLeft / track.clientWidth);
        setActiveIndex(Math.min(Math.max(index, 0), images.length - 1));
      });
    };

    track.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", handleScroll);
    };
  }, [images.length]);

  function scrollByOne(direction: -1 | 1) {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    track.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
  }

  const hasMultiple = images.length > 1;

  return (
    <section className="share-gallery" aria-roledescription="carousel" aria-label={title}>
      <div className="share-gallery-track" ref={trackRef}>
        {images.map((image, index) => {
          const { src, srcSet } = buildGallerySrcSet(image);
          const isMain = index === 0;

          return (
            <figure className="share-gallery-slide" key={`${image}-${index}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- next/image is
                  globally unoptimized in this project; sizing is done by the photo
                  host instead (see lib/share-images.ts). */}
              <img
                alt={formatShareTemplate(copy.gallery.imageAlt, { title, index: index + 1 })}
                className="share-gallery-image"
                decoding={isMain ? "sync" : "async"}
                fetchPriority={isMain ? "high" : "low"}
                height={900}
                loading={isMain ? "eager" : "lazy"}
                sizes="(max-width: 900px) 100vw, 900px"
                src={src}
                srcSet={srcSet}
                width={1200}
              />
            </figure>
          );
        })}
      </div>

      {hasMultiple ? (
        <>
          <button
            aria-label={copy.gallery.previous}
            className="share-gallery-arrow share-gallery-arrow-prev"
            disabled={activeIndex === 0}
            onClick={() => scrollByOne(-1)}
            type="button"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            aria-label={copy.gallery.next}
            className="share-gallery-arrow share-gallery-arrow-next"
            disabled={activeIndex === images.length - 1}
            onClick={() => scrollByOne(1)}
            type="button"
          >
            <span aria-hidden="true">›</span>
          </button>

          <p className="share-gallery-counter" aria-live="polite">
            {formatShareTemplate(copy.gallery.counter, {
              current: activeIndex + 1,
              total: images.length,
            })}
          </p>

          <div className="share-gallery-dots" aria-hidden="true">
            {images.map((image, index) => (
              <span
                className={`share-gallery-dot${index === activeIndex ? " is-active" : ""}`}
                key={`${image}-dot-${index}`}
              />
            ))}
          </div>

          <p className="share-gallery-hint">{copy.gallery.swipeHint}</p>
        </>
      ) : null}
    </section>
  );
}
