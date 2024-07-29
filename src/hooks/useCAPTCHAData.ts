// useCAPTCHAData.js
import { useState, useEffect } from "react";
import axios from "axios";

const useCAPTCHAData = () => {
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [puzzleImages, setPuzzleImages] = useState<string[]>([]);
  const [startPositions, setPositions] = useState<{ x: number; y: number }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCAPTCHAData = async () => {
      try {
        const response = await axios.get("/getCAPTCHA");
        const data = response.data;
        setBackgroundImage(data.backgroundImage);
        setPuzzleImages(data.puzzleImages);
        setPositions(data.positions);
      } catch (error) {
        console.error("Error fetching CAPTCHA data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCAPTCHAData();
  }, []);

  return { backgroundImage, puzzleImages, startPositions, isLoading };
};

export default useCAPTCHAData;
