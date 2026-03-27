import { MAX_RETRIES, RETRY_BASE_DELAY, RETRY_MAX_DELAY } from "@/utils/constants/constants";
import type { ApiError } from "@/utils/types/apiError.type";

export const isApiError = (error: unknown): error is ApiError => {
    return (
        typeof error === "object" &&
        error !== null &&
        "type" in error
    );
};

export const shouldRetry = (failureCount: number, error: unknown): boolean => {
    // unknown retry (safe fallback)
    if (!isApiError(error)) {
        return failureCount < MAX_RETRIES;
    }

    // HTTP error
    if (error.type === "HTTP_ERROR") {
        // 4xx don't retry
        if (error.status >= 400 && error.status < 500) {
            return false;
        }
    }

    // network 5xx retry
    return failureCount < MAX_RETRIES;
};

export const getRetryDelay = (attempt: number): number => {
    return Math.min(RETRY_BASE_DELAY * 2 ** attempt, RETRY_MAX_DELAY);
};