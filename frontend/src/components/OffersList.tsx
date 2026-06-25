import { useSuspenseQuery } from "@tanstack/react-query";

import { formatDate } from "#/lib/formatDate.ts";
import { getOffersByPostIdQueryOptions } from "#/lib/queryOptions";
import type { Offer } from "#/types.ts";

type OffersListProps = {
  postId: string;
};

export function OffersList({ postId }: OffersListProps) {
  const { data: offers } = useSuspenseQuery(
    getOffersByPostIdQueryOptions(postId),
  );

  return (
    <div>
      <div className="offers-header">
        <h2 className="card-title">Hilfsangebote ({offers.length})</h2>
      </div>

      {offers.length === 0 ? (
        <div className="empty-offers">
          <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>
            Noch keine Hilfsangebote
          </p>
          <p style={{ fontSize: 14, color: "#6b5744", margin: 0 }}>
            Sei die erste Person, die hilft!
          </p>
        </div>
      ) : (
        <div className="offers-list">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
}

type OfferCardProps = {
  offer: Offer;
};

function OfferCard({ offer }: OfferCardProps) {
  return (
    <div className="offer-card">
      <div className="offer-card-header">
        <div className="offer-author-row">
          <div className="offer-avatar">{offer.author[0].toUpperCase()}</div>
          <span className="offer-author-name">@{offer.author}</span>
        </div>
        <span className="offer-date">{formatDate(offer.createdAt)}</span>
      </div>
      <p className="offer-text">{offer.text}</p>
    </div>
  );
}
