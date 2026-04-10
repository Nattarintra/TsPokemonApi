/**
 * @jest-environment node
 */
import { jest, describe, it, expect, beforeAll, beforeEach } from "@jest/globals";
import { AppError } from "@/errors/errorClasses";

// ─── URL constants ────────────────────────────────────────────────────────────

const API_BASE = "https://pokeapi.co/api/v2";
const POKEMON_URL = `${API_BASE}/pokemon`;
const SPECIES_URL = `${API_BASE}/pokemon-species`;
const EVOLUTION_CHAIN_URL = `${API_BASE}/evolution-chain/1/`;
const TYPE_URL = `${API_BASE}/type`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeOkResponse = (body: unknown): Response =>
  ({
    ok: true,
    status: 200,
    statusText: "OK",
    json: () => Promise.resolve(body),
  }) as unknown as Response;

const makeErrorResponse = (status: number, statusText: string): Response =>
  ({
    ok: false,
    status,
    statusText,
    json: () => Promise.resolve({}),
  }) as unknown as Response;

// ─── Module under test (dynamic import after mocks are set up) ────────────────

type PokemonApiModule = typeof import("@/api/pokemon.api");

let fetchPokemonList: PokemonApiModule["fetchPokemonList"];
let fetchPokemonById: PokemonApiModule["fetchPokemonById"];
let fetchPokemonByName: PokemonApiModule["fetchPokemonByName"];
let fetchPokemonSpecies: PokemonApiModule["fetchPokemonSpecies"];
let fetchEvolutionChain: PokemonApiModule["fetchEvolutionChain"];
let fetchPokemonSummaries: PokemonApiModule["fetchPokemonSummaries"];
let fetchPokemonType: PokemonApiModule["fetchPokemonType"];

beforeAll(async () => {
  const module = await import("@/api/pokemon.api");
  fetchPokemonList = module.fetchPokemonList;
  fetchPokemonById = module.fetchPokemonById;
  fetchPokemonByName = module.fetchPokemonByName;
  fetchPokemonSpecies = module.fetchPokemonSpecies;
  fetchEvolutionChain = module.fetchEvolutionChain;
  fetchPokemonSummaries = module.fetchPokemonSummaries;
  fetchPokemonType = module.fetchPokemonType;
});

// ─── Setup ───────────────────────────────────────────────────────────────────

const mockFetch = jest.fn<typeof fetch>();

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = mockFetch as unknown as typeof fetch;
});

// ─── fetchPokemonList ─────────────────────────────────────────────────────────

describe("fetchPokemonList", () => {
  it("returns the results array from the API response", async () => {
    const mockResults = [
      { name: "bulbasaur", url: `${POKEMON_URL}/1/` },
      { name: "ivysaur", url: `${POKEMON_URL}/2/` },
    ];
    mockFetch.mockResolvedValue(makeOkResponse({ results: mockResults }));

    const result = await fetchPokemonList();

    expect(result).toEqual(mockResults);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("calls the correct endpoint", async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ results: [] }));

    await fetchPokemonList();

    const calledUrl = (mockFetch.mock.calls[0] as unknown[])[0] as string;
    expect(calledUrl).toContain("/pokemon");
  });

  it("throws an AppError with HTTP_ERROR type on a non-ok response", async () => {
    mockFetch.mockResolvedValue(makeErrorResponse(404, "Not Found"));

    await expect(fetchPokemonList()).rejects.toMatchObject({
      type: "HTTP_ERROR",
      status: 404,
      message: "Not Found",
    });
  });

  it("throws an AppError with NETWORK_ERROR type when fetch itself throws", async () => {
    mockFetch.mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(fetchPokemonList()).rejects.toBeInstanceOf(AppError);
    await expect(fetchPokemonList()).rejects.toMatchObject({
      type: "NETWORK_ERROR",
    });
  });
});

// ─── fetchPokemonById ─────────────────────────────────────────────────────────

