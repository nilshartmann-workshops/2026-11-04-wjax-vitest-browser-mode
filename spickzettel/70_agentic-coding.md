# 70: Browser-Tests als Guardrail für einen Agenten

## Kernaussage

Je mehr der Agent ändert, desto wichtiger sind Tests, die er selbst ausführen kann: schnell, headless, deterministisch und mit Meldungen, die er lesen kann. Vitest Browser Mode liefert das, ohne laufendes Backend.

## Ablauf

1. `frontend/CLAUDE.md`, Abschnitt „Tests nach jeder Änderung“ zeigen:
   - `--since-last-run` führt nur die Tests aus, die von der Änderung betroffen sind. Git ist dafür nicht nötig, verglichen werden die Änderungszeiten der Dateien.
   - `--last-failed` führt nach einer Reparatur nur die fehlgeschlagenen Tests aus.
   - Vor dem Abschluss laufen alle Tests.
   - Der Agent repariert den Code und nicht den Test. Ist die Änderung am Verhalten gewollt, fragt er nach.
2. Claude Code starten, entweder in der Sandbox (`./run-claude-session.sh`) oder lokal im Verzeichnis `frontend/`.
3. Prompt:

   > In der Liste der Gesuche lädt jede Karte die Detailseite vor, sobald sie sichtbar wird. Das erzeugt zu viele Requests. Lade sie erst vor, wenn die Maus über der Karte ist.

4. Claude ändert in `PostCard.tsx` `preload="viewport"` in `preload="intent"` und führt die Tests aus. Der Viewport-Test schlägt fehl.
5. Zeigen, dass Claude die Meldung liest (Tabelle `Trace:`, `toBeInViewport` rot) und nachfragt, statt den Test anzupassen.
6. Zurücksetzen: `git checkout -- src/components/PostCard.tsx`

## Was die Meldungen für einen Agenten taugen

- Findet ein Locator nichts, zeigt Vitest den ARIA-Baum des Teilbaums. Der Agent sieht, welche Rollen und Namen es wirklich gibt.
- Die Tabelle `Trace:` zeigt die Schritte bis zum Fehler mit Locator, Dauer und Zeile.
- Failure-Screenshots liegen unter `.vitest/attachments/failure-screenshots/`. Ein Agent, der Bilder lesen kann, schaut sie sich an.

## Fallstricke

- Ohne `HEADLESS=true` öffnet jeder Lauf ein Browserfenster, und `slowMo` bremst jede Aktion.
- `--since-last-run` ist experimentell. Im Projekt `browser` führt es beim Ausprobieren trotzdem jedes Mal alle Browser-Tests aus, nur im Projekt `unit` lässt es unveränderte Tests aus. Der Agent testet damit eher zu viel als zu wenig.
- `pnpm clean` löscht die Aufzeichnung für `--since-last-run`.
- Für die Sandbox muss `.claude-sandbox/sandbox.config` vorhanden sein (`install.sh` der Sandbox). Vorher einmal starten.
- Die Arbeitsweise in `frontend/CLAUDE.md` verlangt, dass Claude vor der Umsetzung nachfragt. Live mit „Ja, setz um“ bestätigen.
