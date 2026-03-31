import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import ErrorBanner from "@/components/Errors/ErrorBanner";

const mockOnRetry = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe("ErrorBanner", () => {
  describe("message rendering", () => {
    it("displays the provided error message", () => {
      renderWithProviders(<ErrorBanner message="Something went wrong." />);

      expect(screen.getByText("Something went wrong.")).toBeTruthy();
    });

    it("renders the error icon", () => {
      renderWithProviders(<ErrorBanner message="Error" />);

      expect(screen.getByTestId("ErrorOutlineIcon")).toBeTruthy();
    });
  });

  describe("retry button", () => {
    it("does not render retry button when onRetry is not provided", () => {
      renderWithProviders(<ErrorBanner message="Error" />);

      expect(screen.queryByRole("button")).toBeNull();
    });

    it("renders retry button when onRetry is provided", () => {
      renderWithProviders(<ErrorBanner message="Error" onRetry={mockOnRetry} />);

      expect(screen.getByRole("button", { name: /try again/i })).toBeTruthy();
    });

    it("calls onRetry when retry button is clicked", () => {
      renderWithProviders(<ErrorBanner message="Error" onRetry={mockOnRetry} />);

      fireEvent.click(screen.getByRole("button", { name: /try again/i }));

      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    it("disables retry button when isRetrying is true", () => {
      renderWithProviders(<ErrorBanner message="Error" onRetry={mockOnRetry} isRetrying={true} />);

      expect(screen.getByRole("button").hasAttribute("disabled")).toBe(true);
    });

    it("shows retrying label when isRetrying is true", () => {
      renderWithProviders(<ErrorBanner message="Error" onRetry={mockOnRetry} isRetrying={true} />);

      expect(screen.getByText("Retrying...")).toBeTruthy();
    });

    it("shows try again label when isRetrying is false", () => {
      renderWithProviders(<ErrorBanner message="Error" onRetry={mockOnRetry} isRetrying={false} />);

      expect(screen.getByText("Try again")).toBeTruthy();
    });
  });

  describe("variant", () => {
    it("defaults to inline variant", () => {
      const { container } = renderWithProviders(<ErrorBanner message="Error" />);

      const box = container.firstChild as HTMLElement;
      expect(box).toBeTruthy();
    });

    it("renders without error in fullscreen variant", () => {
      renderWithProviders(<ErrorBanner message="Error" variant="fullscreen" />);

      expect(screen.getByText("Error")).toBeTruthy();
    });

    it("renders without error in inline variant", () => {
      renderWithProviders(<ErrorBanner message="Error" variant="inline" />);

      expect(screen.getByText("Error")).toBeTruthy();
    });
  });
});
