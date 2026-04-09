import type { ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import type { PokemonBioInfo } from "@/types/pokemon.type";

const pokemonInfoTableStyles: Record<string, SxProps<Theme>> = {
  container: (theme: Theme) => ({
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.radius.small,
    p: 2,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 1,
  }),
  label: (theme: Theme) => ({
    color: theme.palette.primary.contrastText,
    opacity: 0.7,
  }),
  value: (theme: Theme) => ({
    color: theme.palette.primary.contrastText,
    textTransform: "capitalize",
  }),
};

interface PokemonInfoTableProps {
  bio: PokemonBioInfo;
}

const InfoRow = ({ label, value }: { label: string; value: string }): ReactElement => (
  <Box>
    <Typography variant="caption" sx={pokemonInfoTableStyles.label}>
      {label}
    </Typography>
    <Typography variant="body2" sx={pokemonInfoTableStyles.value}>
      {value}
    </Typography>
  </Box>
);

const PokemonInfoTable = ({ bio }: PokemonInfoTableProps): ReactElement => {
  return (
    <Box sx={pokemonInfoTableStyles.container}>
      <InfoRow label="Height" value={bio.height} />
      <InfoRow label="Category" value={bio.category} />
      <InfoRow label="Weight" value={bio.weight} />
      <InfoRow label="Abilities" value={bio.abilities.join(", ")} />
      <InfoRow label="Gender" value={bio.gender.join(", ")} />
    </Box>
  );
};

export default PokemonInfoTable;
