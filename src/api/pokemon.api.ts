import type {
  EvolutionChain,
  Pokemon,
  PokemonDetail,
  PokemonListItem,
  PokemonSpecies,
} from "@/types/pokemon.type";
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
    results.map((p) => fetchWithErrorHandling<Pokemon>(p.url)),
  );
  return {
    pokemons: success, // raw Pokemon
    failed,
  };
};

export const fetchPokemonById = async (id: number): Promise<PokemonDetail> => {
  try {
    const res = await fetch(`${env.apiBaseUrl}/pokemon/${id}`);
    handleHttpError(res);
    return res.json() as Promise<PokemonDetail>;
  } catch (error) {
    throw handleNetworkError(error);
  }
};

export const fetchPokemonSpecies = async (id: number): Promise<PokemonSpecies> => {
  try {
    const res = await fetch(`${env.apiBaseUrl}/pokemon-species/${id}`);
    handleHttpError(res);
    return res.json() as Promise<PokemonSpecies>;
  } catch (error) {
    throw handleNetworkError(error);
  }
};

export const fetchPokemonByName = async (name: string): Promise<PokemonDetail> => {
  try {
    const res = await fetch(`${env.apiBaseUrl}/pokemon/${name}`);
    handleHttpError(res);
    return res.json() as Promise<PokemonDetail>;
  } catch (error) {
    throw handleNetworkError(error);
  }
};

export const fetchEvolutionChain = async (url: string): Promise<EvolutionChain> => {
  try {
    const res = await fetch(url);
    handleHttpError(res);
    return res.json() as Promise<EvolutionChain>;
  } catch (error) {
    throw handleNetworkError(error);
  }
};
