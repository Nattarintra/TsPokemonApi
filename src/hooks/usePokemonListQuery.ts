import { getPokemonListData } from "@/api/pokemon.service";
import { getRetryDelay, shouldRetry } from "@/utils/retry";
import type { PokemonListResult } from "@/types/pokemon.type";
import { useQuery } from "@tanstack/react-query";

export const usePokemonListQuery = () => {
  return useQuery<PokemonListResult, Error>({
    queryKey: ["pokemon-list"],
    queryFn: getPokemonListData,
    retry: shouldRetry,
    retryDelay: getRetryDelay,
  });
};
