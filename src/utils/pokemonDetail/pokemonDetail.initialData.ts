import type { QueryClient } from "@tanstack/react-query";
import type {
  PokemonDetailProps,
  PokemonListResult,
  PokemonIdentity,
  PokemonBioInfo,
  PokemonCombatInfo,
  EvolutionStage,
} from "@/types/pokemon.type";
import { QUERY_KEYS } from "@/constants";

export const getPokemonDetailInitialData = (
  queryClient: QueryClient,
  id: number,
): PokemonDetailProps | undefined => {
  const cached = queryClient
    .getQueryData<PokemonListResult>(QUERY_KEYS.POKEMON_LIST)
    ?.pokemons.find((p) => p.id === id);

  if (!cached) return undefined;

  const identity: PokemonIdentity = {
    id: cached.id,
    name: cached.name,
    image: cached.image,
  };

  const bio: PokemonBioInfo = {
    description: "",
    height: "",
    weight: "",
    category: "",
    abilities: [],
    gender: [],
  };

  const combat: PokemonCombatInfo = {
    types: cached.types,
    weaknesses: [],
    stats: [],
  };

  const evolutions: EvolutionStage[] = [];

  return { identity, bio, combat, evolutions, evolutionsFailed: 0, weaknessesFailed: 0 };
};

export const getPokemonDetailInitialDataUpdatedAt = (
  queryClient: QueryClient,
): number | undefined => queryClient.getQueryState(QUERY_KEYS.POKEMON_LIST)?.dataUpdatedAt;
