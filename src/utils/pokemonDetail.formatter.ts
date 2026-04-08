import type { PokemonSpecies, EvolutionChainLink } from "@/types/pokemon.type";

export const formatDescription = (species: PokemonSpecies): string =>
  species.flavor_text_entries
    .find((e) => e.language.name === "en")
    ?.flavor_text.replace(/[\n\f]/g, " ") ?? "";

export const formatHeight = (height: number): string => {
  const totalInches = Math.round(height * 3.937);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}'${inches.toString().padStart(2, "0")}"`;
};

export const formatWeight = (weight: number): string => `${(weight * 0.220462).toFixed(1)} lbs`;

export const formatCategory = (species: PokemonSpecies): string =>
  species.genera.find((g) => g.language.name === "en")?.genus ?? "";

export const formatGender = (genderRate: number): string[] => {
  if (genderRate === -1) return ["genderless"];
  return ["male", "female"];
};

export const flattenEvolutionChain = (chain: EvolutionChainLink): string[] => {
  const names: string[] = [chain.species.name];
  if (chain.evolves_to.length > 0) {
    names.push(...flattenEvolutionChain(chain.evolves_to[0]));
  }
  return names;
};
