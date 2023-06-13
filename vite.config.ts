import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    checker({
      typescript: true,
    }),
    react(),
  ],
  build: {
    outDir: "build",
  },
  test: {
    includeSource: ["src/**/*.{js,ts}"],
  },
});
