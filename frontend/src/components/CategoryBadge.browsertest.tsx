import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";

import { CategoryBadge } from "./CategoryBadge.tsx";

test("Badge sieht aus wie das Referenzbild", async () => {
  // 💡 Mit Vitest Browser Mode testen wir isolierte KOMPONENTEN visuell,
  //    nicht ganze SEITEN → deutlich geringere Flakiness.
  await page.viewport(1280, 720);

  const screen = await render(<CategoryBadge category="reptil" />);

  await expect.element(screen.getByText(/Reptil/)).toMatchScreenshot();
});
