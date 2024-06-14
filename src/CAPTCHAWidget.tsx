// src/CAPTCHAWidget.tsx
import React, { useState, useEffect, useRef } from "react";
import mockImage from "./images/mock.jpg";

interface CAPTCHAWidgetProps {
  onSolve: () => void;
}

type DraggableImageProps = {
  src: string;
  onDragEnd: (clientX: number, clientY: number) => void;
  style: React.CSSProperties;
};

function DraggableImage({ src, onDragEnd, style }: DraggableImageProps) {
  const handleDragEnd = (e: React.DragEvent<HTMLImageElement>) => {
    onDragEnd(e.clientX, e.clientY);
  };

  return (
    <img src={src} draggable="true" onDragEnd={handleDragEnd} style={style} />
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
    // Mock token generation
    const mockToken = "mock-token-" + Math.random().toString(36).substr(2, 9);

    // Dispatch custom event with the mock token
    const event = new CustomEvent("captchaSolved", {
      detail: { token: mockToken },
    });
    window.dispatchEvent(event);

    onSolve(); // Call the onSolve callback if needed
  };

  useEffect(() => {
    // Use imported image for all instances
    setBackgroundImage(mockImage);
    setPuzzleImages([mockImage, mockImage, mockImage, mockImage]);
  }, []);

  const updatePosition = (index: number, clientX: number, clientY: number) => {
    const rect = refContainer.current?.getBoundingClientRect();
    if (!rect) return;

    // Calculate new positions relative to the center of the container
    const newX = clientX - (rect.left + window.scrollX) - rect.width / 2;
    const newY = clientY - (rect.top + window.scrollY) - rect.height / 2;

    // Constrain positions to within the bounds of the container
    const limitedX = Math.max(Math.min(newX, 150), -150); // Adjusted for half the width of the puzzle piece
    const limitedY = Math.max(Math.min(newY, 150), -150); // Adjusted for half the height of the puzzle piece

    const newPositions = positions.map((pos, posIndex) =>
      posIndex === index ? { x: limitedX, y: limitedY } : pos
    );
    setPositions(newPositions);
  };

  const handleDragEnd =
    (index: number) => (clientX: number, clientY: number) => {
      updatePosition(index, clientX, clientY);
    };

  const getPositions = () => {
    console.log("Current Positions:", positions);
  };

  return (
    <div className="captcha-container">
      <div
        ref={refContainer}
        style={{
          width: "400px",
          height: "400px",
          position: "relative",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "contain", // Ensures the image fits within the div without being cropped
          backgroundRepeat: "no-repeat", // Prevents the image from repeating
          backgroundPosition: "center", // Centers the image within the div
        }}
      >
        {puzzleImages.map((img, index) => (
          <DraggableImage
            key={index}
            src={img}
            onDragEnd={handleDragEnd(index)}
            style={{
              width: "100px",
              height: "100px",
              position: "absolute",
              left: `50%`,
              top: `50%`,
              transform: `translate(${positions[index].x - 25}px, ${
                positions[index].y - 25
              }px)`, // Offset by half the size of the image
            }}
          />
        ))}
      </div>
      <button onClick={getPositions}>Get Positions</button>
      <button onClick={handleSolveClick}>Solve CAPTCHA</button>
    </div>
  );
};

export default CAPTCHAWidget;
