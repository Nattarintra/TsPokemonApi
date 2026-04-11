import type { ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import type { Theme } from "@mui/material";
import type { SxProps } from "@mui/material";
import type { PokemonStat } from "@/types/pokemon.type";
import { statColors, type StatName } from "@/theme/tokens/statColors";
import { colors } from "@/theme/tokens/colors";
import { formatStatName } from "@/utils/pokemonDetail/pokemonDetail.formatter";
import { MAX_STAT_VALUE } from "@/constants";

interface StatBarsProps {
  stats: PokemonStat[];
}

const statBarsStyles: Record<string, SxProps<Theme>> = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 1.5,
    mb: 4,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 2,
  },
  label: (theme: Theme) => ({
    minWidth: theme.spacing(16),
    color: theme.palette.text.secondary,
  }),
  value: {
    minWidth: 32,
    textAlign: "right",
  },
  barTrack: (theme: Theme) => ({
    flex: 1,
    height: theme.spacing(1),
    borderRadius: theme.shape.radius.full,
    backgroundColor: theme.palette.action.hover,
    overflow: "hidden",
  }),
};

const barFill = (color: string, percentage: number): SxProps<Theme> => ({
  height: "100%",
  width: `${percentage}%`,
  borderRadius: "inherit",
  backgroundColor: color,
  transition: "width 0.6s ease",
});

const StatBars = ({ stats }: StatBarsProps): ReactElement => {
  return (
    <Box sx={statBarsStyles.container}>
      {stats.map((stat) => {
        const color = statColors[stat.name as StatName] ?? colors.statDefault;
        const percentage = Math.min((stat.value / MAX_STAT_VALUE) * 100, 100);

        return (
          <Box key={stat.name} sx={statBarsStyles.row}>
            <Typography variant="caption" sx={statBarsStyles.label}>
              {formatStatName(stat.name)}
            </Typography>
            <Typography variant="caption" sx={statBarsStyles.value}>
              {stat.value}
            </Typography>
            <Box sx={statBarsStyles.barTrack}>
              <Box sx={barFill(color, percentage)} />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default StatBars;
