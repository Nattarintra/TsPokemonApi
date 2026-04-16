import { usePokemonListQuery } from "@/hooks/usePokemonListQuery";
import PokemonCard from "@/components/Cards/PokemonCard";
import { Grid, LinearProgress } from "@mui/material";
import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import ErrorBanner from "@/components/Errors/ErrorBanner";
import { getPartialErrorMessage } from "@/errors/getErrorMessages";
import PokemonGridSkeleton from "@/components/Skeletons/PokemonGridSkeleton";
import type { PokemonCardProps, PokemonListResult } from "@/types/pokemon.type";
import PokemonPagination from "@/components/Pagination/PokemonPagination";
import { env } from "@/config";
import PageContainer from "@/components/Layout/PageContainer";
import QueryBoundary from "@/components/QueryBoundary/QueryBoundary";
import { useSearchFilter } from "@/hooks/useSearchFilter";

const Home = (): ReactElement => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch, isFetching } = usePokemonListQuery();

  // Safe fallback
  const typedData = data as PokemonListResult | undefined;
  const pokemons = typedData?.pokemons ?? [];
  const failed = typedData?.failed ?? 0;

  const { currentPage, paginatedPokemons, totalItems, handlePageChange } =
    useSearchFilter(pokemons);

  //  Edge case: nothing loaded
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

  // Success + partial error
  return (
    <QueryBoundary
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      data={data}
      onRetry={refetch}
      skeleton={<PokemonGridSkeleton />}
    >
      <PageContainer>
        {isFetching && !isLoading && <LinearProgress />}
        {failed > 0 && <ErrorBanner message={getPartialErrorMessage(failed)} variant="inline" />}
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
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
      </PageContainer>
    </QueryBoundary>
  );
};

export default Home;
