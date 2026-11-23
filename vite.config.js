import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: { port: 5185, strictPort: true },
  preview: { port: 5186, strictPort: true },
  build: { outDir: "dist" },
});
