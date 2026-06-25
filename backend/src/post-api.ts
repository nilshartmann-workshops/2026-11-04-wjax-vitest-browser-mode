import { Router, type Request, type Response } from "express";
import { posts, offers, nextOfferId, nextPostId, type Category, type Post } from "./data.ts";

const router = Router();

const VALID_ORDER_BY = ["date", "interested"] as const;
const VALID_CATEGORIES: Category[] = ["katze", "hund", "reptil", "pflanze", "sonstiges"];

router.get("/posts", (req: Request, res: Response) => {
  const orderBy = (req.query.orderBy as string) ?? "date";
  const category = req.query.category as string | undefined;

  if (!VALID_ORDER_BY.includes(orderBy as (typeof VALID_ORDER_BY)[number])) {
    res.status(400).json({ error: "Invalid orderBy value. Allowed: date, interested" });
    return;
  }

  if (category !== undefined && !VALID_CATEGORIES.includes(category as Category)) {
    res.status(400).json({ error: `Invalid category value. Allowed: ${VALID_CATEGORIES.join(", ")}` });
    return;
  }

  let result = [...posts];

  if (category) {
    result = result.filter((p) => p.category === category);
  }

  if (orderBy === "interested") {
    result.sort((a, b) => b.interested - a.interested);
  } else {
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json(result);
});

router.post("/posts", (req: Request, res: Response) => {
  const fields = ["title", "author", "description", "animal", "timeframe", "location", "category"] as const;
  const errors: { field: string; message: string }[] = [];

  for (const field of fields) {
    const value = req.body[field];
    if (!value || String(value).trim() === "") {
      errors.push({ field, message: `${field} is required` });
    }
  }

  const { category } = req.body;
  if (category && !VALID_CATEGORIES.includes(category as Category)) {
    errors.push({ field: "category", message: `Invalid category. Allowed: ${VALID_CATEGORIES.join(", ")}` });
  }

  if (errors.length > 0) {
    res.status(400).json(errors);
    return;
  }

  const newPost: Post = {
    id: nextPostId(),
    title: String(req.body.title).trim(),
    author: String(req.body.author).trim(),
    description: String(req.body.description).trim(),
    animal: String(req.body.animal).trim(),
    timeframe: String(req.body.timeframe).trim(),
    location: String(req.body.location).trim(),
    category: category as Category,
    interested: 0,
    createdAt: new Date().toISOString(),
  };

  posts.unshift(newPost);
  res.status(201).json(newPost);
});

router.get("/posts/:id", (req: Request, res: Response) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(post);
});

router.put("/posts/:id/interested", (req: Request, res: Response) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  post.interested += 1;
  res.json(post);
});

router.get("/posts/:id/offers", (req: Request, res: Response) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const result = offers
    .filter((o) => o.postId === req.params.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(result);
});

router.post("/posts/:id/offers", (req: Request, res: Response) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const { author, text } = req.body;
  const errors: { field: string; message: string }[] = [];

  if (!author || String(author).trim() === "") {
    errors.push({ field: "author", message: "author is required" });
  }
  if (!text || String(text).trim() === "") {
    errors.push({ field: "text", message: "text is required" });
  }

  if (errors.length > 0) {
    res.status(400).json(errors);
    return;
  }

  const newOffer = {
    id: nextOfferId(),
    postId: req.params.id as string,
    author: String(author).trim(),
    text: String(text).trim(),
    createdAt: new Date().toISOString(),
  };

  offers.push(newOffer);
  res.status(201).json(newOffer);
});

router.post("/newsletter", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

export default router;
