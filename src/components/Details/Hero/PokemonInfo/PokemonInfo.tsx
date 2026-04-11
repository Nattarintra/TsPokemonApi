import type { ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import type { PokemonBioInfo, PokemonCombatInfo } from "@/types/pokemon.type";
import PokemonTypeChips from "@/components/PokemonTypeChips/PokemonTypeChips";
import PokemonInfoTable from "./PokemonInfoTable";
import ErrorBanner from "@/components/Errors/ErrorBanner";
import { getPartialErrorMessage } from "@/errors/getErrorMessages";
import { formatId } from "@/utils/pokemonDetail/pokemonDetail.formatter";

interface PokemonInfoProps {
  id: number;
  name: string;
  bio: PokemonBioInfo;
  combat: PokemonCombatInfo;
  weaknessesFailed: number;
}

const pokemonInfoStyles: Record<string, SxProps<Theme>> = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  description: (theme: Theme) => ({
    color: theme.palette.text.secondary,
  }),
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
};

const PokemonInfo = ({
  id,
  name,
  bio,
  combat,
  weaknessesFailed,
}: PokemonInfoProps): ReactElement => {
  return (
    <Box sx={pokemonInfoStyles.container}>
      <Typography variant="caption" color="text.secondary">
        {formatId(id)}
      </Typography>

      <Typography variant="h2" sx={{ textTransform: "capitalize" }}>
        {name}
      </Typography>

      <Typography variant="body2" sx={pokemonInfoStyles.description}>
        {bio.description}
      </Typography>

      <PokemonInfoTable bio={bio} />

      <Box sx={pokemonInfoStyles.section}>
        <Typography variant="caption" color="text.secondary">
          Type
        </Typography>
        <PokemonTypeChips items={combat.types} size="medium" variant="types" />
      </Box>

      <Box sx={pokemonInfoStyles.section}>
        <Typography variant="caption" color="text.secondary">
          Weaknesses
        </Typography>
        {weaknessesFailed > 0 && (
          <ErrorBanner message={getPartialErrorMessage(weaknessesFailed)} variant="inline" />
        )}
        <PokemonTypeChips items={combat.weaknesses} size="medium" variant="weaknesses" />
      </Box>
    </Box>
  );
};

export default PokemonInfo;
