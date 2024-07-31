// useCAPTCHASolver.ts
import { useState } from "react";
import axios from "axios";

interface ValidationResult {
  success: boolean;
  token?: string;
}

const mockToken = "mock-token-" + Math.random().toString(36).substr(2, 9);

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
      // Simulate a delay for mocking
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Uncomment this block for actual API call
      // const response = await axios.post('/validate', { sessionId, positions });
      // if (response.data.success) {
      //   setValidationResult({ success: true, token: response.data.token });
      // } else {
      //   setValidationResult({ success: false });
      // }

      // Mocked success response
      setValidationResult({ success: true, token: mockToken });
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
