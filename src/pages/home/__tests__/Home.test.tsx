import type { ReactElement } from 'react';
import { afterEach, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, screen } from '@testing-library/react';
import type { PokemonCardProps, PokemonListResult } from '@/types/pokemon.type';
import { renderWithProviders } from '@/test-utils/renderWithProviders';

type HomeQueryState = {
  data?: PokemonListResult;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  isFetching: boolean;
};

const mockUsePokemonListQuery = jest.fn<() => HomeQueryState>();
const mockPokemonCard =
  jest.fn<(props: PokemonCardProps & { onClick?: () => void }) => ReactElement>();

jest.unstable_mockModule('@/hooks/usePokemonListQuery', () => ({
  usePokemonListQuery: mockUsePokemonListQuery,
}));

jest.unstable_mockModule('@/components/Cards/PokemonCard', () => ({
  default: (props: PokemonCardProps & { onClick?: () => void }) => {
    mockPokemonCard(props);
    return <div data-testid="pokemon-card">{props.name}</div>;
  },
}));

jest.unstable_mockModule('@/components/Skeletons/PokemonGridSkeleton', () => ({
  default: () => <div data-testid="pokemon-grid-skeleton">Loading grid</div>,
}));

jest.unstable_mockModule('@/components/Errors/ErrorBanner', () => ({
  default: ({
    message,
    onRetry,
    isRetrying,
    variant = 'inline',
  }: {
    message: string;
    onRetry?: () => void;
    isRetrying?: boolean;
    variant?: 'inline' | 'fullscreen';
  }) => (
    <div data-testid={`error-banner-${variant}`}>
      <span>{message}</span>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          {isRetrying ? 'Retrying...' : 'Try again'}
        </button>
      )}
    </div>
  ),
}));

let Home: (typeof import('@/pages/home/Home'))['default'];

beforeAll(async () => {
  const module = await import('@/pages/home/Home');
  Home = module.default;
});

afterEach(() => {
  jest.clearAllMocks();
});

const createPokemon = (overrides?: Partial<PokemonCardProps>): PokemonCardProps => ({
  id: 25,
  name: 'pikachu',
  image: '/pikachu.png',
  types: ['electric'],
  ...overrides,
});

const createQueryState = (overrides?: Partial<HomeQueryState>): HomeQueryState => ({
  data: {
    pokemons: [],
    failed: 0,
  },
  isLoading: false,
  error: null,
  refetch: jest.fn(),
  isFetching: false,
  ...overrides,
});

const expectPokemonCardProps = (pokemon: PokemonCardProps) =>
  expect.objectContaining({
    id: pokemon.id,
    name: pokemon.name,
    image: pokemon.image,
    types: pokemon.types,
  });

describe('Home page', () => {
  it('renders the loading skeleton during the initial load', () => {
    mockUsePokemonListQuery.mockReturnValue(
      createQueryState({
        isLoading: true,
        data: undefined,
      }),
    );

    renderWithProviders(<Home />);

    expect(screen.getByTestId('pokemon-grid-skeleton')).toBeTruthy();
    expect(screen.queryAllByTestId('pokemon-card')).toHaveLength(0);
  });

  it('renders a fullscreen error state and retries when requested', () => {
    const refetch = jest.fn();

    mockUsePokemonListQuery.mockReturnValue(
      createQueryState({
        error: new Error('boom'),
        refetch,
      }),
    );

    renderWithProviders(<Home />);

    expect(screen.getByTestId('error-banner-fullscreen')).toBeTruthy();
    expect(screen.getByText('Something went wrong.')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /try again/i }));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('renders a fullscreen partial-error banner when all pokemon requests fail', () => {
    const refetch = jest.fn();

    mockUsePokemonListQuery.mockReturnValue(
      createQueryState({
        data: {
          pokemons: [],
          failed: 3,
        },
        refetch,
      }),
    );

    renderWithProviders(<Home />);

    expect(screen.getByTestId('error-banner-fullscreen')).toBeTruthy();
    expect(screen.getByText('Some Pokémon failed to load (3)')).toBeTruthy();
    expect(screen.getByRole('button', { name: /try again/i })).toBeTruthy();
  });

  it('renders pokemon cards for successful data', () => {
    const firstPokemon = createPokemon();
    const secondPokemon = createPokemon({
      id: 1,
      name: 'bulbasaur',
      image: '/bulbasaur.png',
      types: ['grass', 'poison'],
    });

    mockUsePokemonListQuery.mockReturnValue(
      createQueryState({
        data: {
          pokemons: [firstPokemon, secondPokemon],
          failed: 0,
        },
      }),
    );

    renderWithProviders(<Home />);

    expect(screen.getAllByTestId('pokemon-card')).toHaveLength(2);
    expect(mockPokemonCard).toHaveBeenNthCalledWith(1, expectPokemonCardProps(firstPokemon));
    expect(mockPokemonCard).toHaveBeenNthCalledWith(2, expectPokemonCardProps(secondPokemon));
  });

  it('renders an inline partial-error banner when some pokemon still load', () => {
    mockUsePokemonListQuery.mockReturnValue(
      createQueryState({
        data: {
          pokemons: [createPokemon()],
          failed: 2,
        },
      }),
    );

    renderWithProviders(<Home />);

    expect(screen.getByTestId('error-banner-inline')).toBeTruthy();
    expect(screen.getByText('Some Pokémon failed to load (2)')).toBeTruthy();
    expect(screen.getAllByTestId('pokemon-card')).toHaveLength(1);
  });

  it('shows background loading progress during a refetch after data is already visible', () => {
    mockUsePokemonListQuery.mockReturnValue(
      createQueryState({
        data: {
          pokemons: [createPokemon()],
          failed: 0,
        },
        isFetching: true,
      }),
    );

    renderWithProviders(<Home />);

    expect(screen.getByRole('progressbar')).toBeTruthy();
    expect(screen.getAllByTestId('pokemon-card')).toHaveLength(1);
  });
});
