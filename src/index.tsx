import React from "react";
import { createRoot } from "react-dom/client";
import CAPTCHAWidget from "./CAPTCHAWidget";

// Function to manually attach the CAPTCHA widget to a specified element ID
export const attachCAPTCHA = (elementId: string = "captcha") => {
  const rootElement = document.getElementById(elementId);
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <CAPTCHAWidget onSolve={() => console.log("CAPTCHA solved")} />
    );
  } else {
    console.error("Failed to find element with ID:", elementId);
  }
};

// Auto-attach functionality for use with simple script tag inclusion
if (document.readyState === "complete") {
  // If document is already loaded, we attach immediately
  attachCAPTCHA();
} else {
  // Otherwise, we wait for the DOM to be fully loaded
  document.addEventListener("DOMContentLoaded", () => {
    attachCAPTCHA();
  });
}

// Export CAPTCHAWidget as a default export to support importing into React components
export default CAPTCHAWidget;

// Optional: Export a custom React hook for more integrated React setups
export const useCAPTCHA = (
  elementId: string = "captcha",
  onSolve: () => void
) => {
  React.useEffect(() => {
    attachCAPTCHA(elementId);
    return () => {
      const rootElement = document.getElementById(elementId);
      if (rootElement) {
        // Cleanup the CAPTCHA component from the DOM to prevent memory leaks
        const root = createRoot(rootElement);
        root.unmount();
      }
    };
  }, [elementId]);

  return {
    solve: () => onSolve(),
  };
};
