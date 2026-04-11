import { useQuery, useQueryClient } from "@tanstack/react-query";
import { env } from "@/config";
import { fetchPokemonById } from "@/api/pokemon.api";
import type { PokemonListResult } from "@/types/pokemon.type";
import { QUERY_KEYS } from "@/constants";

interface PokemonNavItem {
  id: number;
  name: string;
}

interface UsePokemonNavigationResult {
  previousPokemon: PokemonNavItem | null;
  nextPokemon: PokemonNavItem | null;
}

export const usePokemonNavigation = (currentId: number): UsePokemonNavigationResult => {
  const queryClient = useQueryClient();
  const pokemons =
    queryClient.getQueryData<PokemonListResult>(QUERY_KEYS.POKEMON_LIST)?.pokemons ?? [];

  const prevId = currentId > 1 ? currentId - 1 : null;
  const nextId = currentId < env.limitPokemonList ? currentId + 1 : null;

  const getCachedName = (id: number): string | undefined =>
    pokemons.find((p) => p.id === id)?.name;

  const { data: prevData } = useQuery({
    queryKey: QUERY_KEYS.POKEMON_NAV_NAME(prevId!),
    queryFn: () => fetchPokemonById(prevId!),
    enabled: prevId !== null && !getCachedName(prevId),
  });

  const { data: nextData } = useQuery({
    queryKey: QUERY_KEYS.POKEMON_NAV_NAME(nextId!),
    queryFn: () => fetchPokemonById(nextId!),
    enabled: nextId !== null && !getCachedName(nextId),
  });

  const previousPokemon = prevId
    ? { id: prevId, name: getCachedName(prevId) ?? prevData?.name ?? "" }
    : null;

  const nextPokemon = nextId
    ? { id: nextId, name: getCachedName(nextId) ?? nextData?.name ?? "" }
    : null;

  return { previousPokemon, nextPokemon };
};
