# Frontend — Hütly

React 19 + TanStack Router (client-only, reine Vite-SPA), Vite, Tailwind CSS v4. Alle Befehle aus diesem Verzeichnis (`frontend/`) heraus ausführen.

## Arbeitsweise bei der Umsetzung

Vor der Umsetzung jedes Plan-Schritts oder Konzept-Schritts oder eines Todos wird er gemeinsam besprochen:

1. Zuerst erklären, **was** der Schritt umsetzt und **wie** (geplantes
   Vorgehen, betroffene Dateien).
2. Gibt es Empfehlungen, etwas anders als ursprünglich geplant zu machen,
   diese sofort mit Begründung nennen.
3. Explizit nachfragen, ob der Schritt so umgesetzt werden soll oder ob
   Änderungen gewünscht sind.
4. Erst wenn alle Punkte geklärt sind, explizit fragen, ob jetzt umgesetzt
   werden soll — die Umsetzung beginnt **nur nach einem Ja**.

## Automatisch generierte Dateien

`src/routeTree.gen.ts` wird automatisch von TanStack Router generiert, wenn der Vite-Dev-Server läuft. Diese Datei **niemals manuell bearbeiten** — Änderungen werden beim nächsten Start überschrieben.

`src/api/generated/` erzeugt `pnpm generate:api` (Hey API, `openapi-ts.config.ts`) aus der OpenAPI-Spec des Backends unter `../openapi/huetly-openapi.json`: TypeScript-Typen in `types.gen.ts` und zod-Schemas in `zod.gen.ts`. Die Dateien werden committet und nie von Hand bearbeitet. Ändert sich die Spec, wird neu erzeugt und beides zusammen committet.

## Code Style

- Als Props für React Komponenten immer ein Objekt verwenden, nie inline-Type
  - EIGENER TYP: `type MyComponentProps = { label: string }; function MyComponent({label}: MyComponentProps) { /* ... */ }`
  - NICHT: `function MyComponent({label}: {label: string}) { /* ... */ }`
- Für Typ-Deklarationen `type` statt `interface` verwenden
- Kein `void` vor einem Funktionsaufruf
  - NICHT: `void queryClient.invalidateQueries({ queryKey: ["posts"] });`
- In `onSuccess` von `useMutation` den Query Client über den Context (4. Methodenparameter), statt über `useQueryClient` holen:
  - `onSuccess: (_data, _vars, _result, context) => { context.client. ...; }`
  - Das Promise von `invalideQueries` aus `onSuccess` zurückliefern:
    - `onSuccess: (...) => { return context.client.invalideQueries }`
    - Wenn mehr als ein `context.client.invalidateQueries`-Aufruf in `onSuccess` durchgeführt wird, die Promises mit `Promise.all` zusammenfassen
