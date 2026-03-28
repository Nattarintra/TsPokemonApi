export interface PokemonCardProps {
    id: number;
    name: string;
    image: string;
    types: string[];
}

export interface PokemonListItem {
    name: string;
    url: string;
}

export interface PokemonTypeEntry {
    type: {
        name: string;
    };
}

export interface Pokemon {
    id: number;
    name: string;
    sprites: {
        other: {
            "official-artwork": {
                front_default: string;
            };
        };
    };
    types: PokemonTypeEntry[];
}

export type PokemonListResult = {
    pokemons: PokemonCardProps[];
    failed: number;
};