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
    if (rootElement && (!rootElement.dataset.initialized || root === null)) {
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
    const rootElement = document.getElementById("captcha");
    if (rootElement) rootElement.removeAttribute("data-initialized");
    root.unmount(); // Unmounts the component
    root = null; // Clear the reference
    console.log("CAPTCHA detached and cleaned up.");
  }
};

// Attach the widget once the DOM is fully loaded
const initCAPTCHA = () => {
  const rootElement = document.getElementById("captcha");
  if (rootElement) {
    // Ensure that the CAPTCHA widget is reset before attempting to attach again
    if (root) {
      detachCAPTCHA();
    }
    attachCAPTCHA();
  }
};

if (document.readyState === "complete") {
  // If document is already loaded, attach immediately
  initCAPTCHA();
} else {
  // Otherwise, listen for when the DOM is fully loaded
  document.addEventListener("DOMContentLoaded", initCAPTCHA);
}
