import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { delay, http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";
import { afterAll, afterEach, beforeAll, expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { OfferForm } from "./OfferForm.tsx";

// REIHENFOLGE:
//  1. Echte App zeigen -> Netzwerkrequest
//  BACKEND STOPPEN!!!!
//  2. spyOn entfernen, Test ausführen -> Netzwerk geht nicht
//  3. MSW ergänzen -> Netzwerk-Request zeigen
const worker = setupWorker(
  http.post("http://localhost:7400/api/posts/:postId/offers", async () => {
    await delay(); // macht den Pending-Zustand beobachtbar
    return HttpResponse.json({
      id: "o-1",
      postId: "p-1",
      author: "cat_lover_99",
      text: "Ich übernehme das gerne!",
      createdAt: "2026-06-17T10:00:00.000Z",
    });
  }),
);

beforeAll(() => worker.start());
afterEach(() => worker.resetHandlers());
afterAll(() => worker.stop());

test("sendet das Formular ab und leert das Formular", async () => {
  const screen = await render(
    <QueryClientProvider client={new QueryClient()}>
      <OfferForm postId="p-1" />
    </QueryClientProvider>,
  );

  await screen.getByLabelText("Dein Benutzername").fill("cat_lover_99");
  await screen
    .getByLabelText("Dein Hilfsangebot")
    .fill("Ich übernehme das gerne!");

  await userEvent.keyboard("{ControlOrMeta>}{Enter}{/ControlOrMeta}");

  await expect
    .element(screen.getByRole("button", { name: "Hilfsangebot abschicken" }))
    .toBeVisible();
  await expect
    .element(screen.getByLabelText("Dein Benutzername"))
    .toHaveValue("");
});

test("zeigt Validierungsfehler und räumt sie beim Ausfüllen wieder ab", async () => {
  const screen = await render(
    <QueryClientProvider client={new QueryClient()}>
      <OfferForm postId="p-1" />
    </QueryClientProvider>,
  );

  // wie ein unsicherer Nutzer durchs Formular tabben → onTouched-Validierung
  // echter Klick am Locator, in RTL fokussiert el.click() nicht, dafür braucht es user.click(el)
  await screen.getByLabelText("Dein Benutzername").click();

  await expect
    .element(screen.getByLabelText("Dein Benutzername"))
    .toHaveFocus();

  await userEvent.tab(); // verlässt Benutzername → Fehler, Fokus: Hilfsangebot
  await expect
    .element(screen.getByText("Benutzername darf nicht leer sein."))
    .toBeVisible();

  await userEvent.tab(); // verlässt Hilfsangebot → Fehler
  await expect
    .element(screen.getByText("Hilfsangebot darf nicht leer sein."))
    .toBeVisible();

  // Felder per Label füllen → Re-Validierung onChange räumt die Fehler ab
  await screen.getByLabelText("Dein Benutzername").fill("cat_lover_99");
  await screen
    .getByLabelText("Dein Hilfsangebot")
    .fill("Ich übernehme das gerne!");

  await expect
    .element(screen.getByText("Benutzername darf nicht leer sein."))
    .not.toBeInTheDocument();
});
