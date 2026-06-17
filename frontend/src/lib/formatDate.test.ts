import { expect, test } from "vitest";

import { formatDate } from "./formatDate.ts";

test("formatiert ein ISO-Datum als deutsches Datum", () => {
  const formattedDate = formatDate("2026-06-01");

  expect(formattedDate).toBe("1. Juni 2026");
});
