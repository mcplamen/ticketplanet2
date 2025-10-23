import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

export default defineConfig({
  plugins: [svelte()],
//  root: "./packages", // там, където е main.entry.js
  build: {
    outDir: "../dist", // изходна папка за билд
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
	host: 'localhost',
    strictPort: true,
    proxy: {
      "/auth": "http://localhost:3000",
      "/events": "http://localhost:3000",
      "/upload": "http://localhost:3000",
      "/tickets": "http://localhost:3000",
    },
  },
});
