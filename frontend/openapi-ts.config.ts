import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../openapi/huetly-openapi.json",
  output: "src/api/generated",
  plugins: ["@hey-api/typescript", "zod"],
});
