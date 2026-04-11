import type { Pokemon, PokemonCardProps, PokemonListResult } from "@/types/pokemon.type";
import { fetchPokemonSummaries, fetchPokemonList } from "@/api/pokemon.api";

export const formatPokemon = (pokemon: Pokemon): PokemonCardProps => {
  return {
    id: pokemon.id,
    name: pokemon.name,
    image: pokemon.sprites.other["official-artwork"].front_default,
    types: pokemon.types.map((t) => t.type.name),
  };
};

export const getPokemonListData = async (): Promise<PokemonListResult> => {
  const list = await fetchPokemonList();
  const details = await fetchPokemonSummaries(list);
  return {
    pokemons: details.pokemons.map(formatPokemon),
    failed: details.failed,
  };
};
