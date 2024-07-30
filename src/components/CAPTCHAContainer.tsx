import React from "react";

interface CAPTCHAContainerProps {
  children: React.ReactNode;
}

const CAPTCHAContainer: React.FC<CAPTCHAContainerProps> = ({ children }) => {
  return (
    <div
      className="captcha-container"
      style={{ display: "flex", justifyContent: "center", padding: "10px" }}
    >
      <div
        className="styled-div"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid lightgray",
          padding: "20px",
          margin: "10px",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default CAPTCHAContainer;
