import type { ReactElement } from "react";
import { Box, Chip } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { pokemonTypeColors, type PokemonType } from "@/theme/tokens";

interface TypeFilterButtonsProps {
  activeType: string;
  onTypeChange: (type: string) => void;
}

const typeFilterStyles: Record<string, SxProps<Theme>> = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: 1,
  },
};

const getChipSx =
  (type: string, isActive: boolean): SxProps<Theme> =>
  (theme) => ({
    borderRadius: theme.shape.radius.small,
    textTransform: "capitalize",
    fontWeight: isActive ? 700 : 400,
    backgroundColor: isActive ? pokemonTypeColors[type as PokemonType] : theme.palette.action.hover,
    color: isActive
      ? theme.palette.getContrastText(pokemonTypeColors[type as PokemonType])
      : theme.palette.text.secondary,
    border: `1px solid ${
      isActive ? pokemonTypeColors[type as PokemonType] : theme.palette.divider
    }`,
    transition: theme.transitions.create(["background-color", "color", "border-color"], {
      duration: theme.transitions.duration.short,
    }),
    "&:hover": {
      backgroundColor: pokemonTypeColors[type as PokemonType],
      color: theme.palette.getContrastText(pokemonTypeColors[type as PokemonType]),
      borderColor: pokemonTypeColors[type as PokemonType],
    },
  });

const TypeFilterButtons = ({ activeType, onTypeChange }: TypeFilterButtonsProps): ReactElement => {
  const types = Object.keys(pokemonTypeColors) as PokemonType[];

  return (
    <Box sx={typeFilterStyles.container}>
      {types.map((type) => (
        <Chip
          key={type}
          label={type}
          onClick={() => onTypeChange(type)}
          sx={getChipSx(type, activeType === type)}
          aria-pressed={activeType === type}
          aria-label={`Filter by ${type} type`}
          data-testid={`type-filter-${type}`}
        />
      ))}
    </Box>
  );
};

export default TypeFilterButtons;
