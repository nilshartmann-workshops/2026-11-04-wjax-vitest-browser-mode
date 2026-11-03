# 26a: Typsichere MSW-Handler aus der OpenAPI-Spec

## Ablauf

1. `openapi/huetly-openapi.json` kurz zeigen, Schema `Offer`.
2. `frontend/openapi-ts.config.ts` zeigen: Hey API erzeugt Typen und zod-Schemas, `pnpm generate:api`.
3. `src/api/generated/zod.gen.ts` zeigen, dann `src/types.ts`: die App prüft jede Antwort mit dem erzeugten Schema.
4. Im Test den Handler typisieren, die Typargumente erklärt der Kommentar im Test.
5. `createdAt` im Handler löschen: `tsc` meldet, dass `createdAt` in `Offer` fehlt. Wieder einfügen. Der Generator läuft dafür nicht, denn die Spec bleibt unverändert.

## Kernaussage

Ein Mock ist nur so gut wie seine Übereinstimmung mit dem echten Backend. Die Typen des Handlers kommen deshalb aus derselben OpenAPI-Spec wie die Typen der App. Ändert das Backend seinen Vertrag, wird `tsc` im Test rot, bevor ein Test läuft.

## Einstieg: das Backend als Black Box

- Für den Browser-Test ist das Backend eine Black Box, MSW ersetzt es. Ob dahinter Express oder Spring Boot steht, spielt keine Rolle.
- Der Vertrag ist `openapi/huetly-openapi.json`. Im Java-Projekt erzeugt SpringDoc die Datei im Build (`springdoc-openapi-maven-plugin`), sie wird eingecheckt.
- Im Repo ist das Backend Express, die Spec liegt fertig vor.

## Fallstricke

- Ohne die Typparameter an `http.post` nimmt MSW jedes Objekt an. Liefert der Handler eine falsche Form, löst `OfferSchema.parse` in der App eine Exception aus, und der Test schlägt erst zur Laufzeit mit einer unklaren Meldung fehl.
- Die Formular-Schemas mit den deutschen Meldungen (`CreateOfferSchema`) bleiben von Hand geschrieben. Sie gehören zur Validierung im Formular, nicht zum Vertrag mit dem Backend.
