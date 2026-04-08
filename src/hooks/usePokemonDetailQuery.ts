import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPokemonDetailData } from "@/api/pokemonDetail.service";
import { shouldRetry, getRetryDelay } from "@/utils/retry";
import {
  getPokemonDetailInitialData,
  getPokemonDetailInitialDataUpdatedAt,
} from "@/utils/pokemonDetail/pokemonDetail.initialData";
import type { PokemonDetailProps } from "@/types/pokemon.type";
import { QUERY_KEYS } from "@/constants";

export const usePokemonDetailQuery = (id: number) => {
  const queryClient = useQueryClient();

  return useQuery<PokemonDetailProps, Error>({
    queryKey: QUERY_KEYS.POKEMON_DETAIL(id),
    queryFn: () => getPokemonDetailData(id),
    retry: shouldRetry,
    retryDelay: getRetryDelay,
    initialData: () => getPokemonDetailInitialData(queryClient, id),
    initialDataUpdatedAt: () => getPokemonDetailInitialDataUpdatedAt(queryClient),
  });
};
