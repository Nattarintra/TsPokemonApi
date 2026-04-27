import { afterEach, beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { renderHook, act } from "@testing-library/react";
import type { PokemonCardProps } from "@/types/pokemon.type";

const FAVORITES_KEY = "pokemon-favorites";

let useFavorites: (typeof import("@/hooks/useFavorites"))["useFavorites"];

beforeAll(async () => {
  const module = await import("@/hooks/useFavorites");
  useFavorites = module.useFavorites;
});

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const createPokemon = (id: number, name: string): PokemonCardProps => ({
  id,
  name,
  image: `/pokemon-${id}.png`,
  types: ["normal"],
});

const bulbasaur = createPokemon(1, "bulbasaur");
const charmander = createPokemon(4, "charmander");
const squirtle = createPokemon(7, "squirtle");

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("useFavorites", () => {
  describe("initial state", () => {
    it("loads favorites from localStorage on mount", () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([bulbasaur, charmander]));

      const { result } = renderHook(() => useFavorites());

      expect(result.current.favorites).toEqual([bulbasaur, charmander]);
    });

    it("returns empty array when localStorage is empty", () => {
      const { result } = renderHook(() => useFavorites());

      expect(result.current.favorites).toEqual([]);
    });

    it("returns empty array when localStorage throws", () => {
      jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("storage error");
      });

      const { result } = renderHook(() => useFavorites());

      expect(result.current.favorites).toEqual([]);
    });
  });

  describe("isFavorite", () => {
    it("returns true when pokemon id is in favorites", () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([bulbasaur]));

      const { result } = renderHook(() => useFavorites());

      expect(result.current.isFavorite(bulbasaur.id)).toBe(true);
    });

    it("returns false when pokemon id is not in favorites", () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([bulbasaur]));

      const { result } = renderHook(() => useFavorites());

      expect(result.current.isFavorite(charmander.id)).toBe(false);
    });
  });

  describe("toggleFavorite", () => {
    it("adds pokemon to favorites when not already favorited", () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite(bulbasaur);
      });

      expect(result.current.favorites).toContainEqual(bulbasaur);
    });

    it("removes pokemon from favorites when already favorited", () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([bulbasaur]));

      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite(bulbasaur);
      });

      expect(result.current.favorites).not.toContainEqual(bulbasaur);
    });

    it("saves updated favorites to localStorage after add", () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite(bulbasaur);
      });

      const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "[]");
      expect(stored).toContainEqual(bulbasaur);
    });

    it("saves updated favorites to localStorage after remove", () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([bulbasaur]));

      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite(bulbasaur);
      });

      const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "[]");
      expect(stored).not.toContainEqual(bulbasaur);
    });

    it("does not affect other favorites when removing one", () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([bulbasaur, charmander, squirtle]));

      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite(charmander);
      });

      expect(result.current.favorites).toContainEqual(bulbasaur);
      expect(result.current.favorites).not.toContainEqual(charmander);
      expect(result.current.favorites).toContainEqual(squirtle);
    });
  });

  describe("localStorage error handling", () => {
    it("does not throw when localStorage.setItem fails", () => {
      jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("quota exceeded");
      });

      const { result } = renderHook(() => useFavorites());

      expect(() => {
        act(() => {
          result.current.toggleFavorite(bulbasaur);
        });
      }).not.toThrow();
    });
  });
});
