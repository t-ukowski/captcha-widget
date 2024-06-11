// src/index.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import CAPTCHAWidget from "./CAPTCHAWidget";

// When the DOM is fully loaded, attach the React app
document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("captcha");
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <CAPTCHAWidget onSolve={() => console.log("CAPTCHA solved")} />
    );
  }
});
