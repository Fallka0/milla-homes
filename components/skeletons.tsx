/**
 * Shimmering placeholder blocks shown while server components fetch data
 * (via App Router `loading.tsx` boundaries). Purely decorative — hidden
 * from assistive tech.
 */

export function PropertyCardSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden>
      <div className="skeleton skeleton-media" />
      <div className="skeleton-card-body">
        <div className="skeleton skeleton-line skeleton-line-sm" />
        <div className="skeleton skeleton-line skeleton-line-lg" />
        <div className="skeleton-chip-row">
          <span className="skeleton skeleton-chip" />
          <span className="skeleton skeleton-chip" />
          <span className="skeleton skeleton-chip" />
        </div>
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="property-grid" aria-hidden>
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function FiltersBarSkeleton() {
  return (
    <div className="filters-bar skeleton-filters-bar" aria-hidden>
      <span className="skeleton skeleton-search" />
      <span className="skeleton skeleton-pill" />
      <span className="skeleton skeleton-pill" />
      <span className="skeleton skeleton-pill" />
      <span className="skeleton skeleton-pill" />
    </div>
  );
}
