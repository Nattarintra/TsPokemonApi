import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import SearchBar from "@/components/Search/SearchBar";

const mockOnClick = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe("SearchBar", () => {
  it("renders search icon", () => {
    renderWithProviders(<SearchBar onClick={mockOnClick} />);

    expect(screen.getByTestId("SearchIcon")).toBeTruthy();
  });

  it("renders placeholder text", () => {
    renderWithProviders(<SearchBar onClick={mockOnClick} />);

    expect(screen.getByPlaceholderText("Search Pokémon...")).toBeTruthy();
  });

  it("calls onClick when clicked", () => {
    renderWithProviders(<SearchBar onClick={mockOnClick} />);

    fireEvent.click(screen.getByRole("button", { name: /open search/i }));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("has correct aria-label for accessibility", () => {
    renderWithProviders(<SearchBar onClick={mockOnClick} />);

    expect(screen.getByRole("button", { name: "Open search" })).toBeTruthy();
  });
});
