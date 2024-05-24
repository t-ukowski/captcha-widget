// src/CAPTCHAWidget.tsx
import React from "react";

interface CAPTCHAWidgetProps {
  onSolve: () => void;
}

const CAPTCHAWidget: React.FC<CAPTCHAWidgetProps> = ({ onSolve }) => {
  const handleSolveClick = () => {
    onSolve();
  };

  return (
    <div className="captcha-container">
      <button onClick={handleSolveClick}>Solve CAPTCHA</button>
    </div>
  );
};

export default CAPTCHAWidget;
