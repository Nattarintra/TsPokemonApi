import { usePokemonListQuery } from "@/hooks/usePokemonListQuery";
import PokemonCard from "@/components/Cards/PokemonCard";
import { Grid, LinearProgress, type SxProps, type Theme } from "@mui/material";
import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import ErrorBanner from "@/components/Errors/ErrorBanner";
import { getUserErrorMessage, getPartialErrorMessage } from "@/errors/getErrorMessages";
import PokemonGridSkeleton from "@/components/Skeletons/PokemonGridSkeleton";
import type { PokemonCardProps } from "@/types/pokemon.type";
import { GRID_MAX_WIDTH } from "@/constants";

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
  const pokemons = data?.pokemons ?? [];
  const failed = data?.failed ?? 0;

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
      <Grid container spacing={5} sx={homeStyles.grid}>
        {pokemons.map((pokemon: PokemonCardProps) => (
          <Grid key={pokemon.id} spacing={{ xs: 2, sm: 3, md: 4 }} size={{ xs: 12, md: 6, lg: 4 }}>
            <PokemonCard {...pokemon} onClick={() => navigate(`/details/${pokemon.id}`)} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Home;
