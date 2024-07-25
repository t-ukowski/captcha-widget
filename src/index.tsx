// src/index.tsx
import React from "react";
import { Root, createRoot } from "react-dom/client";
import CAPTCHAWidget from "./CAPTCHAWidget";

let root: Root | null = null; // Keep a reference to the root

// Function to attach the CAPTCHA widget automatically to a specified element ID
const attachCAPTCHA = () => {
  // This function will attempt to attach the CAPTCHA to an element with ID 'captcha'
  const rootElement = document.getElementById("captcha");
  if (rootElement) {
    root = createRoot(rootElement);
    root.render(
      <CAPTCHAWidget onSolve={detachCAPTCHA} />
    );
  } else {
    console.error("No element with ID 'captcha' found.");
  }
};

const detachCAPTCHA = () => {
  if (root) {
    root.unmount(); // Unmounts the component
    root = null; // Clear the reference
    console.log("CAPTCHA detached and cleaned up.");
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
