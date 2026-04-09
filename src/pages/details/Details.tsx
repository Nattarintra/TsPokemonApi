import NavigationBar from "@/components/Details/NavigationBar";
import ErrorBanner from "@/components/Errors/ErrorBanner";
import EvolutionSection from "@/components/Evolution/EvolutionSection";
import HeroSection from "@/components/Hero/HeroSection";
import PageContainer from "@/components/Layout/PageContainer";
import PokemonGridSkeleton from "@/components/Skeletons/PokemonGridSkeleton";
import StatBars from "@/components/Stat/StatBars";
import { getUserErrorMessage } from "@/errors/getErrorMessages";
import { usePokemonDetailQuery } from "@/hooks/usePokemonDetailQuery";
import { usePokemonNavigation } from "@/hooks/usePokemonNavigation";
import type { ReactElement } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Details = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pokemonId = Number(id);

  const { previousPokemon, nextPokemon } = usePokemonNavigation(pokemonId);
  const { data, isLoading, error, refetch, isFetching } = usePokemonDetailQuery(pokemonId);

  const handleNavigate = (id: number) => {
    navigate(`/details/${id}`);
  };

  if (isLoading) return <PokemonGridSkeleton />;

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

  if (!data) return <PokemonGridSkeleton />;

  const { identity, bio, combat, evolutions, evolutionsFailed } = data;
  return (
    <PageContainer>
      <NavigationBar
        previousPokemon={previousPokemon}
        nextPokemon={nextPokemon}
        onNavigate={handleNavigate}
      />

      <HeroSection identity={identity} bio={bio} combat={combat} />

      <StatBars stats={combat.stats} />

      <EvolutionSection
        evolutions={evolutions}
        evolutionsFailed={evolutionsFailed}
        onNavigate={handleNavigate}
      />
    </PageContainer>
  );
};

export default Details;
