import { useQueryClient } from "@tanstack/react-query";
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

  const currentIndex = pokemons.findIndex((p) => p.id === currentId);

  if (currentIndex === -1) return { previousPokemon: null, nextPokemon: null };

  const previousPokemon =
    currentIndex > 0
      ? { id: pokemons[currentIndex - 1].id, name: pokemons[currentIndex - 1].name }
      : null;

  const nextPokemon =
    currentIndex < pokemons.length - 1
      ? { id: pokemons[currentIndex + 1].id, name: pokemons[currentIndex + 1].name }
      : null;

  return { previousPokemon, nextPokemon };
};
