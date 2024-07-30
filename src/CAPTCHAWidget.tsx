import React, { useState, useEffect, useRef } from "react";
import useCAPTCHAData from "./hooks/useCAPTCHAData";

interface CAPTCHAWidgetProps {
  onSolve: () => void;
}

type DraggableImageProps = {
  src: string;
  index: number;
  positions: Position[];
  style: React.CSSProperties;
  updatePosition: (index: number, x: number, y: number) => void;
};

type Position = {
  x: number;
  y: number;
};

const DraggableImage = ({
  src,
  index,
  positions,
  zIndexes,
  style,
  updatePosition,
  updateZIndex,
}: DraggableImageProps & {
  zIndexes: number[];
  updateZIndex: (index: number, newZIndex: number) => void;
}) => {
  const [isGrabbing, setIsGrabbing] = useState(false);
  const handleMouseDown = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    const offsetX = e.clientX - positions[index].x;
    const offsetY = e.clientY - positions[index].y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      let newX = moveEvent.clientX - offsetX;
      let newY = moveEvent.clientY - offsetY;
      if (newX < 0) newX = 0;
      if (newX > 300) newX = 300;
      if (newY < 0) newY = 0;
      if (newY > 300) newY = 300;
      updatePosition(index, newX, newY);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      setIsGrabbing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    e.preventDefault();
    setIsGrabbing(true);

    const maxZIndex = Math.max(...zIndexes);
    updateZIndex(index, maxZIndex + 1);
  };

  return (
    <img
      src={src}
      onMouseDown={handleMouseDown}
      style={{
        ...style,
        cursor: isGrabbing ? "grabbing" : "grab",
        position: "absolute",
        left: `${positions[index].x}px`,
        top: `${positions[index].y}px`,
        userSelect: "none",
        zIndex: zIndexes[index],
      }}
    />
  );
};

const CAPTCHAWidget: React.FC<CAPTCHAWidgetProps> = ({ onSolve }) => {
  const {
    backgroundImage,
    puzzleImages,
    startPositions,
    isLoading,
    newCAPTCHA,
    rateLimitMessage,
    clearRateLimitMessage,
  } = useCAPTCHAData();
  const [positions, setPositions] = useState<Position[]>([]);
  const [zIndexes, setZIndexes] = useState<number[]>([1, 2, 3, 4]);

  useEffect(() => {
    if (!isLoading) {
      setPositions(startPositions);
    }
  }, [isLoading, startPositions]);

  const updatePosition = (index: number, x: number, y: number) => {
    const newPositions = positions.map((pos, posIndex) =>
      posIndex === index ? { x, y } : pos
    );
    setPositions(newPositions);
  };

  const updateZIndex = (index: number, newZIndex: number) => {
    const newZIndexes = zIndexes.map((zIndex, zIndexIndex) =>
      zIndexIndex === index ? newZIndex : zIndex
    );
    setZIndexes(newZIndexes);
  };

  const getPositions = () => {
    console.log("Current Positions:", positions);
  };

  const handleSolveClick = () => {
    const mockToken = "mock-token-" + Math.random().toString(36).substr(2, 9);
    const event = new CustomEvent("captchaSolved", {
      detail: { token: mockToken },
    });
    window.dispatchEvent(event);
    onSolve();
  };

  if (isLoading || positions.length === 0) {
    return <div>Loading...</div>;
  } else if (rateLimitMessage) {
    return (
      <div>
        <div>{rateLimitMessage}</div>
        <button onClick={clearRateLimitMessage}>Try Again</button>
      </div>
    );
  } else {
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
                positions={positions}
                zIndexes={zIndexes}
                updatePosition={updatePosition}
                updateZIndex={updateZIndex}
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
          <div>ver 0.5.4</div>
        </div>
      </div>
    );
  }
};

export default CAPTCHAWidget;
