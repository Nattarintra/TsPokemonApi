import type { ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import type { EvolutionStage } from "@/types/pokemon.type";
import PokemonTypeChips from "@/components/PokemonTypeChips/PokemonTypeChips";
import { formatId } from "@/utils/pokemonDetail/pokemonDetail.formatter";

interface EvolutionCardProps extends EvolutionStage {
  onClick: () => void;
}

const evolutionCardStyles: Record<string, SxProps<Theme>> = {
  container: (theme: Theme) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 1,
    cursor: "pointer",
    p: 1,
    borderRadius: theme.shape.radius.small,
    transition: theme.transitions.create(["background-color"], {
      duration: theme.transitions.duration.short,
    }),
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  }),
  imageWrapper: (theme: Theme) => ({
    width: { xs: theme.spacing(12), sm: theme.spacing(18) },
    height: { xs: theme.spacing(12), sm: theme.spacing(18) },
    borderRadius: theme.shape.radius.full,
    backgroundColor: theme.palette.action.hover,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  }),
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  name: {
    textTransform: "capitalize",
    textAlign: "center",
  },
};

const EvolutionCard = ({ id, name, image, types, onClick }: EvolutionCardProps): ReactElement => {
  return (
    <Box
      sx={evolutionCardStyles.container}
      onClick={onClick}
      role="button"
      aria-label={`Go to ${name}`}
    >
      <Box sx={evolutionCardStyles.imageWrapper}>
        <Box component="img" src={image} alt={name} sx={evolutionCardStyles.image} />
      </Box>
      <Typography variant="caption" color="text.secondary">
        {formatId(id)}
      </Typography>
      <Typography variant="body2" sx={evolutionCardStyles.name}>
        {name}
      </Typography>
      <PokemonTypeChips items={types} size="small" variant="types" />
    </Box>
  );
};

export default EvolutionCard;
