import { isApiError } from "@/utils/retry";
import { ERROR_MESSAGES } from "./errorMessages";

export const getUserErrorMessage = (error: unknown): string => {

    if (!isApiError(error)) {
        return ERROR_MESSAGES.DEFAULT;
    }

    if (error.type === "NETWORK_ERROR") {
        return ERROR_MESSAGES.NETWORK;
    }

    if (error.type === "HTTP_ERROR") {
        switch (error.status) {
            case 404:
                return ERROR_MESSAGES.NOT_FOUND;
            case 500:
                return ERROR_MESSAGES.SERVER;
            default:
                return ERROR_MESSAGES.DEFAULT;
        }
    }

    if (error.type === "PARTIAL_ERROR") {
        return ERROR_MESSAGES.PARTIAL(error.failed);
    }
    return ERROR_MESSAGES.DEFAULT;
};