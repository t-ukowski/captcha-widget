// mocks/browser.js
import { setupWorker, rest } from "msw";
import mockLarge from "../images/mock_large.jpg";
import mockImage1 from "../images/mock1.jpg";
import mockImage2 from "../images/mock2.jpg";
import mockImage3 from "../images/mock3.jpg";
import mockImage4 from "../images/mock4.jpg";

// Define the mock for the getCAPTCHA endpoint
export const handlers = [
  rest.get("/getCAPTCHA", (req, res, ctx) => {
    return res(
      ctx.json({
        backgroundImage: mockLarge,
        puzzleImages: [mockImage1, mockImage2, mockImage3, mockImage4],
        positions: [
          { x: 150, y: 150 },
          { x: 50, y: 70 },
          { x: 67, y: 144 },
          { x: 89, y: 100 },
        ],
      })
    );
  }),
];

// Set up the service worker
export const worker = setupWorker(...handlers);
