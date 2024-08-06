// src/index.tsx
import React from "react";
import { Root, createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import CAPTCHAWidget from "./CAPTCHAWidget";

// Create a QueryClient instance
const queryClient = new QueryClient();

let root: Root | null = null; // Keep a reference to the root

let debounceTimer: string | number | NodeJS.Timeout | undefined;
const attachCAPTCHA = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const rootElement = document.getElementById("captcha");
    if (rootElement && !rootElement.dataset.initialized) {
      console.log("attaching captcha!");
      rootElement.dataset.initialized = "true"; // Mark as initialized
      root = createRoot(rootElement);
      root.render(
        <QueryClientProvider client={queryClient}>
          <CAPTCHAWidget onSolve={detachCAPTCHA} />
        </QueryClientProvider>
      );
    }
  }, 60); // Adjust the timing based on your context
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
