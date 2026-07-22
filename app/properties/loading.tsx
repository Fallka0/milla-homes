import { FiltersBarSkeleton, PropertyGridSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="site-shell section-stack">
      <div className="properties-intro-minimal">
        <span className="skeleton skeleton-line skeleton-heading" aria-hidden />
      </div>
      <div className="listing-page">
        <FiltersBarSkeleton />
        <PropertyGridSkeleton count={9} />
      </div>
    </main>
  );
}
