/**
 * @jest-environment node
 */
import {
  getUserErrorMessage,
  getPartialErrorMessage,
  ERROR_MESSAGES,
} from "@/errors/getErrorMessages";
import type { ApiError } from "@/types/apiError.type";

describe("Error Message Handlers", () => {
  describe("getUserErrorMessage", () => {
    it("returns DEFAULT message when error is not an ApiError", () => {
      const error = new Error("Generic Error");
      expect(getUserErrorMessage(error)).toBe(ERROR_MESSAGES.DEFAULT);
      expect(getUserErrorMessage(null)).toBe(ERROR_MESSAGES.DEFAULT);
      expect(getUserErrorMessage(undefined)).toBe(ERROR_MESSAGES.DEFAULT);
    });

    it("returns NETWORK message when error is a NETWORK_ERROR", () => {
      const error: ApiError = { type: "NETWORK_ERROR", message: "Timeout" };
      expect(getUserErrorMessage(error)).toBe(ERROR_MESSAGES.NETWORK);
    });

    it("returns NOT_FOUND message when error is a 404 HTTP_ERROR", () => {
      const error: ApiError = {
        type: "HTTP_ERROR",
        status: 404,
        statusText: "Not Found",
        message: "Not Found",
      };
      expect(getUserErrorMessage(error)).toBe(ERROR_MESSAGES.NOT_FOUND);
    });

    it("returns SERVER message when error is a 500 HTTP_ERROR", () => {
      const error: ApiError = {
        type: "HTTP_ERROR",
        status: 500,
        statusText: "Server Error",
        message: "Server Error",
      };
      expect(getUserErrorMessage(error)).toBe(ERROR_MESSAGES.SERVER);
    });

    it("returns DEFAULT message for unknown HTTP_ERROR statuses", () => {
      const error: ApiError = {
        type: "HTTP_ERROR",
        status: 418,
        statusText: "I'm a unknown",
        message: "I'm a unknown",
      };
      expect(getUserErrorMessage(error)).toBe(ERROR_MESSAGES.DEFAULT);
    });
  });

  describe("getPartialErrorMessage", () => {
    it("returns the correct PARTIAL message with the given count", () => {
      expect(getPartialErrorMessage(3)).toBe(ERROR_MESSAGES.PARTIAL(3));
      expect(getPartialErrorMessage(0)).toBe(ERROR_MESSAGES.PARTIAL(0));
    });
  });
});
