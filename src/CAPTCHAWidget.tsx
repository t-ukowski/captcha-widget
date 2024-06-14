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

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const newX = clientX - centerX;
    const newY = clientY - centerY;

    // Ensure the puzzle pieces stay within the bounds
    if (newX > 200 || newX < -200 || newY > 200 || newY < -200) return;

    const newPositions = positions.map((pos, posIndex) =>
      posIndex === index ? { x: newX, y: newY } : pos
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
        }}
      >
        {puzzleImages.map((img, index) => (
          <DraggableImage
            key={index}
            src={img}
            onDragEnd={handleDragEnd(index)}
            style={{ width: "50px", height: "50px", position: "absolute" }}
          />
        ))}
      </div>
      <button onClick={getPositions}>Get Positions</button>
      <button onClick={handleSolveClick}>Solve CAPTCHA</button>
    </div>
  );
};

export default CAPTCHAWidget;
