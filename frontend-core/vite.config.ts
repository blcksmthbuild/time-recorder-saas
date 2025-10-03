    import { defineConfig, loadEnv } from "vite";
    import react from "@vitejs/plugin-react";
    import federation from "@originjs/vite-plugin-federation";

    export default defineConfig(({ mode }) => {
      const env = loadEnv(mode, process.cwd(), "");
      const remoteUrlTimeLog = env.VITE_TIMELOG_ENTRY ? env.VITE_TIMELOG_ENTRY : "http://localhost:8082/dist/assets/remoteEntry.js";
      const remoteUrlAiAgent = env.VITE_AI_AGENT_ENTRY ? env.VITE_AI_AGENT_ENTRY : "http://localhost:8083/dist/assets/remoteEntry.js";

      console.log("--------------------------------");
      console.log("TIMELOG REMOTE URL", remoteUrlTimeLog);
      console.log("AI AGENT REMOTE URL", remoteUrlAiAgent);
      console.log("--------------------------------");

      return {
        plugins: [
          react(),
          federation({
            name: "core_shell",
            remotes: {
              timelog_plugin_app: remoteUrlTimeLog,
              ai_agent_plugin_app: remoteUrlAiAgent,
            },
            shared: ["react", "react-dom", "react-router-dom", "@mui/material"],
          }),
        ],
        build: { target: "esnext" },
        server: { host: true },
      };
    });