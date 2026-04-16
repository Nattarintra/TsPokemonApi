import { afterEach, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, screen } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import type { PokemonCardProps, PokemonListResult } from "@/types/pokemon.type";
import { QUERY_KEYS } from "@/constants";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

// ─── No module-level mocks ────────────────────────────────────────────────────
// @/hooks/usePokemonListQuery: Jest resolves @/... aliases before checking the
//   mock registry, so jest.unstable_mockModule("@/...") is silently ignored.
// react-router-dom/useNavigate: renderWithProviders statically imports the
//   module, caching the real version before the async mock factory runs.
//
// Instead we pre-seed a real QueryClient for each test scenario and test
// navigation via real Routes (no useNavigate mock needed).

// ─── Module under test ────────────────────────────────────────────────────────

let Home: (typeof import("@/pages/home/Home"))["default"];

beforeAll(async () => {
  ({ default: Home } = await import("@/pages/home/Home"));
});

afterEach(() => {
  // Clean up global.fetch if any test set it to control network calls
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (global as any).fetch;
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

// staleTime:Infinity + refetchOnMount:false prevent React Query from starting
// background fetches against seeded data, keeping test state deterministic.
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      },
    },
  });

const makePokemon = (overrides?: Partial<PokemonCardProps>): PokemonCardProps => ({
  id: 25,
  name: "pikachu",
  image: "/pikachu.png",
  types: ["electric"],
  ...overrides,
});

// Returns a QueryClient with success data already in the cache so useQuery
// returns synchronously with isLoading:false.
const withData = (data: PokemonListResult) => {
  const qc = createTestQueryClient();
  qc.setQueryData(QUERY_KEYS.POKEMON_LIST, data);
  return qc;
};

// Returns a QueryClient whose query has data (so QueryBoundary's `!data` guard
// passes) but whose status is overridden to 'error'. React Query v5 preserves
// cached data on error ("data stays as it was"), so both data and error are set.
const withError = (error: Error) => {
  const qc = createTestQueryClient();
  qc.setQueryData(QUERY_KEYS.POKEMON_LIST, { pokemons: [], failed: 0 } as PokemonListResult);
  // Merge error into existing state — data is preserved (React Query v5 behaviour)
  qc.getQueryCache()
    .find({ queryKey: QUERY_KEYS.POKEMON_LIST })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ?.setState({ status: "error", error } as any);
  return qc;
};

// Returns a QueryClient with data + fetchStatus:'fetching' to simulate a
// background refetch in progress (isFetching:true, isLoading:false).
const withFetching = (data: PokemonListResult) => {
  const qc = createTestQueryClient();
  qc.setQueryData(QUERY_KEYS.POKEMON_LIST, data);
  qc.getQueryCache()
    .find({ queryKey: QUERY_KEYS.POKEMON_LIST })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ?.setState({ fetchStatus: "fetching" } as any);
  return qc;
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Home page", () => {
  describe("loading state", () => {
    it("shows skeleton during initial load", () => {
      // No cache data → useQuery returns isLoading:true. Assign a mock fetch so
      // the queryFn never resolves and the component stays in loading state.
      global.fetch = jest.fn<typeof fetch>().mockReturnValue(new Promise<Response>(() => {}));

      renderWithProviders(<Home />, { queryClient: createTestQueryClient() });

      // data-testid added directly to PokemonGridSkeleton for stable test hook
      expect(screen.getByTestId("pokemon-grid-skeleton")).toBeTruthy();
      expect(screen.queryByText("pikachu")).toBeNull();
    });
  });

  describe("success state", () => {
    it("shows cards on successful load", () => {
      renderWithProviders(<Home />, {
        queryClient: withData({ pokemons: [makePokemon()], failed: 0 }),
      });

      expect(screen.getByText("pikachu")).toBeTruthy();
    });

    it("navigates to details page when card is clicked", () => {
      // Use real Routes so navigate() changes the rendered route — no mock needed.
      renderWithProviders(
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/details/:id" element={<div data-testid="details-page" />} />
        </Routes>,
        { queryClient: withData({ pokemons: [makePokemon({ id: 25 })], failed: 0 }) },
      );

      fireEvent.click(screen.getByText("pikachu"));

      expect(screen.getByTestId("details-page")).toBeTruthy();
    });

    it("shows inline warning when some pokemon failed to load", () => {
      renderWithProviders(<Home />, {
        queryClient: withData({ pokemons: [makePokemon()], failed: 2 }),
      });

      expect(screen.getByText("Some Pokémon failed to load (2)")).toBeTruthy();
      expect(screen.getByText("pikachu")).toBeTruthy();
    });

    it("shows progress bar during background refetch", () => {
      // Assign mock fetch so that if React Query internally tries to run the
      // queryFn after we manually set fetchStatus:'fetching', it doesn't error.
      global.fetch = jest.fn<typeof fetch>().mockReturnValue(new Promise<Response>(() => {}));

      renderWithProviders(<Home />, {
        queryClient: withFetching({ pokemons: [makePokemon()], failed: 0 }),
      });

      expect(screen.getByRole("progressbar")).toBeTruthy();
    });
  });

  describe("error state", () => {
    it("shows fullscreen error and allows retry", () => {
      // Assign mock fetch so the retry network call never completes during the test
      const fetchMock = jest
        .fn<typeof fetch>()
        .mockReturnValue(new Promise<Response>(() => {}));
      global.fetch = fetchMock;

      renderWithProviders(<Home />, { queryClient: withError(new Error("boom")) });

      expect(screen.getByText("Something went wrong.")).toBeTruthy();

      fireEvent.click(screen.getByRole("button", { name: /try again/i }));

      // Clicking retry triggers the real useQuery refetch which calls fetch
      expect(fetchMock).toHaveBeenCalled();
    });

    it("shows fullscreen error when all pokemon failed to load", () => {
      // Home early-returns a fullscreen ErrorBanner before QueryBoundary when
      // pokemons=[] and failed>0
      renderWithProviders(<Home />, {
        queryClient: withData({ pokemons: [], failed: 5 }),
      });

      expect(screen.getByText("Some Pokémon failed to load (5)")).toBeTruthy();
    });
  });
});
