import { usePokemonListQuery } from "@/hooks/usePokemonListQuery";
import PokemonCard from "@/components/Cards/PokemonCard";
import { Grid, LinearProgress } from "@mui/material";
import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import ErrorBanner from "@/components/Errors/ErrorBanner";
import { getUserErrorMessage, getPartialErrorMessage } from "@/errors/getErrorMessages";
import PokemonGridSkeleton from "@/components/Skeletons/PokemonGridSkeleton";
import type { PokemonCardProps, PokemonListResult } from "@/types/pokemon.type";

const Home = (): ReactElement => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch, isFetching } = usePokemonListQuery();

  // Safe fallback with type assertion
  const typedData = data as PokemonListResult | undefined;
  const pokemons = typedData?.pokemons ?? [];
  const failed = typedData?.failed ?? 0;

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
      <Grid container spacing={5} sx={{ width: '80%', margin: '20px auto' }}>
        {pokemons.map((pokemon: PokemonCardProps) => (
          <Grid key={pokemon.id} size={{ xs: 12, md: 6, lg: 4 }}>
            <PokemonCard
              {...pokemon}
              onClick={() => navigate(`/details/${pokemon.id}`)}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Home;
