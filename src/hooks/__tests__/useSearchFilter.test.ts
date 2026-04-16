import { afterEach, beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { renderHook, act } from "@testing-library/react";
import React, { type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import type { PokemonCardProps } from "@/types/pokemon.type";

// Matches the auto-mock at src/config/__mocks__/env.ts
const TEST_PAGE_SIZE = 12;
// Matches the real DEBOUNCE_MS constant
const TEST_DEBOUNCE_MS = 400;

let useSearchFilter: (typeof import("@/hooks/useSearchFilter"))["useSearchFilter"];

beforeAll(async () => {
  window.scrollTo = jest.fn() as typeof window.scrollTo;
  const module = await import("@/hooks/useSearchFilter");
  useSearchFilter = module.useSearchFilter;
});

afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const createWrapper =
  (initialEntries = ["/"]) =>
  ({ children }: { children: ReactNode }) =>
    React.createElement(MemoryRouter, { initialEntries }, children);

const createPokemon = (
  id: number,
  name: string,
  types: string[] = ["normal"],
): PokemonCardProps => ({
  id,
  name,
  image: `/pokemon-${id}.png`,
  types,
});

// ─── Fixtures ─────────────────────────────────────────────────────────────────

// 6 items — fits within a single page (pageSize=12), useful for filter/search tests
const mixedPokemons: PokemonCardProps[] = [
  createPokemon(1, "bulbasaur", ["grass", "poison"]),
  createPokemon(2, "charmander", ["fire"]),
  createPokemon(3, "squirtle", ["water"]),
  createPokemon(4, "caterpie", ["bug"]),
  createPokemon(5, "metapod", ["bug"]),
  createPokemon(6, "pidgey", ["normal", "flying"]),
];

// 13 items — spans two pages (pageSize=12)
const largeList: PokemonCardProps[] = Array.from({ length: TEST_PAGE_SIZE + 1 }, (_, i) =>
  createPokemon(i + 1, `pokemon-${i + 1}`),
);

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("useSearchFilter", () => {
  describe("initial state", () => {
    it("returns empty search and no active type", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(),
      });

      expect(result.current.search).toBe("");
      expect(result.current.activeType).toBe("");
    });

    it("starts on page 1", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(),
      });

      expect(result.current.currentPage).toBe(1);
    });

    it("isEmpty is false with no filters applied", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(),
      });

      expect(result.current.isEmpty).toBe(false);
    });

    it("isTyping is false initially", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(),
      });

      expect(result.current.isTyping).toBe(false);
    });

    it("returns all pokemons when list fits within a single page", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(),
      });

      expect(result.current.paginatedPokemons).toEqual(mixedPokemons);
    });

    it("totalItems equals the full list length", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(),
      });

      expect(result.current.totalItems).toBe(mixedPokemons.length);
    });
  });

  describe("handleSearchChange", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it("updates search (inputValue) immediately", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleSearchChange("char");
      });

      expect(result.current.search).toBe("char");
    });

    it("sets isTyping to true before debounce fires", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleSearchChange("char");
      });

      expect(result.current.isTyping).toBe(true);
    });

    it("resets currentPage to 1 immediately", () => {
      const { result } = renderHook(() => useSearchFilter(largeList), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handlePageChange(2);
      });

      act(() => {
        result.current.handleSearchChange("char");
      });

      expect(result.current.currentPage).toBe(1);
    });

    it("filters pokemons by name after debounce fires", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleSearchChange("char");
        jest.advanceTimersByTime(TEST_DEBOUNCE_MS);
      });

      expect(result.current.totalItems).toBe(1);
      expect(result.current.paginatedPokemons[0].name).toBe("charmander");
    });

    it("search is case-insensitive after debounce", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleSearchChange("CHAR");
        jest.advanceTimersByTime(TEST_DEBOUNCE_MS);
      });

      expect(result.current.totalItems).toBe(1);
      expect(result.current.paginatedPokemons[0].name).toBe("charmander");
    });

    it("isTyping is false after debounce fires", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleSearchChange("char");
        jest.advanceTimersByTime(TEST_DEBOUNCE_MS);
      });

      expect(result.current.isTyping).toBe(false);
    });

    it("clears search when empty string is passed after debounce", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleSearchChange("char");
        jest.advanceTimersByTime(TEST_DEBOUNCE_MS);
      });

      act(() => {
        result.current.handleSearchChange("");
        jest.advanceTimersByTime(TEST_DEBOUNCE_MS);
      });

      expect(result.current.totalItems).toBe(mixedPokemons.length);
    });

    it("debounces rapid keystrokes — only last value is applied", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleSearchChange("c");
        jest.advanceTimersByTime(100);
        result.current.handleSearchChange("ch");
        jest.advanceTimersByTime(100);
        result.current.handleSearchChange("cha");
        jest.advanceTimersByTime(100);
        result.current.handleSearchChange("char");
        jest.advanceTimersByTime(TEST_DEBOUNCE_MS);
      });

      expect(result.current.totalItems).toBe(1);
      expect(result.current.paginatedPokemons[0].name).toBe("charmander");
    });
  });

  describe("handleTypeChange", () => {
    it("filters pokemons by type", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleTypeChange("bug");
      });

      expect(result.current.activeType).toBe("bug");
      expect(result.current.totalItems).toBe(2);
      expect(result.current.paginatedPokemons.every((p) => p.types.includes("bug"))).toBe(true);
    });

    it("resets currentPage to 1 when type changes", () => {
      const { result } = renderHook(() => useSearchFilter(largeList), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handlePageChange(2);
      });

      act(() => {
        result.current.handleTypeChange("normal");
      });

      expect(result.current.currentPage).toBe(1);
    });

    it("clears type filter when the same type is selected again (toggle off)", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleTypeChange("bug");
      });

      act(() => {
        result.current.handleTypeChange("bug");
      });

      expect(result.current.activeType).toBe("");
      expect(result.current.totalItems).toBe(mixedPokemons.length);
    });

    it("replaces active type when a different type is selected", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleTypeChange("bug");
      });

      act(() => {
        result.current.handleTypeChange("fire");
      });

      expect(result.current.activeType).toBe("fire");
      expect(result.current.totalItems).toBe(1);
    });
  });

  describe("combined search and type filter", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it("applies both search and type filter together", () => {
      const pokemons = [
        createPokemon(1, "bulbasaur", ["grass", "poison"]),
        createPokemon(2, "ivysaur", ["grass", "poison"]),
        createPokemon(3, "charmander", ["fire"]),
      ];

      const { result } = renderHook(() => useSearchFilter(pokemons), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleTypeChange("grass");
      });

      act(() => {
        result.current.handleSearchChange("ivy");
        jest.advanceTimersByTime(TEST_DEBOUNCE_MS);
      });

      expect(result.current.totalItems).toBe(1);
      expect(result.current.paginatedPokemons[0].name).toBe("ivysaur");
    });

    it("isEmpty is true when filters yield no results after debounce", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleSearchChange("zzznomatch");
        jest.advanceTimersByTime(TEST_DEBOUNCE_MS);
      });

      expect(result.current.isEmpty).toBe(true);
    });

    it("isEmpty is false while the user is still typing (debounce pending)", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleSearchChange("zzznomatch");
        // do NOT advance timers — debounce hasn't fired yet
      });

      expect(result.current.isEmpty).toBe(false);
    });

    it("isEmpty is false when no filter is active, even if list is empty", () => {
      const { result } = renderHook(() => useSearchFilter([]), {
        wrapper: createWrapper(),
      });

      expect(result.current.isEmpty).toBe(false);
    });

    it("isEmpty is true when type filter yields no results", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleTypeChange("dragon");
      });

      expect(result.current.isEmpty).toBe(true);
    });
  });

  describe("pagination", () => {
    it("handlePageChange updates currentPage", () => {
      const { result } = renderHook(() => useSearchFilter(largeList), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handlePageChange(2);
      });

      expect(result.current.currentPage).toBe(2);
    });

    it("handlePageChange calls window.scrollTo to the top", () => {
      const { result } = renderHook(() => useSearchFilter(largeList), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handlePageChange(2);
      });

      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });

    it("page 1 returns the first TEST_PAGE_SIZE items", () => {
      const { result } = renderHook(() => useSearchFilter(largeList), {
        wrapper: createWrapper(),
      });

      expect(result.current.paginatedPokemons).toEqual(largeList.slice(0, TEST_PAGE_SIZE));
    });

    it("page 2 returns the remaining items beyond TEST_PAGE_SIZE", () => {
      const { result } = renderHook(() => useSearchFilter(largeList), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handlePageChange(2);
      });

      expect(result.current.paginatedPokemons).toEqual(largeList.slice(TEST_PAGE_SIZE));
    });

    it("totalItems reflects filtered count, not paginated count", () => {
      const { result } = renderHook(() => useSearchFilter(largeList), {
        wrapper: createWrapper(),
      });

      expect(result.current.totalItems).toBe(largeList.length);
    });
  });

  describe("URL search params initialisation", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it("reads initial search from URL", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(["/?search=char"]),
      });

      expect(result.current.search).toBe("char");
    });

    it("reads initial type from URL", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(["/?type=fire"]),
      });

      expect(result.current.activeType).toBe("fire");
    });

    it("filters pokemons using initial URL type param", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(["/?type=bug"]),
      });

      expect(result.current.totalItems).toBe(2);
    });

    it("filters pokemons using initial URL search param", () => {
      const { result } = renderHook(() => useSearchFilter(mixedPokemons), {
        wrapper: createWrapper(["/?search=char"]),
      });

      expect(result.current.totalItems).toBe(1);
    });
  });
});
