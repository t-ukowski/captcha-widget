// useCAPTCHAData.js
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import mockLarge from "../images/mock_large.jpg";
import mockImage1 from "../images/mock1.jpg";
import mockImage2 from "../images/mock2.jpg";
import mockImage3 from "../images/mock3.jpg";
import mockImage4 from "../images/mock4.jpg";

// Mock API function to simulate fetching CAPTCHA data
const fetchCAPTCHAData = async () => {
  try {
    // Simulate a delay and mock data fetching
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Uncomment this block for actual API call
    const response = await axios.get("http://localhost:3003/getcaptchadata");
    if (response.status === 429) {
      throw new Error(
        response.data.message || "Too many requests. Please try again later."
      );
    }
    return response.data;

    // Returning hardcoded mock data
    // return {
    //   sessionId: "mock-session-id-" + Math.random().toString(36).substr(2, 9),
    //   backgroundImage: mockLarge,
    //   puzzleImages: [mockImage1, mockImage2, mockImage3, mockImage4],
    //   startPositions: [
    //     { x: 150, y: 150 },
    //     { x: 50, y: 70 },
    //     { x: 67, y: 144 },
    //     { x: 89, y: 100 },
    //   ],
    // };
  } catch (error) {
    // Check for rate limit error (HTTP 429)
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      throw new Error("Too many requests. Please try again later.");
    }
    // Re-throw other errors
    throw error;
  }
};

const useCAPTCHAData = () => {
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery(
    "captchaData",
    fetchCAPTCHAData,
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        if (error.message === "Too many requests. Please try again later.") {
          setRateLimitMessage(error.message);
        }
      },
    }
  );

  // Provide a function to manually clear the rate limit message
  const clearRateLimitMessage = () => setRateLimitMessage(null);

  return {
    sessionId: data?.sessionId ?? "",
    backgroundImage: data?.backgroundImage ?? "",
    puzzleImages: data?.puzzleImages ?? [],
    startPositions: data?.startPositions ?? [],
    isLoading,
    rateLimitMessage,
    clearRateLimitMessage,
    newCAPTCHA: refetch,
  };
};

export default useCAPTCHAData;
