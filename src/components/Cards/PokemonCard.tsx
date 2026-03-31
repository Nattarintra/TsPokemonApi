import type { ReactElement } from "react";
import { CardMedia, Typography, Box } from "@mui/material";
import PokemonTypeChips from "@/components/PokemonTypeChips/PokemonTypeChips";
import type { PokemonCardProps } from "@/types/pokemon.type";
import PokemonCardLayout from "./PokemonCardLayout";

interface PokemonCardExtendedProps extends PokemonCardProps {
  onClick?: () => void;
}

const PokemonCard = ({
  id,
  name,
  image,
  types,
  onClick,
}: PokemonCardExtendedProps): ReactElement => {
  return (
    <PokemonCardLayout
      onClick={onClick}
      image={
        <CardMedia
          component="img"
          image={image}
          alt={name}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      }
      content={
        <>
          <Typography variant="caption" color="text.secondary" fontWeight="bold">
            #{id.toString().padStart(4, "0")}
          </Typography>

          <Typography variant="h2" sx={{ mt: 1, mb: 1, textTransform: "capitalize" }}>
            {name}
          </Typography>

          <Box sx={{ mt: 1 }}>
            <PokemonTypeChips items={types} size="medium" variant="types" />
          </Box>
        </>
      }
    />
  );
};

export default PokemonCard;
