import { getPokemonListData } from "@/api/pokemon.service";
import { getRetryDelay, shouldRetry } from "@/utils/retry";
import type { PokemonListResult } from "@/types/pokemon.type";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";

export const usePokemonListQuery = () => {
  return useQuery<PokemonListResult, Error>({
    queryKey: QUERY_KEYS.POKEMON_LIST,
    queryFn: getPokemonListData,
    retry: shouldRetry,
    retryDelay: getRetryDelay,
  });
};
