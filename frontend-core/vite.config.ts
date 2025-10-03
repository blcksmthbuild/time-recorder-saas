    import { defineConfig, loadEnv } from "vite";
    import react from "@vitejs/plugin-react";
    import federation from "@originjs/vite-plugin-federation";

    export default defineConfig(({ mode }) => {
      const env = loadEnv(mode, process.cwd(), "");
      const remoteUrl = env.VITE_TIMELOG_ENTRY ? env.VITE_TIMELOG_ENTRY : "http://timelog-plugin:80/dist/assets/remoteEntry.js";

      console.log("--------------------------------");
      console.log("TIMELOG REMOTE URL", remoteUrl);
      console.log("--------------------------------");

      return {
        plugins: [
          react(),
          federation({
            name: "core_shell",
            remotes: {
              timelog_plugin_app: remoteUrl,
            },
            shared: ["react", "react-dom", "react-router-dom", "@mui/material"],
          }),
        ],
        build: { target: "esnext" },
        server: { host: true },
      };
    });