import type { Pokemon, PokemonListItem } from "@/types/pokemon.type";
import { env } from "@/config";
import { handleHttpError } from "@/errors/handleHttpError";
import { handleNetworkError } from "@/errors/handleNetworkError";
import { fetchWithErrorHandling } from "./fetchWithErrorHandling";
import { safePromiseAll } from "@/utils/safePromiseAll";

export const fetchPokemonList = async (): Promise<PokemonListItem[]> => {
  try {
    const res = await fetch(`${env.apiBaseUrl}/pokemon?limit=${env.limitPokemonList}`);

    handleHttpError(res);

    const data = await res.json();
    return data.results;
  } catch (error) {
    throw handleNetworkError(error);
  }
};

export const fetchPokemonDetails = async (
  results: PokemonListItem[],
): Promise<{ pokemons: Pokemon[]; failed: number }> => {
  const { success, failed } = await safePromiseAll(
    results.map((p) => fetchWithErrorHandling(p.url)),
  );

  return {
    pokemons: success, // raw Pokemon
    failed,
  };
};
