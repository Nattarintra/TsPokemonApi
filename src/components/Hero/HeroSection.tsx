import type { ReactElement } from "react";
import { Grid } from "@mui/material";
import type { PokemonIdentity, PokemonBioInfo, PokemonCombatInfo } from "@/types/pokemon.type";
import PokemonImage from "./PokemonImage";
import PokemonInfo from "./PokemonInfo/PokemonInfo";

interface HeroSectionProps {
  identity: PokemonIdentity;
  bio: PokemonBioInfo;
  combat: PokemonCombatInfo;
}

const HeroSection = ({ identity, bio, combat }: HeroSectionProps): ReactElement => {
  return (
    <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, md: 5 }}>
        <PokemonImage name={identity.name} image={identity.image} />
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <PokemonInfo id={identity.id} name={identity.name} bio={bio} combat={combat} />
      </Grid>
    </Grid>
  );
};

export default HeroSection;
