import type {
  EvolutionStage,
  PokemonBioInfo,
  PokemonCombatInfo,
  PokemonDetailProps,
  PokemonIdentity,
  PokemonStat,
} from "@/types/pokemon.type";
import { fetchEvolutionChain, fetchPokemonById, fetchPokemonSpecies } from "@/api/pokemon.api";

import {
  flattenEvolutionChain,
  formatCategory,
  formatDescription,
  formatGender,
  formatHeight,
  formatWeight,
} from "@/utils/pokemonDetail.formatter";

export const getPokemonDetailData = async (id: number): Promise<PokemonDetailProps> => {
  const [detail, species] = await Promise.all([fetchPokemonById(id), fetchPokemonSpecies(id)]);

  const evolutionChain = await fetchEvolutionChain(species.evolution_chain.url);
  const evolutionNames = flattenEvolutionChain(evolutionChain.chain);

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
    weaknesses: [],
    stats: detail.stats.map(
      (s): PokemonStat => ({
        name: s.stat.name,
        value: s.base_stat,
      }),
    ),
  };

  const evolutions: EvolutionStage[] = evolutionNames.map((name) => ({
    id: 0,
    name,
    image: "",
    types: [],
  }));

  return { identity, bio, combat, evolutions };
};
