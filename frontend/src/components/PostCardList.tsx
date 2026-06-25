import type { Post } from "#/types.ts";

import { PostCard } from "./PostCard";

type PostCardListProps = { posts: Post[] };

export function PostCardList({ posts }: PostCardListProps) {
  return (
    <div className="posts-grid">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
