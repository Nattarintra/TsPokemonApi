import type {
  EvolutionStage,
  PokemonBioInfo,
  PokemonCombatInfo,
  PokemonDetailProps,
  PokemonIdentity,
  PokemonStat,
} from "@/types/pokemon.type";
import {
  fetchEvolutionChain,
  fetchPokemonById,
  fetchPokemonByName,
  fetchPokemonSpecies,
  fetchPokemonType,
} from "@/api/pokemon.api";

import {
  flattenEvolutionChain,
  formatCategory,
  formatDescription,
  formatGender,
  formatHeight,
  formatWeaknesses,
  formatWeight,
} from "@/utils/pokemonDetail/pokemonDetail.formatter";
import { safePromiseAll } from "@/utils/safePromiseAll";

export const getPokemonDetailData = async (id: number): Promise<PokemonDetailProps> => {
  const [detail, species] = await Promise.all([fetchPokemonById(id), fetchPokemonSpecies(id)]);

  const [evolutionChain, { success: typeDetails, failed: weaknessesFailed }] = await Promise.all([
    fetchEvolutionChain(species.evolution_chain.url),
    safePromiseAll(detail.types.map((t) => fetchPokemonType(t.type.name))),
  ]);

  const evolutionNames = flattenEvolutionChain(evolutionChain.chain);

  const { success: evolutionPokemons, failed: evolutionsFailed } = await safePromiseAll(
    evolutionNames.map((name) => fetchPokemonByName(name)),
  );

  const identity: PokemonIdentity = {
    id: detail.id,
    name: detail.name,
    image: detail.sprites.other["official-artwork"].front_default,
  };

  const bio: PokemonBioInfo = {
    description: formatDescription(species),
    height: formatHeight(detail.height),
    weight: formatWeight(detail.weight),
    category: formatCategory(species),
    abilities: detail.abilities.filter((a) => !a.is_hidden).map((a) => a.ability.name),
    gender: formatGender(species.gender_rate),
  };

  const combat: PokemonCombatInfo = {
    types: detail.types.map((t) => t.type.name),
    weaknesses: formatWeaknesses(typeDetails),
    stats: detail.stats.map(
      (s): PokemonStat => ({
        name: s.stat.name,
        value: s.base_stat,
      }),
    ),
  };

  const evolutions: EvolutionStage[] = evolutionPokemons.map((p) => ({
    id: p.id,
    name: p.name,
    image: p.sprites.other["official-artwork"].front_default,
    types: p.types.map((t) => t.type.name),
  }));

  return { identity, bio, combat, evolutions, evolutionsFailed, weaknessesFailed };
};
