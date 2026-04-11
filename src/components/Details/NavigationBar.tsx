import type { ReactElement } from "react";
import { Box, Typography, ButtonBase } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import type { SxProps, Theme } from "@mui/material";
import { formatId } from "@/utils/pokemonDetail/pokemonDetail.formatter";

interface PokemonNavItem {
  id: number;
  name: string;
}

interface NavigationBarProps {
  previousPokemon: PokemonNavItem | null;
  nextPokemon: PokemonNavItem | null;
  onNavigate: (id: number) => void;
}

const navigationBarStyles: Record<string, SxProps<Theme>> = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2,
  },
  button: (theme: Theme) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
    px: theme.spacing(1.5),
    py: theme.spacing(0.75),
    borderRadius: theme.shape.radius.small,
    color: theme.palette.text.secondary,
    transition: theme.transitions.create(["color", "background-color"], {
      duration: theme.transitions.duration.short,
    }),
    "&:hover": {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.action.hover,
    },
  }),
};

const NavigationBar = ({
  previousPokemon,
  nextPokemon,
  onNavigate,
}: NavigationBarProps): ReactElement => {
  return (
    <Box sx={navigationBarStyles.container}>
      {previousPokemon ? (
        <ButtonBase
          sx={navigationBarStyles.button}
          onClick={() => onNavigate(previousPokemon.id)}
          aria-label={`Go to ${previousPokemon.name}`}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 12 }} />
          <Typography variant="caption">
            {formatId(previousPokemon.id)} {previousPokemon.name}
          </Typography>
        </ButtonBase>
      ) : (
        <Box />
      )}

      {nextPokemon ? (
        <ButtonBase
          sx={navigationBarStyles.button}
          onClick={() => onNavigate(nextPokemon.id)}
          aria-label={`Go to ${nextPokemon.name}`}
        >
          <Typography variant="caption">
            {nextPokemon.name} {formatId(nextPokemon.id)}
          </Typography>
          <ArrowForwardIosIcon sx={{ fontSize: 12 }} />
        </ButtonBase>
      ) : (
        <Box />
      )}
    </Box>
  );
};

export default NavigationBar;
