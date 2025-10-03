import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

const PLUGIN_PORT = 8083;

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "ai_agent_plugin_app",
      filename: "remoteEntry.js",
      exposes: {
        "./AIAgentApp": "./src/AIAgentApp.tsx",
      },
      shared: ["react", "react-dom", "react-router-dom", "@mui/material"],
    }),
  ],
  server: {
    port: PLUGIN_PORT,
    host: true,
    cors: {
      origin: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    },
  },
  build: {
    target: "esnext",
    outDir: "dist",
  },
});
