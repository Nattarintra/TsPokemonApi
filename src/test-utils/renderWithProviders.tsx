import type { PropsWithChildren, ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import { MemoryRouter } from "react-router-dom";
import { pokemonTheme } from "@/theme/createPokemonTheme";

type RenderWithProvidersOptions = Omit<RenderOptions, "wrapper"> & {
  initialEntries?: string[];
  queryClient?: QueryClient;
};

export const renderWithProviders = (
  ui: ReactElement,
  { initialEntries, queryClient: providedQueryClient, ...options }: RenderWithProvidersOptions = {},
) => {
  const queryClient =
    providedQueryClient ??
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={pokemonTheme}>
        <MemoryRouter initialEntries={initialEntries ?? ["/"]}>{children}</MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );

  return render(ui, {
    wrapper: Wrapper,
    ...options,
  });
};
