import { macaronVitePlugin } from "@macaron-css/vite";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import viteCompression from "vite-plugin-compression";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    macaronVitePlugin(),
    solid(),
    splitVendorChunkPlugin(),
    viteCompression({
      algorithm: "brotliCompress",
    }),
  ],
});
