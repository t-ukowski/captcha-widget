import React from "react";

interface CAPTCHAButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const CAPTCHAButton: React.FC<CAPTCHAButtonProps> = ({ onClick, children }) => {
  return (
    <button
      style={{
        backgroundColor: "#f8f9fa",
        color: "#5f6368",
        border: "1px solid #f1f3f4",
        borderRadius: "4px",
        padding: "10px 20px",
        fontSize: "14px",
        cursor: "pointer",
        outline: "none",
        userSelect: "none",
        margin: "5px",
        boxShadow: "1px 1px 5px rgba(0,0,0,0.1)",
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default CAPTCHAButton;
