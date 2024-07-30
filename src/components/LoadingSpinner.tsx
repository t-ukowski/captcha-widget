import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div style={spinnerContainerStyle}>
      <div style={spinnerStyle}></div>
    </div>
  );
};

const spinnerContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  width: "100%",
  position: "relative",
};

const spinnerStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
  border: "4px solid rgba(0, 0, 0, 0.1)",
  borderTop: "4px solid #4285f4",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const spinnerAnimation = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;

document.styleSheets[0].insertRule(
  spinnerAnimation,
  document.styleSheets[0].cssRules.length
);

export default LoadingSpinner;
