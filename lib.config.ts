import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import dts from 'vite-plugin-dts';
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    checker({
      typescript: true,
    }),
    react(),
dts({insertTypesEntry: true}),
  ],

  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/Wordcloud.tsx"),
      name: "Wordcloud",
      formats: ["cjs", "es"],
      // the proper extensions will be added
      fileName: "wordcloud",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
        },
      },
    },
  },
});
