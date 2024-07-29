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
  style,
  updatePosition,
}: DraggableImageProps) => {
  const [isGrabbing, setIsGrabbing] = useState(false);
  const handleMouseDown = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    const offsetX = e.clientX - positions[index].x;
    const offsetY = e.clientY - positions[index].y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newX = moveEvent.clientX - offsetX;
      const newY = moveEvent.clientY - offsetY;
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
      }}
    />
  );
};

const CAPTCHAWidget: React.FC<CAPTCHAWidgetProps> = ({ onSolve }) => {
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [puzzleImages, setPuzzleImages] = useState<string[]>([]);
  const [positions, setPositions] = useState<Position[]>([
    { x: 150, y: 150 },
    { x: 50, y: 70 },
    { x: 67, y: 144 },
    { x: 89, y: 100 },
  ]);

  useEffect(() => {
    setBackgroundImage(mockLarge);
    setPuzzleImages([mockImage1, mockImage2, mockImage3, mockImage4]);
  }, []);

  const updatePosition = (index: number, x: number, y: number) => {
    const newPositions = positions.map((pos, posIndex) =>
      posIndex === index ? { x, y } : pos
    );
    setPositions(newPositions);
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
              updatePosition={updatePosition}
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
        <div>ver 0.4.3</div>
      </div>
    </div>
  );
};

export default CAPTCHAWidget;
