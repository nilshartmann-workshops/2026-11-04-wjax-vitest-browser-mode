import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { PostCardList } from "#/components/PostCardList";
import { getPostsQueryOptions } from "#/lib/queryOptions";

export const Route = createFileRoute("/posts/")({
  component: PostsPage,
});

function PostsPage() {
  const { data: posts } = useSuspenseQuery(getPostsQueryOptions());

  const now = new Date();
  console.log(
    "[PostsPage] render —",
    `${now.toLocaleTimeString("de-DE", { hour12: false })}.${String(now.getMilliseconds()).padStart(3, "0")}`,
  );

  return (
    <div className="page-wrapper" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title" style={{ marginBottom: 6 }}>
          Alle Gesuche
        </h1>
        <p style={{ color: "#6b5744", fontSize: 15, margin: 0 }}>
          {posts.length} Gesuch{posts.length !== 1 ? "e" : ""} gefunden
        </p>
      </div>

      <PostCardList posts={posts} />
    </div>
  );
}
