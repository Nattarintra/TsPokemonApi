import type { ReactElement } from "react";
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface PokemonImageProps {
  name: string;
  image: string;
}

const pokemonImageStyles: Record<string, SxProps<Theme>> = {
  container: (theme: Theme) => ({
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: theme.shape.radius.extraSmall,
    backgroundColor: theme.palette.background.default,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    p: 2,
  }),
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
};

const PokemonImage = ({ name, image }: PokemonImageProps): ReactElement => {
  return (
    <Box sx={pokemonImageStyles.container}>
      <Box component="img" src={image} alt={name} sx={pokemonImageStyles.image} />
    </Box>
  );
};

export default PokemonImage;
