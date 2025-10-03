import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from '@originjs/vite-plugin-federation';

const TIMELOG_REMOTE_URL = process.env.VITE_TIMELOG_ENTRY as string;


  console.log("--------------------------------");
  console.log("TIMELOG REMOTE URL", TIMELOG_REMOTE_URL);
  console.log("--------------------------------");

export default defineConfig({
    plugins: [
    react(),
    federation({
      name: 'core_shell',
      remotes: {
        timelog_plugin_app: TIMELOG_REMOTE_URL, 
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@mui/material'],
    }),
    
  ],
  build: {
    target: 'esnext',
  },
  server: {
    host: true, 
  },
});
