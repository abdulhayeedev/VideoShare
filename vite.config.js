import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 3001,
    // allowedHosts: ["6688-39-34-175-147.ngrok-free.app"],
  },
});
