// src/CAPTCHAWidget.tsx
import React, { useState, useEffect, useRef } from "react";
import mockLarge from "./images/mock_large.jpg";
import mockImage1 from "./images/mock1.jpg";
import mockImage2 from "./images/mock2.jpg";
import mockImage3 from "./images/mock3.jpg";
import mockImage4 from "./images/mock4.jpg";

interface CAPTCHAWidgetProps {
  onSolve: () => void;
}

type DraggableImageProps = {
  src: string;
  index: number;
  onDragStart: (clientX: number, clientY: number) => void;
  onDragEnd: (clientX: number, clientY: number) => void;
  positions: Position[];
  style: React.CSSProperties;
};

function DraggableImage({
  src,
  index,
  onDragStart,
  onDragEnd,
  positions,
  style,
}: DraggableImageProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    setIsDragging(true);
    onDragStart(e.clientX, e.clientY);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLImageElement>) => {
    setIsDragging(false);
    onDragEnd(e.clientX, e.clientY);
  };

  useEffect(() => {
    console.log("isDragging changed");
  }, [isDragging]);

  const draggableStyle: React.CSSProperties = {
    ...style,
    cursor: isDragging ? "grabbing" : "grab",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: `translate(${positions[index].x - 50}px, ${
      positions[index].y - 50
    }px)`,
  };

  return (
    <img
      src={src}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={draggableStyle}
    />
  );
}

type Position = {
  x: number;
  y: number;
};

const CAPTCHAWidget: React.FC<CAPTCHAWidgetProps> = ({ onSolve }) => {
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [puzzleImages, setPuzzleImages] = useState<string[]>([]);
  const [positions, setPositions] = useState<Position[]>([
    { x: 0, y: 0 },
    { x: -50, y: 70 },
    { x: 67, y: 144 },
    { x: -111, y: -100 },
  ]);
  const refContainer = useRef<HTMLDivElement>(null);

  const handleSolveClick = () => {
    const mockToken = "mock-token-" + Math.random().toString(36).substr(2, 9);
    const event = new CustomEvent("captchaSolved", {
      detail: { token: mockToken },
    });
    window.dispatchEvent(event);
    onSolve();
  };

  useEffect(() => {
    setBackgroundImage(mockLarge);
    setPuzzleImages([mockImage1, mockImage2, mockImage3, mockImage4]);
  }, []);

  useEffect(() => {
    // This effect does nothing on mount, but on unmount, it will clean up
    return () => {
      console.log("Cleaning up CAPTCHA widget...");
      // Perform any cleanup here if necessary, such as removing event listeners
    };
  }, []);

  const updatePosition = (index: number, clientX: number, clientY: number) => {
    const rect = refContainer.current?.getBoundingClientRect();
    if (!rect) return;

    const newX = clientX - (rect.left + window.scrollX) - rect.width / 2;
    const newY = clientY - (rect.top + window.scrollY) - rect.height / 2;

    const limitedX = Math.max(Math.min(newX, 145), -145);
    const limitedY = Math.max(Math.min(newY, 145), -145);

    const newPositions = positions.map((pos, posIndex) =>
      posIndex === index ? { x: limitedX, y: limitedY } : pos
    );
    setPositions(newPositions);
  };

  const handleDragStart =
    (index: number) => (clientX: number, clientY: number) => {};

  const handleDragEnd =
    (index: number) => (clientX: number, clientY: number) => {
      updatePosition(index, clientX, clientY);
    };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const getPositions = () => {
    console.log("Current Positions:", positions);
  };

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
        <div style={{ marginBottom: "10px" }}>
          Przeciągnij puzzle na właściwe miejsca i zatwierdź wybór
        </div>
        <div
          ref={refContainer}
          onDragOver={handleDragOver}
          style={{
            width: "400px",
            height: "400px",
            position: "relative",
            marginBottom: "10px",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            boxShadow: "1px 1px 5px rgba(0,0,0,0.1)",
          }}
        >
          {puzzleImages.map((img, index) => (
            <DraggableImage
              key={index}
              index={index}
              src={img}
              onDragStart={handleDragStart(index)}
              onDragEnd={handleDragEnd(index)}
              positions={positions}
              style={{
                width: "100px",
                height: "100px",
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
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
            onClick={getPositions}
          >
            Pozycje puzzli
          </button>
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
            onClick={handleSolveClick}
          >
            Zatwierdź
          </button>
        </div>
        <div>ver 0.3.7</div>
      </div>
    </div>
  );
};

export default CAPTCHAWidget;
