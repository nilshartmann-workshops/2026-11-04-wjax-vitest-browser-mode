import { Link } from "@tanstack/react-router";

import { CategoryBadge } from "#/components/CategoryBadge";
import { InterestedButton } from "#/components/InterestedButton";
import { getCategoryConfig } from "#/config/category-config.ts";
import { formatDate } from "#/lib/formatDate.ts";
import type { Post } from "#/types.ts";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const cat = getCategoryConfig(post.category);

  return (
    <article className="post-card">
      <div className="post-card-header">
        <CategoryBadge category={post.category} />
        <span className="post-card-date">{formatDate(post.createdAt)}</span>
      </div>

      <h3 className="post-card-title">
        <Link
          to="/posts/$postId"
          params={{ postId: post.id }}
          preload="viewport"
          className="inline-block bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[transform,background-size,letter-spacing] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.015] hover:bg-[length:100%_2px] hover:tracking-[0.01em]"
        >
          {post.title}
        </Link>
      </h3>

      <div className="post-card-meta">
        <MetaRow icon="📍" text={post.location} />
        <MetaRow icon="⏱️" text={post.timeframe} />
        <MetaRow icon="🐾" text={post.animal} />
      </div>

      <div
        className="post-card-footer"
        style={{ borderColor: `${cat.color}80` }}
      >
        <span className="post-card-author">von @{post.author}</span>
        <InterestedButton postId={post.id} count={post.interested} />
      </div>
    </article>
  );
}

type MetaRowProps = { icon: string; text: string };

function MetaRow({ icon, text }: MetaRowProps) {
  return (
    <div className="meta-row">
      <span className="meta-icon">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
