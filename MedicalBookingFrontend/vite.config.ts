import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 8080;

if (rawPort && (Number.isNaN(port) || port <= 0)) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH || "/";

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: [
      {
        find: /^.*api-client-react\/src\/index\.js$/,
        replacement: path.resolve(import.meta.dirname, "api-client-react", "src", "index.ts"),
      },
      {
        find: /^.*api-client-react\/src\/custom-fetch\.js$/,
        replacement: path.resolve(import.meta.dirname, "api-client-react", "src", "custom-fetch.ts"),
      },
      {
        find: "@",
        replacement: path.resolve(import.meta.dirname, "src"),
      },
      {
        find: "@assets",
        replacement: path.resolve(import.meta.dirname, "public", "attached_assets"),
      },
    ],
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    cors: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    proxy: {
      "^/api/": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
