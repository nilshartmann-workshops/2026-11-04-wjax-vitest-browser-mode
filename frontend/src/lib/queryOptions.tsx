import { queryOptions } from "@tanstack/react-query";

import { OfferSchema, PostSchema } from "#/types.ts";

const BASE_URL = "http://localhost:7400";

export const getPostsQueryOptions = () =>
  queryOptions({
    queryKey: ["posts", "list"],
    async queryFn() {
      const res = await fetch(`${BASE_URL}/api/posts`);
      const body = await res.json();
      return PostSchema.array().parse(body);
    },
  });

export const getPostQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["posts", "detail", postId],
    async queryFn() {
      const res = await fetch(`${BASE_URL}/api/posts/${postId}?slow=0`);
      const body = await res.json();
      const post = PostSchema.parse(body);
      return post;
    },
  });

export const getOffersByPostIdQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["offers", "list", postId],
    async queryFn() {
      const res = await fetch(`${BASE_URL}/api/posts/${postId}/offers?slow=0`);
      const body = await res.json();
      return OfferSchema.array().parse(body);
    },
  });
