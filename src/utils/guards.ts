import type { ApiError } from "@/types/apiError.type";

export const isApiError = (error: unknown): error is ApiError => {
  return typeof error === "object" && error !== null && "type" in error;
};
