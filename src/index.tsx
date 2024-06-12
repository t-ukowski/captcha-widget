// src/index.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import CAPTCHAWidget from "./CAPTCHAWidget";

// Function to attach the CAPTCHA widget automatically to a specified element ID
const attachCAPTCHA = () => {
  // This function will attempt to attach the CAPTCHA to an element with ID 'captcha'
  const rootElement = document.getElementById("captcha");
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <CAPTCHAWidget onSolve={() => console.log("CAPTCHA solved")} />
    );
  } else {
    console.error("No element with ID 'captcha' found.");
  }
};

// Attach the widget once the DOM is fully loaded
if (document.readyState === "complete") {
  // If document is already loaded, attach immediately
  attachCAPTCHA();
} else {
  // Otherwise, listen for when the DOM is fully loaded
  document.addEventListener("DOMContentLoaded", () => {
    attachCAPTCHA();
  });
}
