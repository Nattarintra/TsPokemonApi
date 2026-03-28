import { isApiError } from "@/utils/guards";


export const ERROR_MESSAGES = {
    NETWORK: "Check your internet connection.",
    DEFAULT: "Something went wrong.",
    NOT_FOUND: "The requested Pokémon could not be found.",
    SERVER: "Server error. Please try again.",
    PARTIAL: (count: number) =>
        `Some Pokémon failed to load (${count})`,
};

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
    return ERROR_MESSAGES.DEFAULT;
};

export const getPartialErrorMessage = (failed: number): string => {
    return ERROR_MESSAGES.PARTIAL(failed);
};