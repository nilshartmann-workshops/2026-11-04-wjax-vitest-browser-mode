# 36: Folie: Vitest Browser Mode, Playwright und Selenium

## Kernaussage

Vitest Browser Mode ersetzt keinen End-to-End-Test. Er läuft im Browser neben der Komponente und testet sie mit gemocktem Backend. Playwright dient ihm nur als Provider, der den Browser startet und echte Eingaben auslöst. Playwright Test und Selenium steuern dagegen von außen eine laufende Anwendung.

## Vergleich

| | Vitest Browser Mode | Playwright Test | Selenium |
|---|---|---|---|
| Art | Komponenten- und Integrationstest | End-to-End-Test | End-to-End-Test |
| Testcode läuft | im Browser, neben der Komponente | in Node, steuert den Browser von außen | in der JVM (oder einer anderen Sprache), steuert über WebDriver |
| Gegen | einzelne Komponente oder ganze App aus dem Vite-Build, Backend per MSW | laufende Anwendung mit echtem Backend | laufende Anwendung mit echtem Backend |
| Importiert Code der App | ja: Komponenten, Hooks, Schemas | nein | nein |
| Warten | automatisch über `expect.element` | automatisch | von Hand mit `WebDriverWait` |
| Runner | derselbe wie für Unit-Tests | eigener | JUnit, TestNG, ... |

## Einordnung für Java-Leute

- Vitest Browser Mode entspricht einem `@SpringBootTest` mit gemockten Nachbarn: realistisch, aber abgegrenzt und schnell.
- Playwright und Selenium entsprechen einem Test gegen die deployte Anwendung mit Testcontainers für alles Weitere.
- Die Pyramide bleibt: viele Tests im Browser Mode, wenige End-to-End-Tests für die wichtigsten Abläufe.

## Was Playwright im Browser Mode beiträgt

- Startet Chromium, Firefox oder WebKit (`instances` in `vite.config.ts`).
- Löst Eingaben über das DevTools-Protokoll aus, deshalb sind `click`, `fill` und Tastatur echte Ereignisse des Browsers und keine simulierten DOM-Events wie in jsdom.
- Trace, `slowMo` und Screenshots kommen vom Provider.
- Statt Playwright lässt sich WebdriverIO als Provider einsetzen. Der Testcode bleibt derselbe.
