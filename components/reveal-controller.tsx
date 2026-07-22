"use client";

import { useEffect } from "react";

/**
 * Global scroll-reveal controller. Observes any element carrying a
 * `data-reveal` attribute and adds `is-visible` as it enters the viewport.
 *
 * The reveal styles are gated behind `.reveal-ready` on <html>, which this
 * component adds only when motion is allowed and IntersectionObserver exists —
 * so with JavaScript disabled (or reduced motion) nothing is ever hidden.
 */
export function RevealController() {
  useEffect(() => {
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    root.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return null;
}
