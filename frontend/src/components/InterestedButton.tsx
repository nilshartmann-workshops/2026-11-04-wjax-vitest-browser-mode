import { useMutation } from "@tanstack/react-query";

import { PostSchema } from "#/types.ts";

const BASE_URL = "http://localhost:7400";

type InterestedButtonProps = { postId: string; count: number };

export function InterestedButton({ postId, count }: InterestedButtonProps) {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${BASE_URL}/api/posts/${postId}/interested?slow=3000`,
        {
          method: "PUT",
        },
      );
      const body = await res.json();
      return PostSchema.parse(body);
    },
    onSuccess: (_data, _vars, _result, context) => {
      return context.client.invalidateQueries({
        queryKey: ["posts", "list"],
      });
    },
  });

  const isPending = mutation.isPending;

  return (
    <button
      type="button"
      onClick={() => mutation.mutate()}
      disabled={isPending}
      className="interested-chip"
    >
      {isPending ? (
        <span className="interested-run" style={{ fontSize: 13 }}>
          🐢
        </span>
      ) : (
        <>
          <span className="interested-emoji" style={{ fontSize: 13 }}>
            🤝
          </span>
          {count} interessiert
        </>
      )}
    </button>
  );
}
