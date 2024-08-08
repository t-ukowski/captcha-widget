import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import mockLarge from "../images/mock_large.jpg";
import mockImage1 from "../images/mock1.jpg";
import mockImage2 from "../images/mock2.jpg";
import mockImage3 from "../images/mock3.jpg";
import mockImage4 from "../images/mock4.jpg";

const fetchCAPTCHAData = async (fingerprint: string) => {
  try {
    const response = await axios.get("http://localhost:3003/getcaptchadata", {
      headers: {
        "X-Client-Fingerprint": fingerprint,
      },
    });
    if (response.status === 429) {
      throw new Error(
        response.data.message || "Too many requests. Please try again later."
      );
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      throw new Error("Too many requests. Please try again later.");
    }
    throw error;
  }
};

const useCAPTCHAData = () => {
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState<string>("");

  useEffect(() => {
    const getFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setFingerprint(result.visitorId);
    };
    getFingerprint();
  }, []);

  const { data, isLoading, error, refetch } = useQuery(
    "captchaData",
    () => fetchCAPTCHAData(fingerprint),
    {
      enabled: fingerprint !== "", // Ensure fingerprint is set before fetching
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
