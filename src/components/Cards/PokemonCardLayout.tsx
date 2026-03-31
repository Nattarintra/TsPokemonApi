import { Card as MuiCard, CardContent, Box } from "@mui/material";
import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";

interface PokemonCardLayoutProps {
  image: ReactNode;
  content: ReactNode;
  onClick?: () => void;
}

const styles = {
  boxImage: {
    width: "100%",
    aspectRatio: "1 / 1",
    overflow: "hidden",
  },

  card:
    (isClickable: boolean): SxProps<Theme> =>
    (theme) => ({
      cursor: isClickable ? "pointer" : "default",
      transition: theme.transitions.create(["transform", "boxShadow"], {
        duration: theme.transitions.duration.standard,
      }),
      "&:hover": isClickable
        ? {
            transform: "translateY(-4px)",
            boxShadow: theme.shadows[6],
          }
        : {
            transform: "none",
            boxShadow: "none",
          },
    }),
};

const PokemonCardLayout = ({ image, content, onClick }: PokemonCardLayoutProps) => {
  return (
    <MuiCard onClick={onClick} sx={styles.card(!!onClick)}>
      <Box sx={styles.boxImage}>{image}</Box>
      <CardContent>{content}</CardContent>
    </MuiCard>
  );
};

export default PokemonCardLayout;
