import { QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";
import { afterAll, afterEach, beforeAll, expect, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";

import { createQueryClient } from "#/create-query-client.tsx";
import { routeTree } from "#/routeTree.gen.ts";
import type { Post } from "#/types.ts";

class PostsBackend {
  readonly posts: Post[];
  // Handler als Spy: zählt mit, welche Detail-Posts vorgeladen wurden
  readonly detailRequests: string[] = [];

  constructor(postCount: number) {
    this.posts = Array.from({ length: postCount }, (_, i) =>
      this.buildPost(i + 1),
    );
  }

  handlers() {
    return [
      http.get("http://localhost:7400/api/posts", () => {
        return HttpResponse.json(this.posts);
      }),
      http.get("http://localhost:7400/api/posts/:postId", ({ params }) => {
        this.detailRequests.push(String(params.postId));
        return HttpResponse.json(
          this.posts.find((p) => p.id === params.postId),
        );
      }),
    ];
  }

  private buildPost(no: number): Post {
    return {
      id: `p-${no}`,
      title: `Gesuch Nummer ${no}`,
      author: "nils",
      description: `Beschreibung für Gesuch ${no}`,
      animal: "Landschildkröte",
      timeframe: "1.–15. Juli",
      location: "Hamburg",
      category: "reptil",
      interested: no,
      createdAt: "2026-06-01T10:00:00.000Z",
    };
  }
}

const backend = new PostsBackend(6);
const worker = setupWorker(...backend.handlers());

beforeAll(() => worker.start());
afterEach(() => worker.resetHandlers());
afterAll(() => worker.stop());

// 🔎 Zeigen:
// - http://localhost:3000/posts
// - Viewport klein machen
// - Nach unten scrollen
// - Netzwerkverkehr zeigen
test("lädt die Detail-Route vor, sobald die Karte beim Scrollen sichtbar wird", async () => {
  // kleiner Viewport: die Karten liegen unterhalb des sichtbaren Bereichs
  await page.viewport(1024, 200);

  const queryClient = createQueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    history: createMemoryHistory({ initialEntries: ["/posts"] }),
  });

  const screen = await render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  await expect.element(screen.getByText("6 Gesuche gefunden")).toBeVisible();

  const firstCardLink = screen.getByRole("link", { name: "Gesuch Nummer 1" });
  await expect.element(firstCardLink).not.toBeInViewport();

  // nicht ans Seitenende scrollen (scrollTo(0, scrollHeight) zeigt nur den
  // Footer, die Links rauschen durch den 200px-Viewport) — gezielt scrollen:
  firstCardLink.element().scrollIntoView();
  await expect.element(firstCardLink).toBeInViewport();

  // sichtbar gewordene Karte → ihr Detail wurde vorgeladen
  await expect.poll(() => backend.detailRequests).toContain("p-1");
  // Gegenbeweis: Karte 6 war nie sichtbar → kein Preload
  expect(backend.detailRequests).not.toContain("p-6");
});
