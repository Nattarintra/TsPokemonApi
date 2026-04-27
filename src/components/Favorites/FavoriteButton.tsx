import type { ReactElement } from "react";
import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const FavoriteButton = ({ isFavorite, onClick }: FavoriteButtonProps): ReactElement => {
  return (
    <IconButton
      size="small"
      onClick={onClick}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isFavorite}
    >
      {isFavorite ? (
        <FavoriteIcon sx={{ fontSize: 16, color: "error.main" }} />
      ) : (
        <FavoriteBorderIcon sx={{ fontSize: 16, color: "text.secondary" }} />
      )}
    </IconButton>
  );
};

export default FavoriteButton;
