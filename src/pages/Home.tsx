import { usePokemonListQuery } from "@/hooks/usePokemonListQuery";
import PokemonCard from "@/components/Cards/PokemonCard";
import { Grid, LinearProgress } from "@mui/material";
import type { ReactElement } from "react";
import ErrorBanner from "@/components/Errors/ErrorBanner";
import { getUserErrorMessage } from "@/errors/getUserErrorMessage";
import { getPartialErrorMessage } from "@/errors/getPartialErrorMessage";


const Home = (): ReactElement => {

    const { data, isLoading, error, refetch, isFetching } = usePokemonListQuery();

    // Safe fallback
    const pokemons = data?.pokemons ?? [];
    const failed = data?.failed ?? 0;

    //  1 Loading
    // TODO: Add Skeleton Loader
    if ((isLoading)) return <p>Loading...</p>

    // 2 error
    if (error) {
        return <ErrorBanner
            message={getUserErrorMessage(error)}
            onRetry={refetch}
            isRetrying={isFetching}
            variant="fullscreen"
        />
    }

    // Edge case: nothing loaded
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
    // 3 success + partial error
    return (
        <>
            {isFetching && !isLoading && <LinearProgress />}
            {failed > 0 && (
                <ErrorBanner
                    message={getUserErrorMessage({
                        type: "PARTIAL_ERROR",
                        failed,
                    })}
                    variant="inline"
                />
            )}
            <Grid container spacing={5} sx={{ width: "80%", margin: "20px auto" }}>
                {pokemons.map((pokemon) => (
                    <Grid key={pokemon.id} size={{ xs: 12, md: 6, lg: 4 }}>
                        <PokemonCard {...pokemon} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default Home;