import { useState } from "react";
import type { PokemonCardProps } from "@/types/pokemon.type";
import { env } from "@/config";

interface UsePokemonPaginationResult {
  currentPage: number;
  paginatedPokemons: PokemonCardProps[];
  totalItems: number;
  handlePageChange: (page: number) => void;
}

export const usePokemonPagination = (pokemons: PokemonCardProps[]): UsePokemonPaginationResult => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const start = (currentPage - 1) * env.pageSize;
  const paginatedPokemons = pokemons.slice(start, start + env.pageSize);

  return {
    currentPage,
    paginatedPokemons,
    totalItems: pokemons.length,
    handlePageChange,
  };
};
