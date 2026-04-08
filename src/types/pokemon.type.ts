// ─── Raw API shapes ──────────────────────────────────────────────────────────
// These types mirror the PokeAPI response exactly.
// Never use these directly in UI components.

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonTypeSlot {
  type: {
    name: string;
  };
}

export interface PokemonOfficialArtwork {
  front_default: string;
}

export interface PokemonSprites {
  other: {
    "official-artwork": PokemonOfficialArtwork;
  };
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: PokemonSprites;
  types: PokemonTypeSlot[];
}

export interface PokemonAbilitySlot {
  ability: {
    name: string;
  };
  is_hidden: boolean;
}

export interface PokemonStatSlot {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface PokemonDetail extends Pokemon {
  height: number;
  weight: number;
  abilities: PokemonAbilitySlot[];
  stats: PokemonStatSlot[];
}

// ─── Pokemon Species raw API shape ───────────────────────────────────────────

export interface PokemonSpeciesFlavorText {
  flavor_text: string;
  language: {
    name: string;
  };
  version: {
    name: string;
  };
}

export interface PokemonSpeciesGenus {
  genus: string;
  language: {
    name: string;
  };
}

export interface PokemonSpecies {
  gender_rate: number;
  genera: PokemonSpeciesGenus[];
  flavor_text_entries: PokemonSpeciesFlavorText[];
  evolution_chain: {
    url: string;
  };
}

// ─── Evolution Chain raw API shape ───────────────────────────────────────────

export interface EvolutionChainLink {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChainLink[];
}

export interface EvolutionChain {
  chain: EvolutionChainLink;
}

// ─── UI / App shapes ──────────────────────────────────────────────────────────
// These types are consumed by components and hooks.
// Transformed from raw API shapes via the service layer.

export interface PokemonIdentity {
  id: number;
  name: string;
  image: string;
}

export interface PokemonCardProps extends PokemonIdentity {
  types: string[];
}

export type PokemonListResult = {
  pokemons: PokemonCardProps[];
  failed: number;
};

export interface PokemonStat {
  name: string;
  value: number;
}

export type EvolutionStage = PokemonCardProps;

export interface PokemonBioInfo {
  description: string;
  height: string;
  weight: string;
  category: string;
  abilities: string[];
  gender: string[];
}

export interface PokemonCombatInfo {
  types: string[];
  weaknesses: string[];
  stats: PokemonStat[];
}

export interface PokemonDetailProps {
  identity: PokemonIdentity;
  bio: PokemonBioInfo;
  combat: PokemonCombatInfo;
  evolutions: EvolutionStage[];
}
