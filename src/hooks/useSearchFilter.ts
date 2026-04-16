import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import type { PokemonCardProps } from "@/types/pokemon.type";
import { env } from "@/config";
import { DEBOUNCE_MS } from "@/constants";

interface UseSearchFilterResult {
  search: string;
  activeType: string;
  currentPage: number;
  isEmpty: boolean;
  isTyping: boolean;
  paginatedPokemons: PokemonCardProps[];
  totalItems: number;
  handleSearchChange: (value: string) => void;
  handleTypeChange: (type: string) => void;
  handlePageChange: (page: number) => void;
}

export const useSearchFilter = (pokemons: PokemonCardProps[]): UseSearchFilterResult => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  const urlSearch = searchParams.get("search") ?? "";
  const activeType = searchParams.get("type") ?? "";

  // internal input state — updates immediately on every keystroke
  const [inputValue, setInputValue] = useState(urlSearch);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    setCurrentPage(1);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set("search", value);
        } else {
          next.delete("search");
        }
        return next;
      });
    }, DEBOUNCE_MS);
  };

  const handleTypeChange = (type: string) => {
    setCurrentPage(1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (type && type !== activeType) {
        next.set("type", type);
      } else {
        next.delete("type");
      }
      return next;
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const filteredPokemons = useMemo(() => {
    return pokemons.filter((pokemon) => {
      const matchesSearch =
        urlSearch === "" || pokemon.name.toLowerCase().includes(urlSearch.toLowerCase());

      const matchesType = activeType === "" || pokemon.types.includes(activeType);

      return matchesSearch && matchesType;
    });
  }, [pokemons, urlSearch, activeType]);

  // isTyping = true when inputValue differs from urlSearch
  // meaning user is still typing, debounce hasn't fired yet
  const isTyping = inputValue !== urlSearch;

  // isEmpty = true only after debounce settles and no results found
  const isEmpty =
    !isTyping && (urlSearch !== "" || activeType !== "") && filteredPokemons.length === 0;

  const start = (currentPage - 1) * env.pageSize;
  const paginatedPokemons = filteredPokemons.slice(start, start + env.pageSize);

  return {
    search: inputValue,
    activeType,
    currentPage,
    isEmpty,
    isTyping,
    paginatedPokemons,
    totalItems: filteredPokemons.length,
    handleSearchChange,
    handleTypeChange,
    handlePageChange,
  };
};
