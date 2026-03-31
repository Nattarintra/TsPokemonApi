import { describe, expect, it } from "@jest/globals";
import { screen } from "@testing-library/react";
import NotFound from "@/pages/notFound/NotFound";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

describe("NotFound page", () => {
  it("renders the page heading and supporting copy", () => {
    renderWithProviders(<NotFound />);

    expect(screen.getByRole("heading", { name: /page not found/i })).toBeTruthy();
    expect(
      screen.getByText(/the page you requested does not exist or is not available yet\./i),
    ).toBeTruthy();
    expect(screen.getByText(/pokedex routing error/i)).toBeTruthy();
  });

  it("provides a clear link back to the home page", () => {
    renderWithProviders(<NotFound />);

    const homeLink = screen.getByRole("link", { name: /return to home/i });

    expect(homeLink).toBeTruthy();
    expect(homeLink.getAttribute("href")).toBe("/");
  });
});
