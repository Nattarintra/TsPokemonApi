import { AppError } from "./errorClasses";

export const handleNetworkError = (error: unknown): never => {
    if (error instanceof AppError) {
        throw error;
    }

    throw new AppError(
        "NETWORK_ERROR",
        "NETWORK_ERROR: Network request failed"
    );
};