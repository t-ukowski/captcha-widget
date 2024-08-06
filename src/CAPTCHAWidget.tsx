import React, { useState, useEffect } from "react";
import useCAPTCHAData from "./hooks/useCAPTCHAData";
import useCAPTCHASolver from "./hooks/useCAPTCHASolver";
import CAPTCHAButton from "./components/CAPTCHAButton";
import CAPTCHAContainer from "./components/CAPTCHAContainer";
import LoadingSpinner from "./components/LoadingSpinner";

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
    sessionId,
    backgroundImage,
    puzzleImages,
    startPositions,
    isLoading: isDataLoading,
    newCAPTCHA,
    rateLimitMessage,
    clearRateLimitMessage,
  } = useCAPTCHAData();

  const { solveCAPTCHA, validationResult, isValidating, error } =
    useCAPTCHASolver();

  const [positions, setPositions] = useState<Position[]>([]);
  const [zIndexes, setZIndexes] = useState<number[]>([1, 2, 3, 4]);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    if (!isDataLoading) {
      setPositions(startPositions);
    }
  }, [isDataLoading, startPositions]);

  useEffect(() => {
    console.log("CAPTCHAWidget mounted");
    return () => console.log("CAPTCHAWidget unmounted");
  }, []); // TEST

  useEffect(() => {
    if (validationResult) {
      if (validationResult.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          const event = new CustomEvent("captchaSolved", {
            detail: { token: validationResult.token },
          });
          window.dispatchEvent(event);
          onSolve();
        }, 3000);
      } else {
        setShowError(true);
        newCAPTCHA();
      }
    }
  }, [validationResult, onSolve, newCAPTCHA]);

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
    solveCAPTCHA(sessionId, positions);
  };

  if (isDataLoading || isValidating || positions.length === 0) {
    return (
      <CAPTCHAContainer>
        <div
          style={{
            width: "400px",
            height: "400px",
          }}
        >
          <LoadingSpinner />
        </div>
      </CAPTCHAContainer>
    );
  } else if (rateLimitMessage) {
    return (
      <CAPTCHAContainer>
        <div>{rateLimitMessage}</div>
        <CAPTCHAButton onClick={clearRateLimitMessage}>
          Spróbuj ponownie
        </CAPTCHAButton>
      </CAPTCHAContainer>
    );
  } else if (showSuccess) {
    return (
      <CAPTCHAContainer>
        <div
          style={{
            width: "400px",
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>Captcha Solved Successfully!</div>
        </div>
      </CAPTCHAContainer>
    );
  } else {
    return (
      <CAPTCHAContainer>
        {showError && (
          <div style={{ color: "red" }}>Błędna odpowiedź, spróbuj ponownie</div>
        )}
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
            border: "2px solid black",
            borderRadius: "5px",
          }}
        >
          {puzzleImages.map((img: string, index: number) => (
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
                border: "2px solid black",
                borderRadius: "5px",
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
          <CAPTCHAButton onClick={getPositions}>Pozycje puzzli</CAPTCHAButton>
          <CAPTCHAButton onClick={handleSolveClick}>Zatwierdź</CAPTCHAButton>
        </div>
        <div>ver 0.6.8</div>
      </CAPTCHAContainer>
    );
  }
};

export default CAPTCHAWidget;
