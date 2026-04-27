import { useState, useCallback } from "react";
import type { PokemonCardProps } from "@/types/pokemon.type";
import { FAVORITES_KEY } from "@/constants";

const loadFavorites = (): PokemonCardProps[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? (JSON.parse(stored) as PokemonCardProps[]) : [];
  } catch {
    return [];
  }
};

const saveFavorites = (favorites: PokemonCardProps[]): void => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch {
    console.error("Failed to save favorites to localStorage");
  }
};

interface UseFavoritesResult {
  favorites: PokemonCardProps[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (pokemon: PokemonCardProps) => void;
}

export const useFavorites = (): UseFavoritesResult => {
  const [favorites, setFavorites] = useState<PokemonCardProps[]>(loadFavorites);

  const isFavorite = useCallback(
    (id: number): boolean => favorites.some((p) => p.id === id),
    [favorites],
  );

  const toggleFavorite = useCallback((pokemon: PokemonCardProps): void => {
    setFavorites((prev) => {
      const next = prev.some((p) => p.id === pokemon.id)
        ? prev.filter((p) => p.id !== pokemon.id)
        : [...prev, pokemon];

      saveFavorites(next);
      return next;
    });
  }, []);

  return { favorites, isFavorite, toggleFavorite };
};
