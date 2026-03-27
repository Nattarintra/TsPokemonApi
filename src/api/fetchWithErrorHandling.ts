import { handleHttpError } from "@/errors/handleHttpError";
import { handleNetworkError } from "@/errors/handleNetworkError";

export const fetchWithErrorHandling = async (url: string) => {
    try {
        const res = await fetch(url);
        handleHttpError(res);
        return res.json();
    } catch (error) {
        handleNetworkError(error);
    }
};