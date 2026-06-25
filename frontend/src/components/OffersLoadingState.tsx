export function OffersLoadingState() {
  return (
    <div role="status" aria-label="Hilfsangebote werden geladen…">
      <div className="offers-header">
        <h2 className="card-title">Hilfsangebote</h2>
      </div>

      <div className="offers-list">
        <OfferCardSkeleton />
        <OfferCardSkeleton />
        <OfferCardSkeleton />
      </div>
    </div>
  );
}

function OfferCardSkeleton() {
  return (
    <div className="offer-card offer-card-skeleton">
      <div className="offer-card-header">
        <div className="offer-author-row">
          <div className="skeleton-avatar" />
          <div className="skeleton-line skeleton-author" />
        </div>
        <div className="skeleton-line skeleton-date" />
      </div>
      <div className="skeleton-line skeleton-text" />
      <div className="skeleton-line skeleton-text skeleton-text-short" />
    </div>
  );
}
