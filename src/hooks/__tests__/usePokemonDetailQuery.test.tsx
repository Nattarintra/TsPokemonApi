/**
 * @jest-environment jsdom
 */
import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { PokemonDetail, PokemonSpecies, EvolutionChain, PokemonListResult } from "@/types/pokemon.type";
import { QUERY_KEYS } from "@/constants";
import { usePokemonDetailQuery } from "@/hooks/usePokemonDetailQuery";

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

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockDetail: PokemonDetail = {
  id: 1,
  name: "bulbasaur",
  height: 7,
  weight: 69,
  sprites: { other: { "official-artwork": { front_default: "https://img.png" } } },
  types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
  abilities: [{ ability: { name: "overgrow" }, is_hidden: false }],
  stats: [{ stat: { name: "hp" }, base_stat: 45 }],
};

const mockSpecies: PokemonSpecies = {
  gender_rate: 1,
  genera: [{ genus: "Seed Pokémon", language: { name: "en" } }],
  flavor_text_entries: [
    { flavor_text: "A strange\nseed.", language: { name: "en" }, version: { name: "red" } },
  ],
  evolution_chain: { url: EVOLUTION_CHAIN_URL },
};

const mockEvolutionChain: EvolutionChain = {
  chain: {
    species: { name: "bulbasaur", url: "" },
    evolves_to: [],
  },
};

const mockListResult: PokemonListResult = {
  pokemons: [{ id: 1, name: "bulbasaur", image: "https://img.png", types: ["grass", "poison"] }],
  failed: 0,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const createQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } });

const createWrapper = (queryClient: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("usePokemonDetailQuery", () => {
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

  describe("query configuration", () => {
    it("calls getPokemonDetailData with correct id", async () => {
      const queryClient = createQueryClient();

      const { result } = renderHook(
        () => usePokemonDetailQuery(1),
        { wrapper: createWrapper(queryClient) },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const calledUrls = mockFetch.mock.calls.map((call) => call[0]?.toString());
      expect(calledUrls).toContain(POKEMON_URL);
    });

    it('uses correct queryKey ["pokemon-detail", id]', async () => {
      const queryClient = createQueryClient();

      const { result } = renderHook(
        () => usePokemonDetailQuery(1),
        { wrapper: createWrapper(queryClient) },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(queryClient.getQueryData(QUERY_KEYS.POKEMON_DETAIL(1))).toBeDefined();
    });
  });

  describe("when cache exists", () => {
    it("returns initialData from cache immediately before fetch completes", () => {
      const queryClient = createQueryClient();
      queryClient.setQueryData(QUERY_KEYS.POKEMON_LIST, mockListResult);

      mockFetch.mockReturnValue(new Promise(() => {})); // never resolves

      const { result } = renderHook(
        () => usePokemonDetailQuery(1),
        { wrapper: createWrapper(queryClient) },
      );

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.identity.id).toBe(1);
      expect(result.current.data?.bio.description).toBe(""); // placeholder from initialData
    });

    it("fetches full data and replaces initialData after fetch completes", async () => {
      const queryClient = createQueryClient();
      queryClient.setQueryData(QUERY_KEYS.POKEMON_LIST, mockListResult);

      const { result } = renderHook(
        () => usePokemonDetailQuery(1),
        { wrapper: createWrapper(queryClient) },
      );

      await waitFor(() =>
        expect(result.current.data?.bio.description).not.toBe(""),
      );

      expect(result.current.data?.bio.description).toBe("A strange seed.");
    });
  });

  describe("when cache is empty", () => {
    it("returns undefined initialData when no cache found", () => {
      const queryClient = createQueryClient();

      mockFetch.mockReturnValue(new Promise(() => {})); // never resolves

      const { result } = renderHook(
        () => usePokemonDetailQuery(1),
        { wrapper: createWrapper(queryClient) },
      );

      expect(result.current.data).toBeUndefined();
      expect(result.current.isPending).toBe(true);
    });

    it("fetches full data normally", async () => {
      const queryClient = createQueryClient();

      const { result } = renderHook(
        () => usePokemonDetailQuery(1),
        { wrapper: createWrapper(queryClient) },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.identity.id).toBe(1);
      expect(result.current.data?.bio.description).toBe("A strange seed.");
    });
  });

  describe("error handling", () => {
    it("exposes error when getPokemonDetailData throws", async () => {
      const queryClient = createQueryClient();

      mockFetch.mockImplementation((input) => {
        const url = input.toString();
        if (url === POKEMON_URL) return makeErrorResponse(404);
        return Promise.reject(new Error(`Unexpected URL: ${url}`));
      });

      const { result } = renderHook(
        () => usePokemonDetailQuery(1),
        { wrapper: createWrapper(queryClient) },
      );

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toMatchObject({
        type: "HTTP_ERROR",
        status: 404,
      });
    });
  });
});
