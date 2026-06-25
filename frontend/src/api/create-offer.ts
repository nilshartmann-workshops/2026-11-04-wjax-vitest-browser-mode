import type { CreateOfferInput } from "#/types.ts";
import { OfferSchema } from "#/types.ts";

const BASE_URL = "http://localhost:7400";

export async function createOffer(postId: string, input: CreateOfferInput) {
  const res = await fetch(`${BASE_URL}/api/posts/${postId}/offers?slow=2400`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`Senden fehlgeschlagen (HTTP ${res.status})`);
  }
  const body = await res.json();
  return OfferSchema.parse(body);
}
