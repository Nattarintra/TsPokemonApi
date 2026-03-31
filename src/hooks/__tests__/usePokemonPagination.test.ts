import { afterEach, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { renderHook, act } from "@testing-library/react";
import type { PokemonCardProps } from "@/types/pokemon.type";

const TEST_PAGE_SIZE = 3;

jest.unstable_mockModule("@/config", () => ({
  env: {
    pageSize: TEST_PAGE_SIZE,
  },
}));

let usePokemonPagination: (typeof import("@/hooks/usePokemonPagination"))["usePokemonPagination"];

beforeAll(async () => {
  window.scrollTo = jest.fn() as typeof window.scrollTo;
  const module = await import("@/hooks/usePokemonPagination");
  usePokemonPagination = module.usePokemonPagination;
});

afterEach(() => {
  jest.clearAllMocks();
});

const createPokemon = (id: number): PokemonCardProps => ({
  id,
  name: `pokemon-${id}`,
  image: `/pokemon-${id}.png`,
  types: ["normal"],
});

describe("usePokemonPagination", () => {
  it("starts on page 1", () => {
    const { result } = renderHook(() => usePokemonPagination([]));

    expect(result.current.currentPage).toBe(1);
  });

  it("returns totalItems equal to the length of the pokemon list", () => {
    const pokemons = [createPokemon(1), createPokemon(2), createPokemon(3)];
    const { result } = renderHook(() => usePokemonPagination(pokemons));

    expect(result.current.totalItems).toBe(3);
  });

  it("returns empty paginatedPokemons and zero totalItems for an empty list", () => {
    const { result } = renderHook(() => usePokemonPagination([]));

    expect(result.current.paginatedPokemons).toEqual([]);
    expect(result.current.totalItems).toBe(0);
  });

  it("returns all pokemons on page 1 when count is within pageSize", () => {
    const pokemons = [createPokemon(1), createPokemon(2)];
    const { result } = renderHook(() => usePokemonPagination(pokemons));

    expect(result.current.paginatedPokemons).toEqual(pokemons);
  });

  it("returns only the first page of pokemons when list exceeds pageSize", () => {
    const pokemons = Array.from({ length: TEST_PAGE_SIZE + 2 }, (_, i) => createPokemon(i + 1));
    const { result } = renderHook(() => usePokemonPagination(pokemons));

    expect(result.current.paginatedPokemons).toEqual(pokemons.slice(0, TEST_PAGE_SIZE));
  });

  it("updates currentPage and paginatedPokemons when handlePageChange is called", () => {
    const pokemons = Array.from({ length: TEST_PAGE_SIZE + 2 }, (_, i) => createPokemon(i + 1));
    const { result } = renderHook(() => usePokemonPagination(pokemons));

    act(() => {
      result.current.handlePageChange(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.paginatedPokemons).toEqual(pokemons.slice(TEST_PAGE_SIZE));
  });

  it("calls window.scrollTo to the top when the page changes", () => {
    const pokemons = Array.from({ length: TEST_PAGE_SIZE + 1 }, (_, i) => createPokemon(i + 1));
    const { result } = renderHook(() => usePokemonPagination(pokemons));

    act(() => {
      result.current.handlePageChange(2);
    });

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("shows the correct slice on an intermediate page", () => {
    const pokemons = Array.from({ length: TEST_PAGE_SIZE * 3 }, (_, i) => createPokemon(i + 1));
    const { result } = renderHook(() => usePokemonPagination(pokemons));

    act(() => {
      result.current.handlePageChange(2);
    });

    expect(result.current.paginatedPokemons).toEqual(
      pokemons.slice(TEST_PAGE_SIZE, TEST_PAGE_SIZE * 2),
    );
  });
});
