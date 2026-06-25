//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";
import unusedImports from "eslint-plugin-unused-imports";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import importPlugin from "eslint-plugin-import";
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

// During the workshop this can be set to "false" in order to not
// get annoying messages due to import statements in wrong order
const enableImportRules = false;

const importRules = enableImportRules
  ? {
      "unused-imports/no-unused-imports": "error",
      "simple-import-sort/imports": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
    }
  : {};

export default defineConfig([
  globalIgnores([
    "dist",
    ".output",
    "src/api/generated",
    "eslint.config.js",
    "prettier.config.js",
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      //      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
      import: importPlugin,
    },
    rules: {
      "import/no-cycle": "off",
      "import/order": "off",
      "sort-imports": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/require-await": "off",
      "pnpm/json-enforce-catalog": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/method-signature-style": "off",
      "prefer-const": "off",
      "no-shadow": "off",
      // Leeres Pattern als Fixture-Parameter erlauben (Vitest/Playwright test.extend)
      "no-empty-pattern": ["error", { allowObjectPatternsAsParameters: true }],
      ...importRules,
    },
  },
]);
