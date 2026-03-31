import { usePokemonListQuery } from "@/hooks/usePokemonListQuery";
import PokemonCard from "@/components/Cards/PokemonCard";
import { Grid, LinearProgress, type SxProps, type Theme } from "@mui/material";
import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import ErrorBanner from "@/components/Errors/ErrorBanner";
import { getUserErrorMessage, getPartialErrorMessage } from "@/errors/getErrorMessages";
import PokemonGridSkeleton from "@/components/Skeletons/PokemonGridSkeleton";
import type { PokemonCardProps, PokemonListResult } from "@/types/pokemon.type";
import { GRID_MAX_WIDTH } from "@/constants";
import PokemonPagination from "@/components/Pagination/PokemonPagination";
import { env } from "@/config";
import { usePokemonPagination } from "@/hooks/usePokemonPagination";

type HomeStyleKeys = "grid";

const homeStyles: Record<HomeStyleKeys, SxProps<Theme>> = {
  grid: {
    width: "100%",
    maxWidth: GRID_MAX_WIDTH,
    mx: "auto",
    px: { xs: 2, sm: 3 },
    mt: { xs: 2, sm: 3 },
  } satisfies SxProps<Theme>,
};

const Home = (): ReactElement => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch, isFetching } = usePokemonListQuery();

  // Safe fallback
  const typedData = data as PokemonListResult | undefined;
  const pokemons = typedData?.pokemons ?? [];
  const failed = typedData?.failed ?? 0;

  const { currentPage, paginatedPokemons, totalItems, handlePageChange } =
    usePokemonPagination(pokemons);

  // 1. Loading
  if (isLoading) return <PokemonGridSkeleton />;

  // 2. Fatal error
  if (error) {
    return (
      <ErrorBanner
        message={getUserErrorMessage(error)}
        onRetry={refetch}
        isRetrying={isFetching}
        variant="fullscreen"
      />
    );
  }

  // 3. Edge case: nothing loaded
  if (pokemons.length === 0 && failed > 0) {
    return (
      <ErrorBanner
        message={getPartialErrorMessage(failed)}
        onRetry={refetch}
        isRetrying={isFetching}
        variant="fullscreen"
      />
    );
  }

  // 4. Success + partial error
  return (
    <>
      {isFetching && !isLoading && <LinearProgress />}
      {failed > 0 && <ErrorBanner message={getPartialErrorMessage(failed)} variant="inline" />}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={homeStyles.grid}>
        {paginatedPokemons.map((pokemon: PokemonCardProps) => (
          <Grid key={pokemon.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <PokemonCard {...pokemon} onClick={() => navigate(`/details/${pokemon.id}`)} />
          </Grid>
        ))}
      </Grid>
      <PokemonPagination
        currentPage={currentPage}
        pageSize={env.pageSize}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default Home;
