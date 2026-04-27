import { afterEach, beforeAll, beforeEach, describe, expect, it } from "@jest/globals";
import { fireEvent, screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import type { PokemonCardProps } from "@/types/pokemon.type";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

const FAVORITES_KEY = "pokemon-favorites";

let Favorites: (typeof import("@/pages/favorites/Favorites"))["default"];

beforeAll(async () => {
  ({ default: Favorites } = await import("@/pages/favorites/Favorites"));
});

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makePokemon = (overrides?: Partial<PokemonCardProps>): PokemonCardProps => ({
  id: 1,
  name: "bulbasaur",
  image: "/bulbasaur.png",
  types: ["grass", "poison"],
  ...overrides,
});

const seedFavorites = (pokemons: PokemonCardProps[]) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(pokemons));
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Favorites page", () => {
  describe("empty state", () => {
    it("renders empty state when favorites is empty", () => {
      renderWithProviders(<Favorites />);

      expect(screen.getByTestId("FavoriteBorderIcon")).toBeTruthy();
    });

    it("shows correct empty state message", () => {
      renderWithProviders(<Favorites />);

      expect(screen.getByText("No favorites yet")).toBeTruthy();
      expect(screen.getByText("Click the heart on any Pokémon to save it here")).toBeTruthy();
    });

    it("shows FavoriteBorderIcon in empty state", () => {
      renderWithProviders(<Favorites />);

      expect(screen.getByTestId("FavoriteBorderIcon")).toBeTruthy();
    });
  });

  describe("with favorites", () => {
    it("renders all favorited pokemons as cards", () => {
      seedFavorites([
        makePokemon({ id: 1, name: "bulbasaur" }),
        makePokemon({ id: 4, name: "charmander", types: ["fire"] }),
      ]);

      renderWithProviders(<Favorites />);

      expect(screen.getByText("bulbasaur")).toBeTruthy();
      expect(screen.getByText("charmander")).toBeTruthy();
    });

    it("navigates to details page when card is clicked", () => {
      seedFavorites([makePokemon({ id: 25, name: "pikachu", types: ["electric"] })]);

      renderWithProviders(
        <Routes>
          <Route path="/" element={<Favorites />} />
          <Route path="/details/:id" element={<div data-testid="details-page" />} />
        </Routes>,
      );

      fireEvent.click(screen.getByText("pikachu"));

      expect(screen.getByTestId("details-page")).toBeTruthy();
    });

    it("calls toggleFavorite when heart button is clicked", () => {
      seedFavorites([makePokemon({ id: 1, name: "bulbasaur" })]);

      renderWithProviders(<Favorites />);

      fireEvent.click(screen.getByRole("button", { name: "Remove from favorites" }));

      const stored: PokemonCardProps[] = JSON.parse(
        localStorage.getItem(FAVORITES_KEY) ?? "[]",
      );
      expect(stored).toHaveLength(0);
    });

    it("shows correct title \"My Favorites\"", () => {
      seedFavorites([makePokemon()]);

      renderWithProviders(<Favorites />);

      expect(screen.getByText("My Favorites")).toBeTruthy();
    });
  });
});
