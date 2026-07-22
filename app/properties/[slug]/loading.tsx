export default function Loading() {
  return (
    <main className="site-shell section-stack">
      <div className="detail-loading" aria-hidden>
        <div className="skeleton skeleton-detail-media" />
        <div className="detail-loading-body">
          <span className="skeleton skeleton-line skeleton-line-sm" />
          <span className="skeleton skeleton-line skeleton-heading" />
          <span className="skeleton skeleton-line skeleton-line-lg" />
          <div className="skeleton-chip-row">
            <span className="skeleton skeleton-chip" />
            <span className="skeleton skeleton-chip" />
            <span className="skeleton skeleton-chip" />
          </div>
          <span className="skeleton skeleton-line" />
          <span className="skeleton skeleton-line" />
          <span className="skeleton skeleton-line skeleton-line-lg" />
        </div>
      </div>
    </main>
  );
}
