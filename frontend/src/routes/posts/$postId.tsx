import { createFileRoute, Link } from "@tanstack/react-router";

import { PostDetailPage } from "#/components/PostDetailPage";
import { getPostQueryOptions } from "#/lib/queryOptions";

export const Route = createFileRoute("/posts/$postId")({
  loader({ context, params }) {
    return context.queryClient.ensureQueryData(
      getPostQueryOptions(params.postId),
    );
  },
  component: PostDetailRoute,
});

function PostDetailRoute() {
  const { postId } = Route.useParams();

  return (
    <div
      className="page-wrapper-md"
      style={{ paddingTop: 40, paddingBottom: 40 }}
    >
      <Link to="/posts" className="back-link">
        ← Zurück zur Liste
      </Link>
      <PostDetailPage postId={postId} />
    </div>
  );
}
