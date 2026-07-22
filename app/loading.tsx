import { PropertyGridSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="site-shell section-stack">
      <div className="hero-v2">
        <div className="skeleton skeleton-hero" aria-hidden />
        <div className="hero-cta-row">
          <span className="skeleton skeleton-cta-card" aria-hidden />
          <span className="skeleton skeleton-cta-card" aria-hidden />
          <span className="skeleton skeleton-cta-card" aria-hidden />
        </div>
      </div>
      <section className="section">
        <PropertyGridSkeleton count={3} />
      </section>
    </main>
  );
}
