import { z } from "zod/v4";

import { zCategory, zOffer, zPost } from "#/api/generated/zod.gen";

// Die Schemas der Antworten erzeugt `pnpm generate:api` aus der OpenAPI-Spec
// des Backends.
export const CategoryIdSchema = zCategory;
export type CategoryId = z.infer<typeof CategoryIdSchema>;

export const PostSchema = zPost;
export type Post = z.infer<typeof PostSchema>;

export const OfferSchema = zOffer;
export type Offer = z.infer<typeof OfferSchema>;

export const CreateOfferSchema = z.object({
  author: z.string().min(1, "Benutzername darf nicht leer sein."),
  text: z.string().min(1, "Hilfsangebot darf nicht leer sein."),
});
export type CreateOfferInput = z.infer<typeof CreateOfferSchema>;

/**
 * POST /api/posts
 * Neues Gesuch erstellen.
 */
export const CreatePostSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  description: z.string().min(1),
  animal: z.string().min(1),
  timeframe: z.string().min(1),
  location: z.string().min(1),
  category: CategoryIdSchema,
});
export type CreatePostInput = z.infer<typeof CreatePostSchema>;
