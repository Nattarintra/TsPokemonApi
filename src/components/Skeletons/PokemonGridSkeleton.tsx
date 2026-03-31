import type { ReactElement } from "react";
import { Grid, type SxProps, type Theme } from "@mui/material";
import PokemonCardSkeleton from "./PokemonCardSkeleton";
import { GRID_MAX_WIDTH, SKELETON_COUNT } from "@/constants";

const pokemonGridSkeletonStyles: Record<"grid", SxProps<Theme>> = {
  grid: {
    width: "100%",
    maxWidth: GRID_MAX_WIDTH,
    mx: "auto",
    px: { xs: 2, sm: 3 },
    mt: { xs: 2, sm: 3 },
  } satisfies SxProps<Theme>,
};

const PokemonGridSkeleton = (): ReactElement => {
  return (
    <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={pokemonGridSkeletonStyles.grid}>
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <Grid key={index} size={{ xs: 12, md: 6, lg: 4 }}>
          <PokemonCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
};

export default PokemonGridSkeleton;
