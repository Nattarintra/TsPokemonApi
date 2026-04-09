import { getPartialErrorMessage } from "@/errors/getErrorMessages";
import type { EvolutionStage } from "@/types/pokemon.type";
import { Box, Typography, type SxProps, type Theme } from "@mui/material";
import type { ReactElement } from "react";
import EvolutionCard from "./EvolutionCard";
import ErrorBanner from "@/components/Errors/ErrorBanner";

interface EvolutionSectionProps {
  evolutions: EvolutionStage[];
  evolutionsFailed: number;
  onNavigate: (id: number) => void;
}

const evolutionSectionStyles: Record<string, SxProps<Theme>> = {
  container: (theme: Theme) => ({
    backgroundColor: theme.palette.grey[800],
    borderRadius: theme.shape.radius.extraSmall,
    p: { xs: 2, sm: 3 },
    mb: 4,
  }),
  title: (theme: Theme) => ({
    color: theme.palette.common.white,
    mb: 2,
  }),
  chain: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 1,
  },
  arrow: (theme: Theme) => ({
    color: theme.palette.common.white,
    fontSize: theme.spacing(3),
    mx: 1,
  }),
};

const EvolutionSection = ({
  evolutions,
  evolutionsFailed,
  onNavigate,
}: EvolutionSectionProps): ReactElement | null => {
  if (evolutions.length === 0 && evolutionsFailed === 0) return null;

  return (
    <Box sx={evolutionSectionStyles.container}>
      <Typography variant="h4" sx={evolutionSectionStyles.title}>
        Evolutions
      </Typography>
      {evolutionsFailed > 0 && (
        <ErrorBanner message={getPartialErrorMessage(evolutionsFailed)} variant="inline" />
      )}
      <Box sx={evolutionSectionStyles.chain}>
        {evolutions.map((evolution, index) => (
          <Box key={evolution.id} sx={evolutionSectionStyles.chain}>
            {index > 0 && <Typography sx={evolutionSectionStyles.arrow}>›</Typography>}
            <EvolutionCard {...evolution} onClick={() => onNavigate(evolution.id)} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
export default EvolutionSection;
