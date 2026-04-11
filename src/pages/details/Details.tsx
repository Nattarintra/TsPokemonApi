import NavigationBar from "@/components/Details/NavigationBar";
import EvolutionSection from "@/components/Evolution/EvolutionSection";
import HeroSection from "@/components/Details/Hero/HeroSection";
import PageContainer from "@/components/Layout/PageContainer";
import QueryBoundary from "@/components/QueryBoundary/QueryBoundary";
import StatBars from "@/components/Stat/StatBars";
import DetailsSkeleton from "@/components/Skeletons/DetailsSkeleton";
import { usePokemonDetailQuery } from "@/hooks/usePokemonDetailQuery";
import { usePokemonNavigation } from "@/hooks/usePokemonNavigation";
import type { ReactElement } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { PokemonDetailProps } from "@/types/pokemon.type";

const Details = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pokemonId = Number(id);

  const { previousPokemon, nextPokemon } = usePokemonNavigation(pokemonId);
  const { data, isLoading, error, refetch, isFetching } = usePokemonDetailQuery(pokemonId);

  const handleNavigate = (id: number) => {
    navigate(`/details/${id}`);
  };

  const {
    identity,
    bio,
    combat = { stats: [], types: [], weaknesses: [] },
    evolutions = [],
    evolutionsFailed = 0,
    weaknessesFailed = 0,
  } = (data ?? {}) as PokemonDetailProps;

  return (
    <QueryBoundary
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      data={data}
      onRetry={refetch}
      skeleton={<DetailsSkeleton />}
    >
      <PageContainer>
        <NavigationBar
          previousPokemon={previousPokemon}
          nextPokemon={nextPokemon}
          onNavigate={handleNavigate}
        />

        <HeroSection
          identity={identity}
          bio={bio}
          combat={combat}
          weaknessesFailed={weaknessesFailed}
        />

        <StatBars stats={combat.stats} />

        <EvolutionSection
          evolutions={evolutions}
          evolutionsFailed={evolutionsFailed}
          onNavigate={handleNavigate}
        />
      </PageContainer>
    </QueryBoundary>
  );
};

export default Details;
