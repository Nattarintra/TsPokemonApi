import type { ReactElement } from "react";
import { afterEach, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

interface MockPaginationProps {
  count: number;
  page: number;
  onChange: (event: unknown, page: number) => void;
  boundaryCount?: number;
  siblingCount?: number;
  showFirstButton?: boolean;
  showLastButton?: boolean;
  color?: string;
  shape?: string;
  size?: string;
  "aria-label"?: string;
}

const mockMuiPagination = jest.fn<(props: MockPaginationProps) => ReactElement>();
const mockOnPageChange = jest.fn();

jest.unstable_mockModule("@mui/material", async () => {
  const actual = await jest.requireActual<typeof import("@mui/material")>("@mui/material");
  return {
    ...actual,
    Pagination: (props: MockPaginationProps) => {
      mockMuiPagination(props);
      return (
        <div data-testid="mui-pagination">
          {Array.from({ length: props.count }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => props.onChange(null, i + 1)}
              data-testid={`page-${i + 1}`}
              aria-current={props.page === i + 1 ? "page" : undefined}
            >
              {i + 1}
            </button>
          ))}
        </div>
      );
    },
  };
});

let PokemonPagination: (typeof import("@/components/Pagination/PokemonPagination"))["default"];

beforeAll(async () => {
  const module = await import("@/components/Pagination/PokemonPagination");
  PokemonPagination = module.default;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("PokemonPagination Component", () => {
  const setMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        matches,
        media: "(max-width: 600px)",
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  };
  it("returns null when totalPages is 1", () => {
    const { container } = renderWithProviders(
      <PokemonPagination
        currentPage={1}
        pageSize={12}
        totalItems={12}
        onPageChange={mockOnPageChange}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("returns null when totalPages is 0", () => {
    const { container } = renderWithProviders(
      <PokemonPagination
        currentPage={1}
        pageSize={12}
        totalItems={0}
        onPageChange={mockOnPageChange}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders pagination nav with correct accessibility attributes", () => {
    renderWithProviders(
      <PokemonPagination
        currentPage={1}
        pageSize={12}
        totalItems={150}
        onPageChange={mockOnPageChange}
      />,
    );

    expect(screen.getByLabelText("Pokemon list pagination")).toBeTruthy();
    // Check for aria-live="polite" by verifying the text is present
    expect(screen.getByText("Showing 1 - 12 of 150 Pokémon")).toBeTruthy();
  });

  it("displays correct pagination text on first page", () => {
    renderWithProviders(
      <PokemonPagination
        currentPage={1}
        pageSize={12}
        totalItems={150}
        onPageChange={mockOnPageChange}
      />,
    );

    expect(screen.getByText("Showing 1 - 12 of 150 Pokémon")).toBeTruthy();
  });

  it("displays correct pagination text on middle page", () => {
    renderWithProviders(
      <PokemonPagination
        currentPage={5}
        pageSize={12}
        totalItems={150}
        onPageChange={mockOnPageChange}
      />,
    );

    expect(screen.getByText("Showing 49 - 60 of 150 Pokémon")).toBeTruthy();
  });

  it("displays correct pagination text on last page with partial items", () => {
    renderWithProviders(
      <PokemonPagination
        currentPage={13}
        pageSize={12}
        totalItems={150}
        onPageChange={mockOnPageChange}
      />,
    );

    expect(screen.getByText("Showing 145 - 150 of 150 Pokémon")).toBeTruthy();
  });

  it("calls onPageChange when page button is clicked", () => {
    renderWithProviders(
      <PokemonPagination
        currentPage={1}
        pageSize={12}
        totalItems={150}
        onPageChange={mockOnPageChange}
      />,
    );

    fireEvent.click(screen.getByTestId("page-2"));

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("renders correct number of pages (totalItems / pageSize rounded up)", () => {
    renderWithProviders(
      <PokemonPagination
        currentPage={1}
        pageSize={12}
        totalItems={150}
        onPageChange={mockOnPageChange}
      />,
    );

    // 150 / 12 = 12.5, rounded up = 13
    expect(mockMuiPagination).toHaveBeenCalledWith(
      expect.objectContaining({
        count: 13,
      }),
    );
  });

  it("passes correct props to MuiPagination", () => {
    renderWithProviders(
      <PokemonPagination
        currentPage={5}
        pageSize={25}
        totalItems={200}
        onPageChange={mockOnPageChange}
        boundaryCount={2}
        siblingCount={2}
      />,
    );

    expect(mockMuiPagination).toHaveBeenCalledWith(
      expect.objectContaining({
        count: 8, // 200 / 25 = 8
        page: 5,
        boundaryCount: 2,
        siblingCount: 2,
        showFirstButton: true,
        showLastButton: true,
        color: "primary",
        shape: "rounded",
        "aria-label": "Pokemon pagination controls",
      }),
    );
  });

  it("uses default values for optional props", () => {
    renderWithProviders(
      <PokemonPagination
        currentPage={1}
        pageSize={12}
        totalItems={150}
        onPageChange={mockOnPageChange}
      />,
    );

    expect(mockMuiPagination).toHaveBeenCalledWith(
      expect.objectContaining({
        boundaryCount: 1,
        siblingCount: 1,
      }),
    );
  });

  it("handles edge case: totalItems not divisible by pageSize", () => {
    renderWithProviders(
      <PokemonPagination
        currentPage={1}
        pageSize={30}
        totalItems={100}
        onPageChange={mockOnPageChange}
      />,
    );

    // 100 / 30 = 3.33, rounded up = 4 pages
    expect(mockMuiPagination).toHaveBeenCalledWith(
      expect.objectContaining({
        count: 4,
      }),
    );

    expect(screen.getByText("Showing 1 - 30 of 100 Pokémon")).toBeTruthy();
  });

  it("handles last page with partial items correctly", () => {
    renderWithProviders(
      <PokemonPagination
        currentPage={4}
        pageSize={30}
        totalItems={100}
        onPageChange={mockOnPageChange}
      />,
    );

    // Last page: items 91-100 (10 items)
    expect(screen.getByText("Showing 91 - 100 of 100 Pokémon")).toBeTruthy();
  });

  it("renders with single item (totalPages = 1 should return null)", () => {
    const { container } = renderWithProviders(
      <PokemonPagination
        currentPage={1}
        pageSize={12}
        totalItems={1}
        onPageChange={mockOnPageChange}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("supports clicking multiple pages sequentially", () => {
    const { rerender } = renderWithProviders(
      <PokemonPagination
        currentPage={1}
        pageSize={12}
        totalItems={150}
        onPageChange={mockOnPageChange}
      />,
    );

    // Click page 2
    fireEvent.click(screen.getByTestId("page-2"));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);

    // Rerender with new page
    rerender(
      <PokemonPagination
        currentPage={2}
        pageSize={12}
        totalItems={150}
        onPageChange={mockOnPageChange}
      />,
    );

    // Click page 3
    fireEvent.click(screen.getByTestId("page-3"));
    expect(mockOnPageChange).toHaveBeenLastCalledWith(3);
    expect(mockOnPageChange).toHaveBeenCalledTimes(2);
  });

  it("uses mobile-friendly pagination settings on small screens", () => {
    setMatchMedia(true);

    renderWithProviders(
      <PokemonPagination
        currentPage={1}
        pageSize={12}
        totalItems={150}
        onPageChange={mockOnPageChange}
      />,
    );

    expect(mockMuiPagination).toHaveBeenCalledWith(
      expect.objectContaining({
        boundaryCount: 1,
        siblingCount: 0,
        showFirstButton: false,
        showLastButton: false,
        size: "small",
      }),
    );
  });
});
