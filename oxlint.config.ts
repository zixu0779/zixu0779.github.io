import { defineConfig } from "oxlint";

export default defineConfig({
  ignorePatterns: ["public/**", "migration/**", "migrate.mjs", "adapt.mjs"],
  categories: {
    correctness: "error",
    suspicious: "error",
    perf: "warn",
  },
  rules: {
    "no-underscore-dangle": [
      "error",
      {
        allow: ["_id", "_title", "_passwordPlaceholder", "_submitText", "_errorText"],
      },
    ],
  },
});
