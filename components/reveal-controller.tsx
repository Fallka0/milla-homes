"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Global scroll-reveal controller. Observes any element carrying a
 * `data-reveal` attribute and adds `is-visible` as it enters the viewport.
 *
 * The reveal styles are gated behind `.reveal-ready` on <html>, which this
 * component adds only when motion is allowed and IntersectionObserver exists —
 * so with JavaScript disabled (or reduced motion) nothing is ever hidden.
 *
 * Lives in the root layout, which never remounts on client-side navigation —
 * so it re-scans on every pathname change and also watches the DOM for
 * late-arriving [data-reveal] elements. Anything not yet observed would
 * otherwise be stuck invisible at opacity 0.
 */
export function RevealController() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      root.classList.remove("reveal-ready");
      document
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((element) => element.classList.add("is-visible"));
      return;
    }

    root.classList.add("reveal-ready");

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            intersectionObserver.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );

    const observed = new WeakSet<Element>();
    const observeAll = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)").forEach((element) => {
        if (!observed.has(element)) {
          observed.add(element);
          intersectionObserver.observe(element);
        }
      });
    };

    observeAll();

    // Catch content that streams/mounts after this effect runs.
    const mutationObserver = new MutationObserver(observeAll);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
