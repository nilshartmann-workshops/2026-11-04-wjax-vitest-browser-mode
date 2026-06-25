/**
 * Formatiert ein ISO-Datum als deutsches Langdatum, z. B.
 * "2026-06-01T12:00:00.000Z" → "1. Juni 2026".
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
