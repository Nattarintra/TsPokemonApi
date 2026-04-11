import NavigationBar from "@/components/Details/NavigationBar";
import EvolutionSection from "@/components/Evolution/EvolutionSection";
import HeroSection from "@/components/Hero/HeroSection";
import PageContainer from "@/components/Layout/PageContainer";
import QueryBoundary from "@/components/QueryBoundary/QueryBoundary";
import StatBars from "@/components/Stat/StatBars";
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

  if (!data) return <p>Pokemon not found</p>;

  const { identity, bio, combat, evolutions, evolutionsFailed, weaknessesFailed } = data;

  return (
    <QueryBoundary
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      data={data}
      onRetry={refetch}
      skeleton={<p>Loading...</p>}
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
