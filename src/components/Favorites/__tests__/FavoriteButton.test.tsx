import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import FavoriteButton from "@/components/Favorites/FavoriteButton";

const mockOnClick = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe("FavoriteButton", () => {
  it("renders filled heart icon when isFavorite is true", () => {
    renderWithProviders(<FavoriteButton isFavorite={true} onClick={mockOnClick} />);

    expect(screen.getByTestId("FavoriteIcon")).toBeTruthy();
  });

  it("renders border heart icon when isFavorite is false", () => {
    renderWithProviders(<FavoriteButton isFavorite={false} onClick={mockOnClick} />);

    expect(screen.getByTestId("FavoriteBorderIcon")).toBeTruthy();
  });

  it("has correct aria-label when isFavorite is true", () => {
    renderWithProviders(<FavoriteButton isFavorite={true} onClick={mockOnClick} />);

    expect(screen.getByRole("button", { name: "Remove from favorites" })).toBeTruthy();
  });

  it("has correct aria-label when isFavorite is false", () => {
    renderWithProviders(<FavoriteButton isFavorite={false} onClick={mockOnClick} />);

    expect(screen.getByRole("button", { name: "Add to favorites" })).toBeTruthy();
  });

  it("has aria-pressed=\"true\" when isFavorite is true", () => {
    renderWithProviders(<FavoriteButton isFavorite={true} onClick={mockOnClick} />);

    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("true");
  });

  it("has aria-pressed=\"false\" when isFavorite is false", () => {
    renderWithProviders(<FavoriteButton isFavorite={false} onClick={mockOnClick} />);

    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("false");
  });

  it("calls onClick when clicked", () => {
    renderWithProviders(<FavoriteButton isFavorite={false} onClick={mockOnClick} />);

    fireEvent.click(screen.getByRole("button"));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
