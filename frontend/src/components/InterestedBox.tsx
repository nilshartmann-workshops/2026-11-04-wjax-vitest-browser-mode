import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { getPostQueryOptions } from "#/lib/queryOptions";
import { PostSchema } from "#/types.ts";

const BASE_URL = "http://localhost:7400";

async function incrementInterested(id: string) {
  const res = await fetch(`${BASE_URL}/api/posts/${id}/interested`, {
    method: "PUT",
  });
  const body = await res.json();
  return PostSchema.parse(body);
}

type InterestedBoxProps = {
  postId: string;
};

export function InterestedBox({ postId }: InterestedBoxProps) {
  const { data: post } = useSuspenseQuery(getPostQueryOptions(postId));
  const mutation = useMutation({
    mutationFn: () => incrementInterested(postId),
    onSuccess: (data, _vars, _result, context) => {
      context.client.setQueryData(getPostQueryOptions(postId).queryKey, data);
    },
  });

  const interested = post.interested;

  const interestedHot = interested > 10;
  const style = {
    background: interestedHot ? "#fce8dc" : "#fdf8f2",
    borderColor: interestedHot ? "#e8835a60" : "#f5ede060",
  };

  return (
    <div className="interested-box" style={style}>
      <div>
        <div className="interested-box-title">
          <InterestedIcon animating={mutation.isPending} /> {interested} Person
          {interested !== 1 ? "en" : ""} interessiert
        </div>
        <div className="interested-box-sub">
          {interested > 15
            ? "Sehr beliebt! Schnell sein lohnt sich."
            : "Meld dich auch, wenn du helfen kannst!"}
        </div>
      </div>
      <button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="btn-primary interested-btn"
      >
        <span
          className={mutation.isPending ? "interested-btn-label-hidden" : ""}
        >
          Ich bin interessiert!
        </span>
        {mutation.isPending && (
          <span className="interested-run" style={{ fontSize: 16 }}>
            🐢
          </span>
        )}
      </button>
    </div>
  );
}

type InterestedIconProps = { animating: boolean };

function InterestedIcon({ animating }: InterestedIconProps) {
  return <span className={animating ? "heartbeat" : ""}>🤝</span>;
}
