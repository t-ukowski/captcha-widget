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
    let startX: number;
    let startY: number;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;

      const diffX = currentX - startX;
      const diffY = currentY - startY;

      // Define a threshold to detect minimal movement (dragging, not scrolling)
      const threshold = 10;

      if (Math.abs(diffX) > threshold || Math.abs(diffY) > threshold) {
        // If the user is dragging mostly horizontally or minimally in any direction, prevent scroll
        if (Math.abs(diffX) > Math.abs(diffY) || Math.abs(diffY) < threshold) {
          e.preventDefault();
        }
      } else {
        // If the movement is small and doesn't exceed the threshold, allow scrolling
        e.preventDefault();
      }
    };

    const containerElement = containerRef.current;

    if (containerElement && window.innerWidth <= 480) {
      containerElement.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      containerElement.addEventListener("touchmove", handleTouchMove, {
        passive: false, // We need this to call preventDefault
      });
    }

    return () => {
      if (containerElement) {
        containerElement.removeEventListener("touchstart", handleTouchStart);
        containerElement.removeEventListener("touchmove", handleTouchMove);
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
