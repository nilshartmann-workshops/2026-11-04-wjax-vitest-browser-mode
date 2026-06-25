import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";

import { OfferForm } from "#/components/OfferForm";
import { OffersList } from "#/components/OffersList";
import { PostDetailCard } from "#/components/PostDetailCard";
import { PostDetailLoadingIndicator } from "#/components/PostDetailLoadingIndicator";
import { getPostQueryOptions } from "#/lib/queryOptions";

type PostDetailPageProps = {
  postId: string;
};

export function PostDetailPage({ postId }: PostDetailPageProps) {
  return (
    <Suspense fallback={<PostDetailLoadingIndicator />}>
      <PostDetail postId={postId} />
    </Suspense>
  );
}

type PostDetailProps = {
  postId: string;
};

function PostDetail({ postId }: PostDetailProps) {
  const { data } = useSuspenseQuery(getPostQueryOptions(postId));

  return (
    <>
      <PostDetailCard post={data} />
      <OfferForm postId={postId} />
      <OffersList postId={postId} />
    </>
  );
}
