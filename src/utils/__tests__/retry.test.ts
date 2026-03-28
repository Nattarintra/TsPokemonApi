/**
 * @jest-environment node
 */
import { shouldRetry, getRetryDelay } from "@/utils/retry";
import { MAX_RETRIES, RETRY_BASE_DELAY, RETRY_MAX_DELAY } from "@/constants";
import type { ApiError } from "@/types/apiError.type";

describe("Retry Logic Utilities", () => {
    describe("shouldRetry", () => {
        it("retries unknown non-ApiErrors if failure count is below MAX_RETRIES", () => {
            const error = new Error("Random error");
            expect(shouldRetry(0, error)).toBe(true);
            expect(shouldRetry(MAX_RETRIES - 1, error)).toBe(true);
            expect(shouldRetry(MAX_RETRIES, error)).toBe(false);
        });

        it("does NOT retry 4xx HTTP_ERRORs", () => {
            const error404: ApiError = { type: "HTTP_ERROR", status: 404, statusText: "Not Found", message: "Not Found" };
            const error401: ApiError = { type: "HTTP_ERROR", status: 401, statusText: "Unauthorized", message: "Unauthorized" };

            expect(shouldRetry(0, error404)).toBe(false);
            expect(shouldRetry(0, error401)).toBe(false);
        });

        it("retries 5xx HTTP_ERRORs if failure count is below MAX_RETRIES", () => {
            const error500: ApiError = { type: "HTTP_ERROR", status: 500, statusText: "Server Error", message: "Server Error" };

            expect(shouldRetry(0, error500)).toBe(true);
            expect(shouldRetry(MAX_RETRIES, error500)).toBe(false);
        });

        it("retries NETWORK_ERRORs if failure count is below MAX_RETRIES", () => {
            const errorNet: ApiError = { type: "NETWORK_ERROR", message: "Timeout" };

            expect(shouldRetry(0, errorNet)).toBe(true);
            expect(shouldRetry(MAX_RETRIES, errorNet)).toBe(false);
        });
    });

    describe("getRetryDelay", () => {
        it("calculates exponential backoff correctly without exceeding MAX_DELAY", () => {
            expect(getRetryDelay(0)).toBe(RETRY_BASE_DELAY); // 500 * 2^0 = 500
            expect(getRetryDelay(1)).toBe(RETRY_BASE_DELAY * 2); // 500 * 2^1 = 1000
            expect(getRetryDelay(2)).toBe(RETRY_BASE_DELAY * 4); // 500 * 2^2 = 2000

            // Should cap out at RETRY_MAX_DELAY
            expect(getRetryDelay(3)).toBe(RETRY_MAX_DELAY);
            expect(getRetryDelay(10)).toBe(RETRY_MAX_DELAY);
        });
    });
});
