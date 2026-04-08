/**
 * @jest-environment node
 */
import { jest, describe, it, expect, beforeAll, beforeEach, afterEach } from "@jest/globals";
import type {
  PokemonDetail,
  PokemonSpecies,
  EvolutionChain,
} from "@/types/pokemon.type";

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE = "https://pokeapi.co/api/v2";
const POKEMON_URL = `${API_BASE}/pokemon/1`;
const SPECIES_URL = `${API_BASE}/pokemon-species/1`;
const EVOLUTION_CHAIN_URL = "https://pokeapi.co/api/v2/evolution-chain/1/";

// ─── Fetch mock ───────────────────────────────────────────────────────────────

const mockFetch = jest.fn<typeof fetch>();

const makeOkResponse = (data: unknown) =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: "OK",
    json: () => Promise.resolve(data),
  } as Response);

const makeErrorResponse = (status: number) =>
  Promise.resolve({
    ok: false,
    status,
    statusText: "Not Found",
    json: () => Promise.resolve({}),
  } as Response);

// ─── Module under test ────────────────────────────────────────────────────────

let getPokemonDetailData: (typeof import("@/api/pokemonDetail.service"))["getPokemonDetailData"];

beforeAll(async () => {
  const module = await import("@/api/pokemonDetail.service");
  getPokemonDetailData = module.getPokemonDetailData;
});

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockDetail: PokemonDetail = {
  id: 1,
  name: "bulbasaur",
  height: 7,
  weight: 69,
  sprites: { other: { "official-artwork": { front_default: "https://img.png" } } },
  types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
  abilities: [
    { ability: { name: "overgrow" }, is_hidden: false },
    { ability: { name: "chlorophyll" }, is_hidden: true },
  ],
  stats: [
    { stat: { name: "hp" }, base_stat: 45 },
    { stat: { name: "attack" }, base_stat: 49 },
  ],
};

const mockSpecies: PokemonSpecies = {
  gender_rate: 1,
  genera: [{ genus: "Seed Pokémon", language: { name: "en" } }],
  flavor_text_entries: [
    {
      flavor_text: "A strange\nseed.",
      language: { name: "en" },
      version: { name: "red" },
    },
  ],
  evolution_chain: { url: EVOLUTION_CHAIN_URL },
};

const mockEvolutionChain: EvolutionChain = {
  chain: {
    species: { name: "bulbasaur", url: "" },
    evolves_to: [
      {
        species: { name: "ivysaur", url: "" },
        evolves_to: [
          { species: { name: "venusaur", url: "" }, evolves_to: [] },
        ],
      },
    ],
  },
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("getPokemonDetailData", () => {
  beforeEach(() => {
    global.fetch = mockFetch as unknown as typeof fetch;
    mockFetch.mockImplementation((input) => {
      const url = input.toString();
      if (url === POKEMON_URL) return makeOkResponse(mockDetail);
      if (url === SPECIES_URL) return makeOkResponse(mockSpecies);
      if (url === EVOLUTION_CHAIN_URL) return makeOkResponse(mockEvolutionChain);
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches pokemon and species in parallel (Promise.all)", async () => {
    await getPokemonDetailData(1);

    const urls = mockFetch.mock.calls.map((call) => call[0]?.toString());
    expect(urls).toContain(POKEMON_URL);
    expect(urls).toContain(SPECIES_URL);
  });

  it("fetches evolution chain using URL from species response", async () => {
    await getPokemonDetailData(1);

    const urls = mockFetch.mock.calls.map((call) => call[0]?.toString());
    expect(urls).toContain(EVOLUTION_CHAIN_URL);
  });

  it("returns correctly shaped PokemonDetailProps", async () => {
    const result = await getPokemonDetailData(1);

    expect(result).toHaveProperty("identity");
    expect(result).toHaveProperty("bio");
    expect(result).toHaveProperty("combat");
    expect(result).toHaveProperty("evolutions");
  });

  it("formats identity correctly (id, name, image)", async () => {
    const { identity } = await getPokemonDetailData(1);

    expect(identity).toEqual({
      id: 1,
      name: "bulbasaur",
      image: "https://img.png",
    });
  });

  it("formats bio correctly (height, weight, category, description)", async () => {
    const { bio } = await getPokemonDetailData(1);

    expect(bio.height).toBe('2\'04"');
    expect(bio.weight).toBe("15.2 lbs");
    expect(bio.category).toBe("Seed Pokémon");
    expect(bio.description).toBe("A strange seed.");
  });

  it("excludes hidden abilities from bio.abilities", async () => {
    const { bio } = await getPokemonDetailData(1);

    expect(bio.abilities).toEqual(["overgrow"]);
    expect(bio.abilities).not.toContain("chlorophyll");
  });

  it("maps stats correctly to name and value", async () => {
    const { combat } = await getPokemonDetailData(1);

    expect(combat.stats).toEqual([
      { name: "hp", value: 45 },
      { name: "attack", value: 49 },
    ]);
  });

  it("returns empty weaknesses array", async () => {
    const { combat } = await getPokemonDetailData(1);

    expect(combat.weaknesses).toEqual([]);
  });

  it("returns evolution names with placeholder id and image", async () => {
    const { evolutions } = await getPokemonDetailData(1);

    expect(evolutions).toEqual([
      { id: 0, name: "bulbasaur", image: "", types: [] },
      { id: 0, name: "ivysaur", image: "", types: [] },
      { id: 0, name: "venusaur", image: "", types: [] },
    ]);
  });

  it("throws when fetchPokemonById fails", async () => {
    mockFetch.mockImplementation((input) => {
      const url = input.toString();
      if (url === POKEMON_URL) return makeErrorResponse(404);
      if (url === SPECIES_URL) return makeOkResponse(mockSpecies);
      if (url === EVOLUTION_CHAIN_URL) return makeOkResponse(mockEvolutionChain);
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    await expect(getPokemonDetailData(1)).rejects.toMatchObject({
      type: "HTTP_ERROR",
      status: 404,
    });
  });

  it("throws when fetchPokemonSpecies fails", async () => {
    mockFetch.mockImplementation((input) => {
      const url = input.toString();
      if (url === POKEMON_URL) return makeOkResponse(mockDetail);
      if (url === SPECIES_URL) return makeErrorResponse(404);
      if (url === EVOLUTION_CHAIN_URL) return makeOkResponse(mockEvolutionChain);
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    await expect(getPokemonDetailData(1)).rejects.toMatchObject({
      type: "HTTP_ERROR",
      status: 404,
    });
  });
});
