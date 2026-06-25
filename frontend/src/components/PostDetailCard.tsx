import { twMerge } from "tailwind-merge";

import { CategoryBadge } from "#/components/CategoryBadge";
import { InterestedBox } from "#/components/InterestedBox";
import Markdown from "#/components/Markdown.tsx";
import { getCategoryConfig } from "#/config/category-config.ts";
import { formatDate } from "#/lib/formatDate.ts";
import type { Post } from "#/types.ts";

type PostDetailCardProps = {
  post: Post;
};

export function PostDetailCard({ post }: PostDetailCardProps) {
  const cat = getCategoryConfig(post.category);

  return (
    <div className="post-detail-card" style={{ borderColor: `${cat.color}60` }}>
      <div
        className={twMerge("post-detail-header", `category-${post.category}`)}
      >
        <div className="post-detail-header-row">
          <CategoryBadge category={post.category} size="lg" />
          <span className="post-detail-date">{formatDate(post.createdAt)}</span>
        </div>
        <h1 className="post-detail-title">{post.title}</h1>
        <p className="post-detail-author">von @{post.author}</p>
      </div>

      <div className="post-detail-body">
        <Markdown
          className={"post-description prose"}
          content={post.description}
        />

        <div className="info-grid">
          <InfoGridItem icon="📍" label="Ort" value={post.location} />
          <InfoGridItem icon="⏱️" label="Zeitraum" value={post.timeframe} />
          <InfoGridItem icon="🐾" label="Tier/Pflanze" value={post.animal} />
        </div>

        <InterestedBox postId={post.id} />
      </div>
    </div>
  );
}

type InfoGridItemProps = { icon: string; label: string; value: string };

function InfoGridItem({ icon, label, value }: InfoGridItemProps) {
  return (
    <div className="info-grid-item">
      <div className="info-grid-icon">{icon}</div>
      <div className="info-grid-label">{label}</div>
      <div className="info-grid-value">{value}</div>
    </div>
  );
}
