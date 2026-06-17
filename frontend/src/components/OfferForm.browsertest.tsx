import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { OfferForm } from "./OfferForm.tsx";

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
