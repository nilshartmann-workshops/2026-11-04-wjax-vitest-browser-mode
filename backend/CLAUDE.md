# Backend — Hütly

Express.js + TypeScript, In-Memory-Datenhaltung, Port 7400. TypeScript wird via Node.js 24 nativ ausgeführt (`--strip-types`, kein Compile-Schritt, kein `tsx`). Alle Befehle aus diesem Verzeichnis (`backend/`) heraus ausführen.

## TypeScript-Import-Konventionen

Das Backend läuft als ESM-Modul (`"type": "module"`) mit Node.js 24 nativem Type-Stripping. Daraus folgen drei Regeln:

- **Lokale Imports mit `.ts`-Extension** — `import x from "./foo.ts"` statt `"./foo"` oder `"./foo.js"`. Node lädt die `.ts`-Dateien direkt; kompilierte `.js`-Dateien existieren nicht.
- **Typ-only-Imports zwingend mit `type` markieren** — `import { type Request, type Response }` oder `import type { Foo }`. Ohne `type` wirft Node nach dem Stripping einen Runtime-Fehler, weil der Export nicht existiert.
- **`req.params`-Werte explizit casten** — `@types/express` v5 typisiert `req.params[key]` als `string | string[]`. Bei benannten Route-Parametern (z. B. `req.params.id`) `as string` verwenden.

## Demo-Konventionen

- **Slow-Middleware:** Query-Parameter `?slow` verzögert jede Antwort. Ohne Wert 1200 ms, mit Wert `?slow=3000` entsprechend. Greift global vor allen Route-Handlern.
- **ID-Präfixe:** Posts erhalten fortlaufend `r1, r2, …`, Offers `o1, o2, …` (siehe `nextPostId` / `nextOfferId` in `src/data.ts`).