- Statt zusammengesetzter CSS-Klassennamen mit Template Strings, `twmerge` verwenden
  - Beispiel
    - NICHT: ``className={btn-offer-submit ${isSuccess ? "success" : ""}`}``
    - MIT TWMERGE: `className={twMerge('btn-offer-submit', iSuccess && "success")}`
- Kein inline-Array mit `.map()` in JSX — Komponenten explizit ausschreiben statt dynamisch erzeugen
  - NICHT: `{(['a', 'b'] as const).map(x => <Item key={x} value={x} />)}`
  - STATTDESSEN: `<Item value="a" /><Item value="b" />`

## Überprüfen vom Code und Code Style

**Nach dem Erzeugen und Ändern von Code:** `pnpm check` ausführen — formatiert
mit Prettier, fixt ESLint-Probleme und prüft anschließend Typ-Fehler (tsc).
Achtung: verändert Dateien (Auto-Fix).

**Verfügbare Einzel-Skripte (nur prüfend, ohne Auto-Fix):**
- `check:ts`: Prüft nur Typ-Fehler (tsc)
- `check:prettier`: Prüft nur Formattierungsfehler (Prettier)
- `check:lint`: Prüft nur Linting Regeln (ESlint)
  
## Testing

Vitest mit zwei Projekten (konfiguriert in `vite.config.ts` unter `test.projects`):

| Projekt | Dateimuster | Umgebung | Tools |
|---|---|---|---|
| `unit` | `*.test.*` | jsdom | `@testing-library/react`, jest-dom-Matcher (registriert via `src/test-setup.ts`) |
| `browser` | `*.browsertest.*` | Vitest Browser Mode (Playwright/Chromium) | `vitest-browser-react`, MSW |

- `pnpm test` — alle Tests (`vitest`), im interaktiven Terminal Watch-Mode
  (Browserfenster bleibt offen); ohne TTY / mit `CI` läuft Vitest automatisch
  einmalig durch (CI, Claude-Bash, `HEADLESS=true pnpm test`)
- `pnpm test:unit` / `pnpm test:browser` — nur ein Projekt, Watch-Mode

**Automatisierte Testläufe (z. B. durch Claude) immer headless:**
`HEADLESS=true pnpm test` — sonst öffnet jeder Lauf ein sichtbares
Browserfenster (Mechanik: `headless`-Konstante in `vite.config.ts`).

**Tests nach jeder Änderung:**

1. Nach jeder Änderung `HEADLESS=true pnpm vitest run --since-last-run`. Das führt nur die Tests aus, die von der Änderung betroffen sind.
2. Nach der Reparatur eines Fehlschlags `HEADLESS=true pnpm vitest run --last-failed`.
3. Vor dem Abschluss `pnpm check:ts` und `HEADLESS=true pnpm vitest run` für alle Tests.

Eine Aufgabe ist erst fertig, wenn beides grün ist. Schlägt ein Test fehl, wird der Code repariert und nicht der Test. Ist die Änderung am Verhalten gewollt, wird vor dem Anpassen des Tests nachgefragt. Die Meldung eines Browser-Tests endet mit der Tabelle `Trace:` und zeigt den `ARIA tree`, wenn ein Locator nichts findet. Beides zuerst lesen.

**Bei unerklärlichen Ergebnissen `pnpm clean`:** alte Artefakte aus früheren Läufen (Failure-Screenshots, Traces, Vite-Cache) können das Ergebnis verfälschen. `pnpm clean` löscht auch die Aufzeichnung für `--since-last-run`, der nächste Lauf führt deshalb alle Tests aus.

**MSW in Browser-Tests:** Für API-Mocking im Browser-Projekt steht MSW
bereit. `public/mockServiceWorker.js` ist generiert (`msw init`) und
eingecheckt — nicht manuell bearbeiten.

**`render` aus `vitest-browser-react` ist asynchron** — immer `await render(...)`.

### Screenshot-Baselines (`toMatchScreenshot`)

Referenzbilder liegen in `__screenshots__/` **neben** der Testdatei und
sind eingecheckt (Referenzdaten, **kein** Build-Artefakt). Vitest hängt
ein Plattform-Suffix an (`…-chromium-darwin.png` vs.
`…-chromium-linux.png`) — macOS-Entwicklung und Linux-CI brauchen je ein
eigenes Bild.

- **darwin-Baseline** (lokal neu erzeugen): `pnpm test:browser:update`
  (= `vitest run --project browser -u`).
- **linux-Baseline** lässt sich lokal **nicht** reproduzieren — nur im
  selben Container wie die CI, damit das Bild pixelgleich ist (kein
  Font-Drift):

  ```bash
  # aus dem Repo-Root
  docker run --rm -v "$PWD/frontend":/app -v /app/node_modules -w /app \
    mcr.microsoft.com/playwright:v1.60.0-jammy \
    bash -c "corepack enable && corepack prepare pnpm@11.5.3 --activate && \
      pnpm install --frozen-lockfile --store-dir /tmp/pnpm-store && \
      HEADLESS=true pnpm exec vitest run --project browser -u"
  ```

  Das anonyme Volume `-v /app/node_modules` schützt die lokalen
  (darwin-)`node_modules`; `--store-dir /tmp/pnpm-store` verhindert ein
  `.pnpm-store`-Artefakt im Repo. Das Image-Tag **muss** zur
  installierten Playwright-Version passen.

**Failure-Screenshots getrennt von den Baselines:** Bei einem Fehlschlag
legt Vitest automatisch einen Screenshot ab (`screenshotFailures`). Er
landet unter `.vitest/attachments/failure-screenshots/`, getrennt von den
Baselines in `__screenshots__`. `__screenshots__` enthält damit nur
Referenzbilder; alle Artefakte eines Laufs sammeln sich in `.vitest/`.

`pnpm clean` löscht nur regenerierbaren Müll
(`dist`, `node_modules/.vite`, `tsconfig.tsbuildinfo`, `.vitest`,
`coverage`, `__traces__`) und lässt die getrackten Baselines
unangetastet, sicher vor jedem Vortrag.

### CI (`.github/workflows/ci.yml`)

Läuft `pnpm test` (unit + browser) **im Playwright-Container**
(Container-Pinning = deterministische Screenshots). `HEADLESS=true` ist
gesetzt; Annotations via `--reporter=github-actions`. Inline-Snapshots
(z. B. `toMatchAriaInlineSnapshot`) haben **kein** Plattform-Suffix —
plattformabhängige Inhalte (z. B. der ⌘↵/Strg+↵-Hint) gehören daher
nicht in den Accessible Name (in `OfferForm` per `aria-hidden` gelöst),
sonst wird die Linux-CI rot.

## Wichtige Patterns

### TanStack Router: Loader

`loader` in `createFileRoute` als **Methode** schreiben, nicht als Pfeil-Funktion-Property:

```ts
// ✅ richtig
createFileRoute('/posts/$postId')({
  loader({ context, params }) {
    return context.queryClient.ensureQueryData(getPostQueryOptions(params.postId))
  },
})

// ❌ falsch
createFileRoute('/posts/$postId')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(getPostQueryOptions(params.postId)),
})
```

### TanStack Query: queryFn

`queryFn` in `queryOptions` als **Methode** schreiben, nicht als Pfeil-Funktion. Hält den Diff klein und lässt Raum, bei Bedarf eine Zeile (Kommentar, `console.log`) zu ergänzen, ohne die Form umzubauen:

```ts
// ✅ richtig
queryOptions({
  queryKey: ['posts', 'list'],
  async queryFn() {
    const res = await fetch(`${BASE_URL}/api/posts`)
    return PostSchema.array().parse(await res.json())
  },
})

