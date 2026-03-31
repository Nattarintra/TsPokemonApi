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

const getSizeStyles = (size: ChipSize) => {
  const styles: Record<
    ChipSize,
    { fontSize: string; height: string; padding: string; "& .MuiChip-label": { padding: string } }
  > = {
    small: {
      fontSize: "0.75rem",
      height: "20px",
      padding: "2px 6px",
      "& .MuiChip-label": {
        padding: "0 4px",
      },
    },
    medium: {
      fontSize: "0.875rem",
      height: "28px",
      padding: "4px 8px",
      "& .MuiChip-label": {
        padding: "0 6px",
      },
    },
    large: {
      fontSize: "1rem",
      height: "38px",
      padding: "8px 12px",
      "& .MuiChip-label": {
        padding: "0 6px",
      },
    },
  };
  return styles[size];
};

const getChipStyles = (size: ChipSize, item: string) => (theme: Theme) => {
  const sizeStyle = getSizeStyles(size);
  return {
    fontSize: sizeStyle.fontSize,
    height: sizeStyle.height,
    padding: sizeStyle.padding,
    "& .MuiChip-label": sizeStyle["& .MuiChip-label"],
    borderRadius: `${theme.shape.radius.small}px`,
    textTransform: "capitalize" as const,
    backgroundColor: pokemonTypeColors[item as PokemonType],
    color: theme.palette.getContrastText(pokemonTypeColors[item as PokemonType]),
  };
};

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
