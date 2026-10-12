import { defineConfig } from "oxfmt";

export default defineConfig({
  ignorePatterns: [
    "dist/**",
    "public/**",
    "migration/**",
    "src/migration/**",
    "src/posts/**",
    ".playwright-mcp/**",
    ".sisyphus/**",
    "out/**",
    "node_modules",
    "*.mdx",
  ],
});