// ❌ falsch
queryOptions({
  queryKey: ['posts', 'list'],
  queryFn: async () => {
    const res = await fetch(`${BASE_URL}/api/posts`)
    return PostSchema.array().parse(await res.json())
  },
})
```

### TanStack Router: validateSearch

In `routes/requests/index.tsx` werden **alle** Search-Params als `optional()` definiert (kein `.default()`). Pflicht, damit `<Link to="/requests">` ohne `search`-Prop typsicher ist. Default wird im Component per `?? 'date'` gesetzt.

```ts
// ✅ in validateSearch: alles optional
const routeSearchSchema = z.object({
  orderBy: z.enum(['date', 'interested']).optional(),
  category: CategorySchema.optional(),
})

// Im Component:
const { orderBy: raw, category } = Route.useSearch()
const orderBy = raw ?? 'date'
```

### react-hook-form: Typsichere FormField-Komponenten

Wenn eine wiederverwendbare Komponente für Formularfelder eines bestimmten Formulars erstellt wird, soll `name` typsicher an den Formulartyp gebunden sein. Dazu `register` und `errors` als Props übergeben (nicht `UseFormRegisterReturn`), und den erlaubten Feldnamen per `Exclude<keyof FormType, ...>` einschränken:

```tsx
type TextFieldName = Exclude<keyof MyFormInput, 'category' | 'description'>;

type FormFieldProps = {
  name: TextFieldName;
  register: UseFormRegister<MyFormInput>;
  errors: FieldErrors<MyFormInput>;
  label: string;
  placeholder: string;
};
```

## CSS

Design Tokens sind in `styles.css` im Tailwind v4 `@theme`-Block definiert und direkt als Tailwind-Klassen nutzbar (z. B. `bg-cream`, `text-ink`, `font-display`).
