"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type CardScrollerProps = {
  children: ReactNode;
  className?: string;
  nextLabel: string;
  previousLabel: string;
};

const chevron = (
  <svg fill="none" height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

export function CardScroller({ children, className = "", nextLabel, previousLabel }: CardScrollerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    setCanScrollBack(track.scrollLeft > 8);
    setCanScrollForward(track.scrollLeft + track.clientWidth < track.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateScrollState();

    const track = trackRef.current;
    if (!track) {
      return;
    }

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(track);
    return () => observer.disconnect();
  }, [updateScrollState]);

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  };

  const hasOverflow = canScrollBack || canScrollForward;

  return (
    <div className={`card-scroller ${className}`}>
      <div className="card-scroller-track" ref={trackRef} onScroll={updateScrollState}>
        {children}
      </div>
      {hasOverflow ? (
        <div className="card-scroller-controls">
          <button
            aria-label={previousLabel}
            className="card-scroller-arrow card-scroller-arrow-back"
            disabled={!canScrollBack}
            onClick={() => scrollByPage(-1)}
            type="button"
          >
            {chevron}
          </button>
          <button
            aria-label={nextLabel}
            className="card-scroller-arrow"
            disabled={!canScrollForward}
            onClick={() => scrollByPage(1)}
            type="button"
          >
            {chevron}
          </button>
        </div>
      ) : null}
    </div>
  );
}
