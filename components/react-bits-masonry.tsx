"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

import "./react-bits-masonry.css";

export type ReactBitsMasonryItem = {
  height: number;
  id: string;
  img: string;
  title: string;
  url: string;
};

type ReactBitsMasonryProps = {
  items: ReactBitsMasonryItem[];
};

function useMedia(queries: string[], values: number[], defaultValue: number) {
  const getValue = useCallback(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }

    return values[queries.findIndex((query) => window.matchMedia(query).matches)] ?? defaultValue;
  }, [defaultValue, queries, values]);
  const [value, setValue] = useState<number>(getValue);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handler = () => setValue(getValue);

    const mediaQueries = queries.map((query) => window.matchMedia(query));
    mediaQueries.forEach((mediaQuery) => mediaQuery.addEventListener("change", handler));

    return () => {
      mediaQueries.forEach((mediaQuery) => mediaQuery.removeEventListener("change", handler));
    };
  }, [getValue, queries]);

  return value;
}

function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0 });

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect;
      setSize({ width });
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return [ref, size] as const;
}

async function preloadImages(urls: string[]) {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const image = new Image();
          image.src = src;
          image.onload = image.onerror = () => resolve();
        }),
    ),
  );
}

type GridItem = ReactBitsMasonryItem & {
  h: number;
  w: number;
  x: number;
  y: number;
};

export function ReactBitsMasonry({ items }: ReactBitsMasonryProps) {
  const columns = useMedia(
    ["(min-width: 1500px)", "(min-width: 1100px)", "(min-width: 800px)"],
    [4, 3, 2],
    1,
  );
  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [imagesReady, setImagesReady] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    // Don't hold the whole grid hostage to the slowest photo: wait briefly so
    // cached images animate in fully painted, but cap it so the layout always
    // appears fast and late images simply fade onto their shimmer background.
    let cancelled = false;
    const timeout = new Promise<void>((resolve) => setTimeout(resolve, 600));
    Promise.race([preloadImages(items.map((item) => item.img)), timeout]).then(() => {
      if (!cancelled) {
        setImagesReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [items]);

  const grid = useMemo<GridItem[]>(() => {
    if (!width) {
      return [];
    }

    const gap = 18;
    const columnHeights = new Array(columns).fill(0);
    const totalGaps = (columns - 1) * gap;
    const columnWidth = (width - totalGaps) / columns;

    return items.map((item) => {
      const columnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      const x = columnIndex * (columnWidth + gap);
      const h = item.height;
      const y = columnHeights[columnIndex];

      columnHeights[columnIndex] += h + gap;

      return {
        ...item,
        x,
        y,
        w: columnWidth,
        h,
      };
    });
  }, [columns, items, width]);

  const contentHeight = useMemo(() => {
    if (grid.length === 0) {
      return 0;
    }

    return Math.max(...grid.map((item) => item.y + item.h));
  }, [grid]);

  useLayoutEffect(() => {
    if (!imagesReady) {
      return;
    }

    grid.forEach((item, index) => {
      const selector = `[data-masonry-key="${item.id}"]`;
      const animationProps = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
      };

      if (!hasMounted.current) {
        // No entrance choreography: tiles are placed instantly and the
        // section's standard scroll reveal handles the fade-up. GSAP only
        // animates *relayouts* (column-count or container-width changes).
        gsap.set(selector, { opacity: 1, ...animationProps });
      } else {
        gsap.to(selector, {
          ...animationProps,
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    });

    hasMounted.current = true;
  }, [grid, imagesReady]);

  return (
    <div
      ref={containerRef}
      className="rb-masonry"
      style={{ height: contentHeight > 0 ? `${contentHeight}px` : undefined }}
    >
      {grid.map((item) => (
        <div
          key={item.id}
          data-masonry-key={item.id}
          className="rb-masonry-item"
          onClick={() => {
            window.location.assign(item.url);
          }}
        >
          <div className="rb-masonry-image" style={{ backgroundImage: `url(${item.img})` }} />
          <div className="rb-masonry-overlay">
            <span>{item.title}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
