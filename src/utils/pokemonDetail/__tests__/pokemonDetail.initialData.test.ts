/**
 * @jest-environment node
 */
import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import type { PokemonListResult } from "@/types/pokemon.type";
import {
  getPokemonDetailInitialData,
  getPokemonDetailInitialDataUpdatedAt,
} from "@/utils/pokemonDetail/pokemonDetail.initialData";
import type { QueryClient } from "@tanstack/react-query";

// ─── Mock QueryClient ─────────────────────────────────────────────────────────

const mockGetQueryData = jest.fn();
const mockGetQueryState = jest.fn();

const mockQueryClient = {
  getQueryData: mockGetQueryData,
  getQueryState: mockGetQueryState,
} as unknown as QueryClient;

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockPokemon = {
  id: 1,
  name: "bulbasaur",
  image: "https://img.png",
  types: ["grass", "poison"],
};

const mockListResult: PokemonListResult = {
  pokemons: [mockPokemon],
  failed: 0,
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("getPokemonDetailInitialData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns undefined when pokemon-list cache is empty", () => {
    mockGetQueryData.mockReturnValue(undefined);

    const result = getPokemonDetailInitialData(mockQueryClient, 1);

    expect(result).toBeUndefined();
  });

  it("returns undefined when id is not found in cache", () => {
    mockGetQueryData.mockReturnValue(mockListResult);

    const result = getPokemonDetailInitialData(mockQueryClient, 999);

    expect(result).toBeUndefined();
  });

  it("returns correct identity (id, name, image) from cached pokemon", () => {
    mockGetQueryData.mockReturnValue(mockListResult);

    const { identity } = getPokemonDetailInitialData(mockQueryClient, 1)!;

    expect(identity).toEqual({
      id: 1,
      name: "bulbasaur",
      image: "https://img.png",
    });
  });

  it("returns correct combat.types from cached pokemon", () => {
    mockGetQueryData.mockReturnValue(mockListResult);

    const { combat } = getPokemonDetailInitialData(mockQueryClient, 1)!;

    expect(combat.types).toEqual(["grass", "poison"]);
  });

  it("returns empty placeholders for bio fields (description, height, weight, category, abilities, gender)", () => {
    mockGetQueryData.mockReturnValue(mockListResult);

    const { bio } = getPokemonDetailInitialData(mockQueryClient, 1)!;

    expect(bio.description).toBe("");
    expect(bio.height).toBe("");
    expect(bio.weight).toBe("");
    expect(bio.category).toBe("");
    expect(bio.abilities).toEqual([]);
    expect(bio.gender).toEqual([]);
  });

  it("returns empty weaknesses and stats in combat", () => {
    mockGetQueryData.mockReturnValue(mockListResult);

    const { combat } = getPokemonDetailInitialData(mockQueryClient, 1)!;

    expect(combat.weaknesses).toEqual([]);
    expect(combat.stats).toEqual([]);
  });

  it("returns empty evolutions array", () => {
    mockGetQueryData.mockReturnValue(mockListResult);

    const { evolutions } = getPokemonDetailInitialData(mockQueryClient, 1)!;

    expect(evolutions).toEqual([]);
  });

  it("returns evolutionsFailed = 0 in initial data", () => {
    mockGetQueryData.mockReturnValue(mockListResult);

    const { evolutionsFailed } = getPokemonDetailInitialData(mockQueryClient, 1)!;

    expect(evolutionsFailed).toBe(0);
  });
});

describe("getPokemonDetailInitialDataUpdatedAt", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns dataUpdatedAt when pokemon-list query state exists", () => {
    mockGetQueryState.mockReturnValue({ dataUpdatedAt: 1712345678000 });

    const result = getPokemonDetailInitialDataUpdatedAt(mockQueryClient);

    expect(result).toBe(1712345678000);
  });

  it("returns undefined when pokemon-list query state does not exist", () => {
    mockGetQueryState.mockReturnValue(undefined);

    const result = getPokemonDetailInitialDataUpdatedAt(mockQueryClient);

    expect(result).toBeUndefined();
  });
});
