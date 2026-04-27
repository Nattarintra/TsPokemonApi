import type { ReactElement } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PageContainer from "@/components/Layout/PageContainer";
import PokemonCard from "@/components/Cards/PokemonCard";
import { useFavorites } from "@/hooks/useFavorites";
import type { SxProps, Theme } from "@mui/material";

const favoritesStyles: Record<string, SxProps<Theme>> = {
  emptyContainer: (theme: Theme) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    py: theme.spacing(10),
    color: theme.palette.text.secondary,
  }),
  icon: (theme: Theme) => ({
    fontSize: theme.spacing(8),
    opacity: 0.4,
  }),
};

const Favorites = (): ReactElement => {
  const navigate = useNavigate();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <PageContainer>
        <Box sx={favoritesStyles.emptyContainer}>
          <FavoriteBorderIcon sx={favoritesStyles.icon} />
          <Typography variant="h4">No favorites yet</Typography>
          <Typography variant="body2">Click the heart on any Pokémon to save it here</Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Typography variant="h2" sx={{ mb: 3 }}>
        My Favorites
      </Typography>
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {favorites.map((pokemon) => (
          <Grid key={pokemon.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <PokemonCard
              {...pokemon}
              onClick={() => navigate(`/details/${pokemon.id}`)}
              isFavorite={isFavorite(pokemon.id)}
              onFavoriteToggle={(e) => {
                e.stopPropagation();
                toggleFavorite(pokemon);
              }}
            />
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
};

export default Favorites;
