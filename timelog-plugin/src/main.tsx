import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TimeLogApp from "./TimeLogApp.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TimeLogApp />
  </StrictMode>
);
