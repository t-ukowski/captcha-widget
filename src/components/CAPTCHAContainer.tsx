import React, { useState, useEffect } from "react";

interface CAPTCHAContainerProps {
  children: React.ReactNode;
}

const CAPTCHAContainer: React.FC<CAPTCHAContainerProps> = ({ children }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 480);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    padding: isSmallScreen ? "2px" : "5px", // Adjust padding for small screens
  };

  const styledDivStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid lightgray",
    padding: isSmallScreen ? "10px" : "15px", // Adjust padding for small screens
    margin: isSmallScreen ? "2px" : "5px", // Adjust margin for small screens
    boxSizing: "border-box",
    maxWidth: "100%",
    width: isSmallScreen ? "100%" : "auto", // Full width on small screens
  };

  return (
    <div className="captcha-container" style={containerStyle}>
      <div className="styled-div" style={styledDivStyle}>
        {children}
      </div>
    </div>
  );
};

export default CAPTCHAContainer;
