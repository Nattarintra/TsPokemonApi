import { afterEach, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, screen } from "@testing-library/react";
import type { PokemonCardProps, PokemonListResult } from "@/types/pokemon.type";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

type HomeQueryState = {
  data?: PokemonListResult;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  isFetching: boolean;
};

const mockNavigate = jest.fn();
const mockUsePokemonListQuery = jest.fn<() => HomeQueryState>();

jest.unstable_mockModule("react-router-dom", async () => {
  const actual = await jest.requireActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

jest.unstable_mockModule("@/hooks/usePokemonListQuery", () => ({
  usePokemonListQuery: mockUsePokemonListQuery,
}));

jest.unstable_mockModule("@/hooks/usePokemonPagination", () => ({
  usePokemonPagination: (pokemons: PokemonCardProps[]) => ({
    currentPage: 1,
    paginatedPokemons: pokemons.slice(0, 12),
    totalItems: pokemons.length,
    handlePageChange: jest.fn(),
  }),
}));

// mock only testid — ignore child internals
jest.unstable_mockModule("@/components/Cards/PokemonCard", () => ({
  default: ({ name, onClick }: PokemonCardProps & { onClick?: () => void }) => (
    <div data-testid="pokemon-card" onClick={onClick}>
      {name}
    </div>
  ),
}));

jest.unstable_mockModule("@/components/Pagination/PokemonPagination", () => ({
  default: () => <div data-testid="pokemon-pagination" />,
}));

jest.unstable_mockModule("@/components/Skeletons/PokemonGridSkeleton", () => ({
  default: () => <div data-testid="pokemon-grid-skeleton" />,
}));

jest.unstable_mockModule("@/components/Errors/ErrorBanner", () => ({
  default: ({
    message,
    onRetry,
    variant = "inline",
  }: {
    message: string;
    onRetry?: () => void;
    variant?: "inline" | "fullscreen";
  }) => (
    <div data-testid={`error-banner-${variant}`}>
      <span>{message}</span>
      {onRetry && <button onClick={onRetry}>Try again</button>}
    </div>
  ),
}));

let Home: (typeof import("@/pages/home/Home"))["default"];

beforeAll(async () => {
  ({ default: Home } = await import("@/pages/home/Home"));
});

afterEach(() => {
  jest.clearAllMocks();
});

const makePokemon = (overrides?: Partial<PokemonCardProps>): PokemonCardProps => ({
  id: 25,
  name: "pikachu",
  image: "/pikachu.png",
  types: ["electric"],
  ...overrides,
});

const makeQueryState = (overrides?: Partial<HomeQueryState>): HomeQueryState => ({
  data: { pokemons: [], failed: 0 },
  isLoading: false,
  error: null,
  refetch: jest.fn(),
  isFetching: false,
  ...overrides,
});

describe("Home page", () => {
  describe("loading state", () => {
    it("shows skeleton during initial load", () => {
      mockUsePokemonListQuery.mockReturnValue(makeQueryState({ isLoading: true, data: undefined }));
      renderWithProviders(<Home />);

      expect(screen.getByTestId("pokemon-grid-skeleton")).toBeTruthy();
      expect(screen.queryByTestId("pokemon-card")).toBeNull();
    });
  });

  describe("success state", () => {
    it("shows cards and pagination on successful load", () => {
      mockUsePokemonListQuery.mockReturnValue(
        makeQueryState({ data: { pokemons: [makePokemon()], failed: 0 } }),
      );
      renderWithProviders(<Home />);

      expect(screen.getByTestId("pokemon-card")).toBeTruthy();
      expect(screen.getByTestId("pokemon-pagination")).toBeTruthy();
    });

    it("navigates to details page when card is clicked", () => {
      mockUsePokemonListQuery.mockReturnValue(
        makeQueryState({ data: { pokemons: [makePokemon({ id: 25 })], failed: 0 } }),
      );
      renderWithProviders(<Home />);

      fireEvent.click(screen.getByTestId("pokemon-card"));

      expect(mockNavigate).toHaveBeenCalledWith("/details/25");
    });

    it("shows inline warning when some pokemon failed to load", () => {
      mockUsePokemonListQuery.mockReturnValue(
        makeQueryState({ data: { pokemons: [makePokemon()], failed: 2 } }),
      );
      renderWithProviders(<Home />);

      expect(screen.getByTestId("error-banner-inline")).toBeTruthy();
      expect(screen.getByTestId("pokemon-card")).toBeTruthy();
    });

    it("shows progress bar during background refetch", () => {
      mockUsePokemonListQuery.mockReturnValue(
        makeQueryState({ data: { pokemons: [makePokemon()], failed: 0 }, isFetching: true }),
      );
      renderWithProviders(<Home />);

      expect(screen.getByRole("progressbar")).toBeTruthy();
    });
  });

  describe("error state", () => {
    it("shows fullscreen error and allows retry", () => {
      const refetch = jest.fn();
      mockUsePokemonListQuery.mockReturnValue(
        makeQueryState({ error: new Error("boom"), refetch }),
      );
      renderWithProviders(<Home />);

      expect(screen.getByTestId("error-banner-fullscreen")).toBeTruthy();
      fireEvent.click(screen.getByRole("button", { name: /try again/i }));
      expect(refetch).toHaveBeenCalledTimes(1);
    });

    it("shows fullscreen error when all pokemon failed to load", () => {
      mockUsePokemonListQuery.mockReturnValue(
        makeQueryState({ data: { pokemons: [], failed: 5 } }),
      );
      renderWithProviders(<Home />);

      expect(screen.getByTestId("error-banner-fullscreen")).toBeTruthy();
    });
  });
});
