import React, { useState, useEffect, useRef } from "react";

interface CAPTCHAContainerProps {
  children: React.ReactNode;
}

const CAPTCHAContainer: React.FC<CAPTCHAContainerProps> = ({ children }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 480);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 480);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const preventTouchScroll = (e: TouchEvent) => {
      e.preventDefault();
    };

    const containerElement = containerRef.current;

    if (containerElement && window.innerWidth <= 480) {
      containerElement.addEventListener("touchstart", preventTouchScroll, {
        passive: false,
      });
      containerElement.addEventListener("touchmove", preventTouchScroll, {
        passive: false,
      });
    }

    return () => {
      if (containerElement) {
        containerElement.removeEventListener("touchstart", preventTouchScroll);
        containerElement.removeEventListener("touchmove", preventTouchScroll);
      }
    };
  }, [isSmallScreen]);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    padding: isSmallScreen ? "1px" : "5px", // Adjust padding for small screens
  };

  const styledDivStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid lightgray",
    padding: isSmallScreen ? "8px" : "15px", // Adjust padding for small screens
    margin: isSmallScreen ? "0px" : "5px", // Adjust margin for small screens
    boxSizing: "border-box",
    maxWidth: "100%",
    width: isSmallScreen ? "100%" : "auto", // Full width on small screens
  };

  return (
    <div
      className="captcha-container"
      style={containerStyle}
      ref={containerRef}
    >
      <div className="styled-div" style={styledDivStyle}>
        {children}
      </div>
    </div>
  );
};

export default CAPTCHAContainer;
