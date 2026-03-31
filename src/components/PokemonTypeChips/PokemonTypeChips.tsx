import type { ReactElement } from "react";
import { Box, Chip } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { pokemonTypeColors, type PokemonType } from "@/theme/tokens";

type ChipSize = "small" | "medium" | "large";

interface PokemonTypeChipsProps {
  items: string[];
  size?: ChipSize;
  variant?: "types" | "weaknesses";
}

const getSizeStyles = (size: ChipSize) => (theme: Theme) => {
  const styles = {
    small: {
      fontSize: theme.typography.caption.fontSize,
      height: theme.spacing(2.5),
      padding: `${theme.spacing(0.25)} ${theme.spacing(0.75)}`,
      "& .MuiChip-label": { padding: `0 ${theme.spacing(0.5)}` },
    },
    medium: {
      fontSize: theme.typography.body2.fontSize,
      height: theme.spacing(3.5),
      padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
      "& .MuiChip-label": { padding: `0 ${theme.spacing(0.75)}` },
    },
    large: {
      fontSize: theme.typography.body1.fontSize,
      height: theme.spacing(4.75),
      padding: `${theme.spacing(1)} ${theme.spacing(1.5)}`,
      "& .MuiChip-label": { padding: `0 ${theme.spacing(0.75)}` },
    },
  };
  return styles[size];
};

const getChipStyles = (size: ChipSize, item: string) => (theme: Theme) => ({
  ...getSizeStyles(size)(theme),
  borderRadius: `${theme.shape.radius.small}px`,
  textTransform: "capitalize" as const,
  backgroundColor: pokemonTypeColors[item as PokemonType],
  color: theme.palette.getContrastText(pokemonTypeColors[item as PokemonType]),
});

const PokemonTypeChips = ({
  items,
  size = "medium",
  variant = "types",
}: PokemonTypeChipsProps): ReactElement => {
  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
      {items.map((item) => (
        <Chip
          key={item}
          label={item}
          data-testid={`${variant}-chip-${item}`}
          sx={getChipStyles(size, item)}
        />
      ))}
    </Box>
  );
};

export default PokemonTypeChips;
