import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // expone en la red
    port: 5173,        // mismo puerto que venías usando
  },
});
