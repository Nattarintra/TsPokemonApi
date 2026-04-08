/**
 * @jest-environment jsdom
 */
import { jest, describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type ReactNode } from "react";
import type { PokemonListResult } from "@/types/pokemon.type";
import { QUERY_KEYS } from "@/constants";
import { usePokemonNavigation } from "@/hooks/usePokemonNavigation";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const createQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const createWrapper = (queryClient: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const makeList = (pokemon: { id: number; name: string }[]): PokemonListResult => ({
  pokemons: pokemon.map(({ id, name }) => ({ id, name, image: "", types: [] })),
  failed: 0,
});

const threePokemons = makeList([
  { id: 1, name: "bulbasaur" },
  { id: 2, name: "ivysaur" },
  { id: 3, name: "venusaur" },
]);

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("usePokemonNavigation", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createQueryClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when cache is empty", () => {
    it("returns null for both previousPokemon and nextPokemon", () => {
      const { result } = renderHook(
        () => usePokemonNavigation(1),
        { wrapper: createWrapper(queryClient) },
      );

      expect(result.current.previousPokemon).toBeNull();
      expect(result.current.nextPokemon).toBeNull();
    });
  });

  describe("when pokemon is not found in cache", () => {
    it("returns null for both previousPokemon and nextPokemon", () => {
      queryClient.setQueryData(QUERY_KEYS.POKEMON_LIST, threePokemons);

      const { result } = renderHook(
        () => usePokemonNavigation(999),
        { wrapper: createWrapper(queryClient) },
      );

      expect(result.current.previousPokemon).toBeNull();
      expect(result.current.nextPokemon).toBeNull();
    });
  });

  describe("when pokemon is first in the list", () => {
    it("returns null for previousPokemon", () => {
      queryClient.setQueryData(QUERY_KEYS.POKEMON_LIST, threePokemons);

      const { result } = renderHook(
        () => usePokemonNavigation(1),
        { wrapper: createWrapper(queryClient) },
      );

      expect(result.current.previousPokemon).toBeNull();
    });

    it("returns correct nextPokemon (id and name)", () => {
      queryClient.setQueryData(QUERY_KEYS.POKEMON_LIST, threePokemons);

      const { result } = renderHook(
        () => usePokemonNavigation(1),
        { wrapper: createWrapper(queryClient) },
      );

      expect(result.current.nextPokemon).toEqual({ id: 2, name: "ivysaur" });
    });
  });

  describe("when pokemon is last in the list", () => {
    it("returns correct previousPokemon (id and name)", () => {
      queryClient.setQueryData(QUERY_KEYS.POKEMON_LIST, threePokemons);

      const { result } = renderHook(
        () => usePokemonNavigation(3),
        { wrapper: createWrapper(queryClient) },
      );

      expect(result.current.previousPokemon).toEqual({ id: 2, name: "ivysaur" });
    });

    it("returns null for nextPokemon", () => {
      queryClient.setQueryData(QUERY_KEYS.POKEMON_LIST, threePokemons);

      const { result } = renderHook(
        () => usePokemonNavigation(3),
        { wrapper: createWrapper(queryClient) },
      );

      expect(result.current.nextPokemon).toBeNull();
    });
  });

  describe("when pokemon is in the middle of the list", () => {
    it("returns correct previousPokemon (id and name)", () => {
      queryClient.setQueryData(QUERY_KEYS.POKEMON_LIST, threePokemons);

      const { result } = renderHook(
        () => usePokemonNavigation(2),
        { wrapper: createWrapper(queryClient) },
      );

      expect(result.current.previousPokemon).toEqual({ id: 1, name: "bulbasaur" });
    });

    it("returns correct nextPokemon (id and name)", () => {
      queryClient.setQueryData(QUERY_KEYS.POKEMON_LIST, threePokemons);

      const { result } = renderHook(
        () => usePokemonNavigation(2),
        { wrapper: createWrapper(queryClient) },
      );

      expect(result.current.nextPokemon).toEqual({ id: 3, name: "venusaur" });
    });
  });
});
