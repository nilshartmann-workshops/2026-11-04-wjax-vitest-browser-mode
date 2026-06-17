# 42: Aria-Snapshot des OfferForm

## Kernaussage

Der Aria-Snapshot hält fest, was ein Screenreader sieht: Rollen, Namen und Struktur. Er bricht, wenn sich die Zugänglichkeit ändert, und nicht bei jeder CSS-Klasse.

## Ablauf

1. Test mit leerem `toMatchAriaInlineSnapshot()` schreiben, ausführen. Vitest trägt den Snapshot in den Code ein.
2. `pnpm test` im Watch-Modus starten.
3. In `OfferForm.tsx` die Beschriftung des Buttons ändern. Der Snapshot schlägt fehl.
4. Im Watch-Modus `i` drücken, das Review zeigt den Unterschied Schritt für Schritt. Mit `a` übernehmen, mit `r` verwerfen.
5. Beschriftung zurücksetzen.

## Fallstricke

- Inline-Snapshots haben kein Plattform-Suffix und laufen deshalb unverändert im CI.
- Der Hinweis ⌘↵ bzw. Strg+↵ am Button ist `aria-hidden`. Er steht im Screenshot, aber nicht im Snapshot, sonst wäre der Snapshot je Plattform verschieden.
- Findet ein Locator nichts, zeigt die Fehlermeldung den ARIA-Baum in derselben Form wie der Snapshot:

  ```
  VitestBrowserElementError: Cannot find element with locator: page.getByText('Reptil')
  ARIA tree:
  - text: 🐢 Reptil
  ```
