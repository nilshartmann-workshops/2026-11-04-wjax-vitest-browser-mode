import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test } from "vitest";

import { OfferForm } from "./OfferForm.tsx";

afterEach(cleanup);

test("zeigt Validierungsfehler und räumt sie beim Ausfüllen wieder ab", async () => {
  const user = userEvent.setup();
  render(
    <QueryClientProvider client={new QueryClient()}>
      <OfferForm postId="p-1" />
    </QueryClientProvider>,
  );

  await user.click(screen.getByLabelText("Dein Benutzername"));
  expect(screen.getByLabelText("Dein Benutzername")).toHaveFocus();

  await user.tab();
  expect(
    await screen.findByText("Benutzername darf nicht leer sein."),
  ).toBeVisible();

  await user.tab();
  expect(
    await screen.findByText("Hilfsangebot darf nicht leer sein."),
  ).toBeVisible();

  await user.type(screen.getByLabelText("Dein Benutzername"), "cat_lover_99");
  await user.type(
    screen.getByLabelText("Dein Hilfsangebot"),
    "Ich übernehme das gerne!",
  );

  expect(
    screen.queryByText("Benutzername darf nicht leer sein."),
  ).not.toBeInTheDocument();
});
