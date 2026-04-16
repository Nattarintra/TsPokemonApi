import { afterEach, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { act, screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

// ─── Module under test ────────────────────────────────────────────────────────

let SearchModal: (typeof import("@/components/Search/SearchModal"))["default"];

beforeAll(async () => {
  const module = await import("@/components/Search/SearchModal");
  SearchModal = module.default;
});

afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

// No pokemon data in the QueryClient cache → cachedPokemons = [] in SearchModal.
// Any non-empty search term or type filter will produce isEmpty=true.
const renderModal = (
  open: boolean,
  onClose = jest.fn(),
  initialEntries = ["/"],
) => renderWithProviders(<SearchModal open={open} onClose={onClose} />, { initialEntries });

const searchInput = () => screen.getByPlaceholderText("Search Pokémon by name...");
const clearButton = () => screen.getByRole("button", { name: "Clear search and close" });

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("SearchModal", () => {
  describe("rendering", () => {
    it("renders search input when open", () => {
      renderModal(true);

      expect(searchInput()).toBeTruthy();
    });

    it("renders type filter buttons", () => {
      renderModal(true);

      expect(screen.getByTestId("type-filter-fire")).toBeTruthy();
      expect(screen.getByTestId("type-filter-water")).toBeTruthy();
      expect(screen.getByTestId("type-filter-grass")).toBeTruthy();
    });

    it("does not render when closed", () => {
      renderModal(false);

      expect(screen.queryByPlaceholderText("Search Pokémon by name...")).toBeNull();
    });
  });

  describe("warning", () => {
    // With an empty pokemon cache, any urlSearch term yields filteredPokemons=[].
    // Starting with ?search=zzznomatch sets both inputValue and urlSearch to the
    // same value so isTyping=false, isEmpty=true, and showWarning=true.

    it("shows warning when isEmpty is true and isTyping is false", () => {
      renderModal(true, jest.fn(), ["/?search=zzznomatch"]);

      expect(screen.getByRole("alert")).toBeTruthy();
      expect(
        screen.getByText("No Pokémon found — try a different name or type"),
      ).toBeTruthy();
    });

    it("hides warning when isEmpty is false", () => {
      // No filters active → isEmpty=false
      renderModal(true);

      expect(screen.queryByRole("alert")).toBeNull();
    });

    it("hides warning when isTyping is true", () => {
      jest.useFakeTimers();

      // Start: urlSearch="zzznomatch", isEmpty=true, isTyping=false → warning visible
      renderModal(true, jest.fn(), ["/?search=zzznomatch"]);
      expect(screen.getByRole("alert")).toBeTruthy();

      // Type a new value — inputValue changes immediately but debounce hasn't fired,
      // so urlSearch stays "zzznomatch" and isTyping becomes true.
      act(() => {
        fireEvent.change(searchInput(), { target: { value: "different" } });
      });

      // showWarning = isEmpty && !isTyping = true && false = false
      expect(screen.queryByRole("alert")).toBeNull();
    });
  });

  describe("interactions", () => {
    it("calls handleSearchChange when user types", () => {
      jest.useFakeTimers();
      renderModal(true);

      act(() => {
        fireEvent.change(searchInput(), { target: { value: "bulba" } });
      });

      // inputValue is updated immediately (debounce only delays the URL param write)
      expect((searchInput() as HTMLInputElement).value).toBe("bulba");
    });

    it("calls onClose when Enter is pressed and results exist", () => {
      const onClose = jest.fn();
      // No search params → isEmpty=false
      renderModal(true, onClose);

      fireEvent.keyDown(searchInput(), { key: "Enter" });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not close when Enter is pressed and isEmpty is true", () => {
      const onClose = jest.fn();
      // search=zzznomatch + empty pokemon cache → isEmpty=true
      renderModal(true, onClose, ["/?search=zzznomatch"]);

      fireEvent.keyDown(searchInput(), { key: "Enter" });

      expect(onClose).not.toHaveBeenCalled();
    });

    it("calls handleSearchChange and handleTypeChange with empty string when clear button clicked", () => {
      // Start with both a search term and an active type filter
      renderModal(true, jest.fn(), ["/?search=char&type=fire"]);

      expect((searchInput() as HTMLInputElement).value).toBe("char");
      expect(screen.getByTestId("type-filter-fire").getAttribute("aria-pressed")).toBe("true");

      fireEvent.click(clearButton());

      // handleSearchChange("") → inputValue cleared immediately
      expect((searchInput() as HTMLInputElement).value).toBe("");
      // handleTypeChange("") → activeType cleared immediately (no debounce)
      expect(screen.getByTestId("type-filter-fire").getAttribute("aria-pressed")).toBe("false");
    });

    it("calls onClose when clear button clicked", () => {
      const onClose = jest.fn();
      renderModal(true, onClose);

      fireEvent.click(clearButton());

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
