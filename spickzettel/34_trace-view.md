# 34: Trace View von Vitest

## Kernaussage

Vitest zeichnet jede Aktion und Assertion eines Browser-Tests selbst auf, mit DOM-Snapshot je Schritt. Dafür braucht es kein Playwright und kein externes Werkzeug.

## Ablauf

1. In `vite.config.ts` die Konstante `traceView` von `"failure-only"` (Standard, nur fehlgeschlagene Tests) auf `"on"` setzen (jeder Test, mit DOM-Snapshot je Schritt).
2. Den Viewport-Test in der UI starten und öffnen:

   ```bash
   pnpm vitest --ui src/components/PostList-preload.browsertest.tsx
   ```

   - Links die Schritte mit Locator und Dauer, rechts der DOM-Snapshot. Das Element des Schritts ist blau markiert.
   - Umschalten zwischen DOM und Aria.
   - „Open trace viewer“ öffnet die große Ansicht.
3. Test rot machen: in `PostCard.tsx` `preload="viewport"` in `preload="intent"` ändern.
4. Im Terminal steht unter dem Fehler die Tabelle der Schritte:

   ```
   Trace:
     step                locator                                               start  duration  location
     react.render        page                                                  +62ms         -  ...:65:18
     toBeVisible         page.getByText('6 Gesuche gefunden')                  +89ms     291ms  ...:71:16
     not.toBeInViewport  page.getByRole('link', { name: 'Gesuch Nummer 1' })  +393ms      11ms  ...:74:16
     toBeInViewport      page.getByRole('link', { name: 'Gesuch Nummer 1' })  +414ms      15ms  ...:81:16
   ```

5. Zurücksetzen: `git checkout -- src/components/PostCard.tsx`

## Abgrenzung zum Playwright-Trace

| | `traceView` von Vitest | `trace` von Playwright |
|---|---|---|
| Provider | alle | nur Playwright |
| Ansicht | Vitest UI, HTML-Report, Terminal | Playwright Trace Viewer |
| Format | DOM-Snapshots | `.trace.zip` |
| Netzwerk und Konsole | nein | ja |

Beide lassen sich gleichzeitig einschalten.

- Der Playwright-Trace entsteht im CI, weil `trace` in `vite.config.ts` dort auf `"on"` steht.
- Geöffnet wird er mit `pnpm test:trace`, das den neuesten Trace im Playwright Trace Viewer zeigt.
- Er zeigt zusätzlich Netzwerk und Konsole, funktioniert aber nur mit dem Provider Playwright.

## Bei Nachfrage: eigene Marker

`await page.mark("preload beim Scrollen")` setzt einen Marker. Er erscheint als eigener Schritt in der Trace View von Vitest und im Playwright-Trace. Mit einer Funktion als zweitem Argument fasst er die Schritte darin zu einer Gruppe zusammen.

## Fallstricke

- `scrollIntoView()` am DOM-Element ist keine Aktion von Vitest und erscheint deshalb nicht als Schritt.
- Für CI schreibt `vitest run --reporter=html` einen Report nach `.vitest/`, der die Traces enthält. Öffnen mit `npx vite preview --outDir .vitest`.
- Den Schalter `--browser.traceView` auf der Kommandozeile nicht verwenden. Er hat beim Ausprobieren die Projekte durcheinandergebracht, die Konstante in der Config ist sicher.
