/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite";

// Für Live-Demos: bremst jede Playwright-Aktion
// um die angegebenen Millisekunden.
const slowMo = 500;

// Browser-Tests ohne sichtbares Browserfenster ausführen:
// HEADLESS=true pnpm test
const headless = process.env.HEADLESS === "true";

// Playwright-Trace der Browser-Tests (neuesten Trace öffnen mit
// `pnpm test:trace`; einzelnen mit `pnpm dlx playwright show-trace <zip>`):
//   "on"                – immer, für jeden Test
//   "retain-on-failure" – nur bei Fehlschlag behalten
//   "off"               – aus
// Lokal aus; im CI "on", damit für die Demo immer Traces als Artifact
// entstehen.
const trace = process.env.CI ? "on" : "off";

// Trace View von Vitest, unabhängig vom Provider
const traceView = "failure-only";

const browsers: ("chromium" | "firefox" | "webkit")[] = ["chromium"];

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [tailwindcss(), tanstackRouter(), viteReact()],
  test: {
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      include: ["src/**"],
      reporter: ["text", "html"],
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          setupFiles: ["src/test-setup.ts"],
          include: ["src/**/*.test.?(c|m)[jt]s?(x)"],
        },
      },
      {
        extends: true,
        // Test-Dependencies vorab bundeln — verhindert, dass der
        // Vite-Optimizer sie erst mitten im Testlauf entdeckt und
        // nachbundelt (führt sonst zu zwei React-Kopien im Browser).
        optimizeDeps: {
          include: ["vitest-browser-react", "msw/browser"],
        },
        test: {
          name: "browser",
          setupFiles: ["src/browser-setup.ts"],
          include: ["src/**/*.browsertest.?(c|m)[jt]s?(x)"],
          browser: {
            enabled: true,
            headless,
            trace,
            traceView,
            provider: playwright({ launchOptions: { slowMo } }),
            // https://vitest.dev/guide/browser/playwright
            instances: browsers.map((browser) => ({ browser })),
          },
        },
      },
    ],
  },
});

export default config;
