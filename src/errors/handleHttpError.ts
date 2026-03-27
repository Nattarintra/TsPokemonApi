import { AppError } from "./errorClasses";

export const handleHttpError = (res: Response): void => {
    if (!res.ok) {
        throw new AppError(
            "HTTP_ERROR",
            res.statusText,
            res.status
        );
    }
};