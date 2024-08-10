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
    let startTime: number;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now(); // Capture the time when the touch starts
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const currentTime = Date.now();

      const diffX = currentX - startX;
      const diffY = currentY - startY;
      const diffTime = currentTime - startTime; // Time difference in milliseconds

      // Define a threshold to detect movement (dragging vs. scrolling)
      const distanceThreshold = 10;
      const timeThreshold = 200; // 200ms threshold to consider it "rapid"

      // Determine if the movement is primarily vertical or horizontal
      const isHorizontalMove = Math.abs(diffX) > Math.abs(diffY);
      const isSignificantMove =
        Math.abs(diffX) > distanceThreshold ||
        Math.abs(diffY) > distanceThreshold;
      const isRapidMove = diffTime < timeThreshold; // Rapid if within 200ms

      // If the movement is significant and rapid, or primarily vertical, allow scroll
      if ((isSignificantMove && isRapidMove) || !isHorizontalMove) {
        // Allow scroll (do nothing)
      } else {
        // Prevent scroll (assume it's a drag)
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
