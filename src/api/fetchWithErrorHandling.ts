import { handleHttpError } from "@/errors/handleHttpError";
import { handleNetworkError } from "@/errors/handleNetworkError";

export const fetchWithErrorHandling = async <T>(url: string): Promise<T> => {
  try {
    const res = await fetch(url);
    handleHttpError(res);
    return res.json() as Promise<T>;
  } catch (error) {
    throw handleNetworkError(error);
  }
};
