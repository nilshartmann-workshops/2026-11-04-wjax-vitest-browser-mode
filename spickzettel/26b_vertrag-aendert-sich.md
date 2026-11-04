# 26b: Das Backend ändert den Vertrag

## Ablauf

1. In der Spec im Schema `Offer` das Feld `text` in `message` umbenennen (Property und `required`).
2. `pnpm generate:api`
3. `pnpm check:ts` meldet die Abweichung im Test und in der App:
   - `OfferForm.browsertest.tsx`: `'text' does not exist in type 'Offer'`, der Mock ist veraltet.
   - `OffersList.tsx`: `Property 'text' does not exist`, die App ist veraltet.
4. Zurücksetzen: `git checkout -- ../openapi src/api/generated`

## Fallstricke

- In diesem Stand sind `tsc` und der Test zum Absenden rot. `OfferSchema.parse` lehnt die Antwort des Mocks ab, weil `message` fehlt.
