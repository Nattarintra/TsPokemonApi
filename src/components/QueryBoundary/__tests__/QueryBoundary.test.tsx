import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import QueryBoundary from "@/components/QueryBoundary/QueryBoundary";
import { AppError } from "@/errors/errorClasses";
import { ERROR_MESSAGES } from "@/errors/getErrorMessages";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockOnRetry = jest.fn();
const networkError = new AppError("NETWORK_ERROR", "Network request failed");

const defaultProps = {
  isLoading: false,
  isFetching: false,
  error: null,
  data: { id: 1 },
  onRetry: mockOnRetry,
  skeleton: <div data-testid="skeleton">Loading...</div>,
  children: <div data-testid="content">Content</div>,
};

afterEach(() => {
  jest.clearAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("QueryBoundary", () => {
  describe("loading state", () => {
    it("renders skeleton when isLoading is true", () => {
      renderWithProviders(<QueryBoundary {...defaultProps} isLoading={true} />);

      expect(screen.getByTestId("skeleton")).toBeTruthy();
    });

    it("renders skeleton when data is undefined", () => {
      renderWithProviders(
        <QueryBoundary {...defaultProps} isLoading={false} data={undefined} />,
      );

      expect(screen.getByTestId("skeleton")).toBeTruthy();
    });

    it("does not render children when isLoading is true", () => {
      renderWithProviders(<QueryBoundary {...defaultProps} isLoading={true} />);

      expect(screen.queryByTestId("content")).toBeNull();
    });
  });

  describe("error state", () => {
    it("renders ErrorBanner when error is provided and data exists", () => {
      renderWithProviders(
        <QueryBoundary {...defaultProps} error={networkError} />,
      );

      expect(screen.getByText(ERROR_MESSAGES.NETWORK)).toBeTruthy();
    });

    it("passes correct error message to ErrorBanner", () => {
      const httpError = new AppError("HTTP_ERROR", "Not Found", 404);

      renderWithProviders(
        <QueryBoundary {...defaultProps} error={httpError} />,
      );

      expect(screen.getByText(ERROR_MESSAGES.NOT_FOUND)).toBeTruthy();
    });

    it("calls onRetry when retry button is clicked", () => {
      renderWithProviders(
        <QueryBoundary {...defaultProps} error={networkError} />,
      );

      fireEvent.click(screen.getByRole("button", { name: /try again/i }));

      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    it("shows retrying state when isFetching is true", () => {
      renderWithProviders(
        <QueryBoundary {...defaultProps} error={networkError} isFetching={true} />,
      );

      expect(screen.getByText("Retrying...")).toBeTruthy();
    });
  });

  describe("success state", () => {
    it("renders children when data is available and no error", () => {
      renderWithProviders(<QueryBoundary {...defaultProps} />);

      expect(screen.getByTestId("content")).toBeTruthy();
    });

    it("does not render skeleton when data is available", () => {
      renderWithProviders(<QueryBoundary {...defaultProps} />);

      expect(screen.queryByTestId("skeleton")).toBeNull();
    });

    it("does not render ErrorBanner when there is no error", () => {
      renderWithProviders(<QueryBoundary {...defaultProps} />);

      expect(screen.queryByRole("button", { name: /try again/i })).toBeNull();
    });
  });
});
