// src/CAPTCHAWidget.tsx
import React from "react";

interface CAPTCHAWidgetProps {
  onSolve: () => void;
}

const CAPTCHAWidget: React.FC<CAPTCHAWidgetProps> = ({ onSolve }) => {
  const handleSolveClick = () => {
    // Mock token generation
    const mockToken = "mock-token-" + Math.random().toString(36).substr(2, 9);

    // Dispatch custom event with the mock token
    const event = new CustomEvent("captchaSolved", {
      detail: { token: mockToken },
    });
    window.dispatchEvent(event);

    onSolve(); // Call the onSolve callback if needed
  };

  return (
    <div className="captcha-container">
      <button onClick={handleSolveClick}>Solve CAPTCHA</button>
    </div>
  );
};

export default CAPTCHAWidget;