describe("fetchPokemonById", () => {
  const mockPokemon = {
    id: 25,
    name: "pikachu",
    sprites: { other: { "official-artwork": { front_default: "img.png" } } },
    types: [{ type: { name: "electric" } }],
  };

  it("returns the parsed PokemonDetail for the given id", async () => {
    mockFetch.mockResolvedValue(makeOkResponse(mockPokemon));

    const result = await fetchPokemonById(25);

    expect(result).toEqual(mockPokemon);
  });

  it("calls the endpoint with the correct id", async () => {
    mockFetch.mockResolvedValue(makeOkResponse(mockPokemon));

    await fetchPokemonById(25);

    const calledUrl = (mockFetch.mock.calls[0] as unknown[])[0] as string;
    expect(calledUrl).toContain(`${POKEMON_URL}/25`);
  });

  it("throws an AppError with HTTP_ERROR type on a non-ok response", async () => {
    mockFetch.mockResolvedValue(makeErrorResponse(404, "Not Found"));

    await expect(fetchPokemonById(9999)).rejects.toMatchObject({
      type: "HTTP_ERROR",
      status: 404,
    });
  });

  it("throws an AppError with NETWORK_ERROR type when fetch itself throws", async () => {
    mockFetch.mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(fetchPokemonById(25)).rejects.toMatchObject({
      type: "NETWORK_ERROR",
    });
  });
});

// ─── fetchPokemonByName ───────────────────────────────────────────────────────

describe("fetchPokemonByName", () => {
  const mockPokemon = {
    id: 1,
    name: "bulbasaur",
    sprites: { other: { "official-artwork": { front_default: "img.png" } } },
    types: [{ type: { name: "grass" } }],
  };

  it("calls the correct URL with the given name", async () => {
    mockFetch.mockResolvedValue(makeOkResponse(mockPokemon));

    await fetchPokemonByName("bulbasaur");

    const calledUrl = (mockFetch.mock.calls[0] as unknown[])[0] as string;
    expect(calledUrl).toContain(`${POKEMON_URL}/bulbasaur`);
  });

  it("returns PokemonDetail on success", async () => {
    mockFetch.mockResolvedValue(makeOkResponse(mockPokemon));

    const result = await fetchPokemonByName("bulbasaur");

    expect(result).toEqual(mockPokemon);
  });

  it("throws AppError on HTTP error (e.g. 404)", async () => {
    mockFetch.mockResolvedValue(makeErrorResponse(404, "Not Found"));

    await expect(fetchPokemonByName("missingno")).rejects.toMatchObject({
      type: "HTTP_ERROR",
      status: 404,
    });
  });

  it("throws AppError on network failure", async () => {
    mockFetch.mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(fetchPokemonByName("bulbasaur")).rejects.toMatchObject({
      type: "NETWORK_ERROR",
    });
  });
});

// ─── fetchPokemonSpecies ──────────────────────────────────────────────────────

describe("fetchPokemonSpecies", () => {
  const mockSpecies = {
    gender_rate: 4,
    genera: [{ genus: "Seed Pokémon", language: { name: "en" } }],
    flavor_text_entries: [],
    evolution_chain: { url: EVOLUTION_CHAIN_URL },
  };

  it("returns the parsed PokemonSpecies for the given id", async () => {
    mockFetch.mockResolvedValue(makeOkResponse(mockSpecies));

    const result = await fetchPokemonSpecies(1);

    expect(result).toEqual(mockSpecies);
  });

  it("calls the endpoint with the correct id", async () => {
    mockFetch.mockResolvedValue(makeOkResponse(mockSpecies));

    await fetchPokemonSpecies(1);

    const calledUrl = (mockFetch.mock.calls[0] as unknown[])[0] as string;
    expect(calledUrl).toContain(`${SPECIES_URL}/1`);
  });

  it("throws an AppError with HTTP_ERROR type on a non-ok response", async () => {
    mockFetch.mockResolvedValue(makeErrorResponse(500, "Internal Server Error"));

    await expect(fetchPokemonSpecies(1)).rejects.toMatchObject({
      type: "HTTP_ERROR",
      status: 500,
    });
  });

  it("throws an AppError with NETWORK_ERROR type when fetch itself throws", async () => {
    mockFetch.mockRejectedValue(new TypeError("Network failure"));

    await expect(fetchPokemonSpecies(1)).rejects.toMatchObject({
      type: "NETWORK_ERROR",
    });
  });
});

// ─── fetchEvolutionChain ──────────────────────────────────────────────────────

