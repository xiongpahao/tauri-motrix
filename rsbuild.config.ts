import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSvgr } from "@rsbuild/plugin-svgr";
import path from "path";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [pluginReact(), pluginSvgr()],

  html: {
    template: "./index.html",
  },
  source: {
    entry: {
      index: "./src/main.tsx",
    },
  },
  server: {
    port: 1420,
    strictPort: true,
    host,
  },
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
  dev: {
    client: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
  },
  tools: {
    rspack: {
      watchOptions: {
        ignored: ["**/src-tauri/**"],
      },
    },
  },
});
