# Vitest Browser Mode Beispiel-Anwendung

Dieses Repository enthält den Code für meinen Vortrag zum "Vitest Browser Mode"

![Screenshot der Beispiel-Anwendung "hütly"](./screenshot.png)

## Inhalt

- Migration React Testing Library / JSDOM auf Vitest
- Mock Service Worker (MSW)
- Benefits von Browser Tests: Viewport / Scroll-Verhalten testen
- Visual Regression Testing
- Einbinden in CI-Pipeline (GitHub)

## Branches

Es gibt Branches mit unterschiedlichen Ständen:

- `main`: Ausgangsbasis mit einem Test in React Testing Library
- `schritte`: Fertige Anwendung mit allen Tests und Features
- `live_coding`: Code, der während des Vortrags entstanden ist.

Im `schritte`-Branch lohnt die **Commit-Ansicht**: hier findest du die einzelnen Themen des Talks jeweils ein einzelnen Commits. Wenn du dir die Diff-Ansicht ansiehst, sieht du an vielen Stellen auch Kommentare mit einigen Erläuterungen.

# Ausführen

**1. Repository klonen**

**2. Im Verzeichnis `frontend` die Packages installieren**

```bash
  cd frontend
  pnpm install
```

**3. Tests ausführen**

Ggf. vorher gewünschten Commit von `schritte`-Branch auschecken.

```bash
  cd frontend
  pnpm test
```

## Anwendung ansehen

Falls du dir die Anwendung ansehen willst, die wir hier testen, musst du zusätzlich das Backend starten:

**1. Im Verzeichnis `backend` Packages installieren und starten**

Im `backend`-Verzeichnis das Express-Backend mit der "REST" API starten (Port 7400 muss frei sein)

```bash
  cd backend
  pnpm install
  pnpm start
```

**2. Frontend starten**

Im `frontend`-Verzeichnis den Vite-Server mit der Anwendung starten (Port 3000):

 ```bash
   cd frontend
   pnpm dev
```

**3. App aufrufen**

Im Browser: http://localhost:3000

# Code-Disclaimer

- **AI:** Teile des Codes habe ich mit Claude Code gemacht. Das betrifft insbesondere die Beispiel-Daten, einige React-Komponenten und den CSS-Code. 
- **Keine Best-practices**: Der Code ist so strukturiert, dass er für Live Demos und Live Coding für mich funktioniert. Es ist kein Beispiel für beste Code-Organisation von React-Anwendungen!

# Kontakt

- Wenn Du Fragen, Anmerkungen oder Feedback hast hier findest du hier meine Kontaktdaten: https://nilshartmann.net/kontakt
- Wenn Du Interesse an Workshops oder Schulungen hast, findest du hier weitere Informationen: https://nilshartmann.net/react-workshops

Viel Spaß! 