describe("fetchEvolutionChain", () => {
  const mockChain = {
    chain: {
      species: { name: "bulbasaur", url: "" },
      evolves_to: [
        {
          species: { name: "ivysaur", url: "" },
          evolves_to: [],
        },
      ],
    },
  };

  it("returns the parsed EvolutionChain from the given url", async () => {
    mockFetch.mockResolvedValue(makeOkResponse(mockChain));

    const result = await fetchEvolutionChain(EVOLUTION_CHAIN_URL);

    expect(result).toEqual(mockChain);
    expect(mockFetch).toHaveBeenCalledWith(EVOLUTION_CHAIN_URL);
  });

  it("throws an AppError with HTTP_ERROR type on a non-ok response", async () => {
    mockFetch.mockResolvedValue(makeErrorResponse(403, "Forbidden"));

    await expect(fetchEvolutionChain(EVOLUTION_CHAIN_URL)).rejects.toMatchObject({
      type: "HTTP_ERROR",
      status: 403,
    });
  });

  it("throws an AppError with NETWORK_ERROR type when fetch itself throws", async () => {
    mockFetch.mockRejectedValue(new Error("Timeout"));

    await expect(fetchEvolutionChain(EVOLUTION_CHAIN_URL)).rejects.toMatchObject({
      type: "NETWORK_ERROR",
    });
  });
});

// ─── fetchPokemonSummaries ──────────────────────────────────────────────────────

describe("fetchPokemonSummaries", () => {
  const mockPokemon = {
    id: 1,
    name: "bulbasaur",
    sprites: { other: { "official-artwork": { front_default: "img.png" } } },
    types: [{ type: { name: "grass" } }],
  };

  const makeList = (count: number) =>
    Array.from({ length: count }, (_, i) => ({
      name: `pokemon-${i + 1}`,
      url: `${POKEMON_URL}/${i + 1}/`,
    }));

  it("returns successfully fetched pokemon and a zero failed count", async () => {
    mockFetch.mockResolvedValue(makeOkResponse(mockPokemon));

    const result = await fetchPokemonSummaries(makeList(1));

    expect(result.pokemons).toHaveLength(1);
    expect(result.pokemons[0]).toEqual(mockPokemon);
    expect(result.failed).toBe(0);
  });

  it("counts failed fetches without throwing", async () => {
    mockFetch
      .mockResolvedValueOnce(makeOkResponse(mockPokemon))
      .mockResolvedValueOnce(makeErrorResponse(404, "Not Found"));

    const result = await fetchPokemonSummaries(makeList(2));

    expect(result.pokemons).toHaveLength(1);
    expect(result.failed).toBe(1);
  });

  it("returns all failed when every request errors", async () => {
    mockFetch.mockResolvedValue(makeErrorResponse(500, "Server Error"));

    const result = await fetchPokemonSummaries(makeList(2));

    expect(result.pokemons).toHaveLength(0);
    expect(result.failed).toBe(2);
  });

  it("returns empty arrays for an empty list", async () => {
    const result = await fetchPokemonSummaries([]);

    expect(result.pokemons).toHaveLength(0);
    expect(result.failed).toBe(0);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

// ─── fetchPokemonType ─────────────────────────────────────────────────────────

describe("fetchPokemonType", () => {
  const mockTypeDetail = {
    name: "grass",
    damage_relations: {
      double_damage_from: [
        { name: "fire", url: "" },
        { name: "ice", url: "" },
      ],
    },
  };

  it("calls the correct URL with the given type name", async () => {
    mockFetch.mockResolvedValue(makeOkResponse(mockTypeDetail));

    await fetchPokemonType("grass");

    const calledUrl = (mockFetch.mock.calls[0] as unknown[])[0] as string;
    expect(calledUrl).toContain(`${TYPE_URL}/grass`);
  });

  it("returns PokemonTypeDetail on success", async () => {
    mockFetch.mockResolvedValue(makeOkResponse(mockTypeDetail));

    const result = await fetchPokemonType("grass");

    expect(result).toEqual(mockTypeDetail);
  });

  it("throws AppError on HTTP error (e.g. 404)", async () => {
    mockFetch.mockResolvedValue(makeErrorResponse(404, "Not Found"));

    await expect(fetchPokemonType("unknown")).rejects.toMatchObject({
      type: "HTTP_ERROR",
      status: 404,
    });
  });

  it("throws AppError on network failure", async () => {
    mockFetch.mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(fetchPokemonType("grass")).rejects.toMatchObject({
      type: "NETWORK_ERROR",
    });
  });
});
