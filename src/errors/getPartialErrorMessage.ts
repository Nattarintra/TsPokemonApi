import { ERROR_MESSAGES } from "./errorMessages";

export const getPartialErrorMessage = (failed: number): string => {
    return ERROR_MESSAGES.PARTIAL(failed);
};