// src/CAPTCHAWidget.tsx
import React, { useState, useEffect, useRef } from "react";
import mockImage from "./images/mock.jpg";

interface CAPTCHAWidgetProps {
  onSolve: () => void;
}

type DraggableImageProps = {
  src: string;
  onDragStart: (clientX: number, clientY: number) => void;
  onDragEnd: (clientX: number, clientY: number) => void;
  style: React.CSSProperties;
};

function DraggableImage({
  src,
  onDragStart,
  onDragEnd,
  style,
}: DraggableImageProps) {
  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    onDragStart(e.clientX, e.clientY);
    e.dataTransfer.setDragImage(new Image(), 0, 0); // Makes the original image invisible when dragging
    e.dataTransfer.effectAllowed = "move"; // Changes cursor to indicate moving
  };

  const handleDragEnd = (e: React.DragEvent<HTMLImageElement>) => {
    onDragEnd(e.clientX, e.clientY);
  };

  return (
    <img
      src={src}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        ...style,
        cursor: "pointer", // Cursor is a pointer on hover
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move"; // Changes the cursor during dragging to a moving hand
      }}
    />
  );
}

type Position = {
  x: number;
  y: number;
};

type Offset = {
  offsetX: number;
  offsetY: number;
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
  const [offsets, setOffsets] = useState<Offset[]>(
    new Array(4).fill({ offsetX: 0, offsetY: 0 })
  );
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
    setBackgroundImage(mockImage);
    setPuzzleImages([mockImage, mockImage, mockImage, mockImage]);
  }, []);

  // const updateOffset = (index: number, clientX: number, clientY: number) => {
  //   const rect = refContainer.current?.getBoundingClientRect();
  //   if (!rect) return;

  //   const offsetX = clientX - rect.left - window.scrollX;
  //   const offsetY = clientY - rect.top - window.scrollY;
  //   const newOffsets = offsets.map((off, offIndex) =>
  //     offIndex === index ? { offsetX, offsetY } : off
  //   );
  //   setOffsets(newOffsets);
  // };

  const updatePosition = (index: number, clientX: number, clientY: number) => {
    const rect = refContainer.current?.getBoundingClientRect();
    if (!rect) return;

    // const offsetX = offsets[index].offsetX;
    // const offsetY = offsets[index].offsetY;

    const newX = clientX - (rect.left + window.scrollX) - rect.width / 2;
    const newY = clientY - (rect.top + window.scrollY) - rect.height / 2;

    const limitedX = Math.max(Math.min(newX, 145), -145); // Adjusted for half the width of the puzzle piece
    const limitedY = Math.max(Math.min(newY, 145), -145); // Adjusted for half the height of the puzzle piece

    const newPositions = positions.map((pos, posIndex) =>
      posIndex === index ? { x: limitedX, y: limitedY } : pos
    );
    setPositions(newPositions);
  };

  const handleDragStart =
    (index: number) => (clientX: number, clientY: number) => {
      //updateOffset(index, clientX, clientY);
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
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {puzzleImages.map((img, index) => (
          <DraggableImage
            key={index}
            src={img}
            onDragStart={handleDragStart(index)}
            onDragEnd={handleDragEnd(index)}
            style={{
              width: "100px",
              height: "100px",
              position: "absolute",
              left: `50%`,
              top: `50%`,
              transform: `translate(${positions[index].x - 50}px, ${
                positions[index].y - 50
              }px)`,
              opacity:
                positions[index].x === 0 && positions[index].y === 0 ? 0 : 1, // Makes the original position invisible
            }}
          />
        ))}
      </div>
      <button onClick={getPositions}>Get Positions</button>
      <button onClick={handleSolveClick}>Solve CAPTCHA</button>
      <div>ver 0.2.5</div>
    </div>
  );
};

export default CAPTCHAWidget;
