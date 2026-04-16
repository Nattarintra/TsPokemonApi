import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import TypeFilterButtons from "@/components/Search/TypeFilterButtons";
import { pokemonTypeColors } from "@/theme/tokens";

const ALL_TYPES = Object.keys(pokemonTypeColors);
const mockOnTypeChange = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe("TypeFilterButtons", () => {
  it("renders all 18 type buttons", () => {
    renderWithProviders(
      <TypeFilterButtons activeType="" onTypeChange={mockOnTypeChange} />,
    );

    expect(ALL_TYPES).toHaveLength(18);
    ALL_TYPES.forEach((type) => {
      expect(screen.getByTestId(`type-filter-${type}`)).toBeTruthy();
    });
  });

  it("active type button has aria-pressed='true'", () => {
    renderWithProviders(
      <TypeFilterButtons activeType="fire" onTypeChange={mockOnTypeChange} />,
    );

    const fireButton = screen.getByTestId("type-filter-fire");
    expect(fireButton.getAttribute("aria-pressed")).toBe("true");
  });

  it("inactive type buttons have aria-pressed='false'", () => {
    renderWithProviders(
      <TypeFilterButtons activeType="fire" onTypeChange={mockOnTypeChange} />,
    );

    const inactiveTypes = ALL_TYPES.filter((t) => t !== "fire");
    inactiveTypes.forEach((type) => {
      const btn = screen.getByTestId(`type-filter-${type}`);
      expect(btn.getAttribute("aria-pressed")).toBe("false");
    });
  });

  it("calls onTypeChange with correct type when clicked", () => {
    renderWithProviders(
      <TypeFilterButtons activeType="" onTypeChange={mockOnTypeChange} />,
    );

    fireEvent.click(screen.getByTestId("type-filter-water"));

    expect(mockOnTypeChange).toHaveBeenCalledTimes(1);
    expect(mockOnTypeChange).toHaveBeenCalledWith("water");
  });

  it("calls onTypeChange with same type when active type is clicked (toggle)", () => {
    renderWithProviders(
      <TypeFilterButtons activeType="grass" onTypeChange={mockOnTypeChange} />,
    );

    fireEvent.click(screen.getByTestId("type-filter-grass"));

    expect(mockOnTypeChange).toHaveBeenCalledTimes(1);
    expect(mockOnTypeChange).toHaveBeenCalledWith("grass");
  });
});
