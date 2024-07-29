// useCAPTCHAData.js
import { useState, useEffect } from "react";
import axios from "axios";
import mockLarge from "../images/mock_large.jpg";
import mockImage1 from "../images/mock1.jpg";
import mockImage2 from "../images/mock2.jpg";
import mockImage3 from "../images/mock3.jpg";
import mockImage4 from "../images/mock4.jpg";

const useCAPTCHAData = () => {
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [puzzleImages, setPuzzleImages] = useState<string[]>([]);
  const [startPositions, setPositions] = useState<{ x: number; y: number }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Commenting out the actual GET request logic
    const fetchCAPTCHAData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Hard-coded mock data
        setBackgroundImage(mockLarge);
        setPuzzleImages([mockImage1, mockImage2, mockImage3, mockImage4]);
        setPositions([
          { x: 150, y: 150 },
          { x: 50, y: 70 },
          { x: 67, y: 144 },
          { x: 89, y: 100 },
        ]);

        // const response = await axios.get("/getCAPTCHA");
        // const data = response.data;
        // setBackgroundImage(data.backgroundImage);
        // setPuzzleImages(data.puzzleImages);
        // setPositions(data.positions);
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
