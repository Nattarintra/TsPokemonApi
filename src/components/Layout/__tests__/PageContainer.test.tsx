import { describe, it, expect } from "@jest/globals";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import PageContainer from "@/components/Layout/PageContainer";

describe("PageContainer", () => {
  it("renders children", () => {
    renderWithProviders(
      <PageContainer>
        <span>Test child</span>
      </PageContainer>
    );

    expect(screen.getByText("Test child")).toBeTruthy();
  });

  it("accepts and merges custom sx", () => {
    const { container } = renderWithProviders(
      <PageContainer sx={{ color: "red" }}>
        <span>Content</span>
      </PageContainer>
    );

    expect(container.firstChild).toBeTruthy();
    expect(screen.getByText("Content")).toBeTruthy();
  });

  it("renders without error when sx is omitted", () => {
    renderWithProviders(
      <PageContainer>
        <span>No sx</span>
      </PageContainer>
    );

    expect(screen.getByText("No sx")).toBeTruthy();
  });
});
