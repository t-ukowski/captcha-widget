// useCAPTCHASolver.ts
import { useState } from "react";
import axios from "axios";

interface ValidationResult {
  success: boolean;
  token?: string;
}

const apiUrl = process.env.API_BASE_URL;

const useCAPTCHASolver = () => {
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const solveCAPTCHA = async (
    sessionId: string,
    positions: { x: number; y: number }[]
  ) => {
    setIsValidating(true);
    setError(null);

    try {
      const response = await axios.post(`${apiUrl}/validate`, {
        sessionId,
        positions,
      });
      if (response.data.success) {
        setValidationResult({ success: true, token: response.data.token });
      } else {
        setValidationResult({ success: false });
      }
    } catch (err) {
      setError("Validation failed. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  return {
    solveCAPTCHA,
    validationResult,
    isValidating,
    error,
  };
};

export default useCAPTCHASolver;
