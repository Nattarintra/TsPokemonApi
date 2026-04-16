import type { ReactElement } from "react";
import { InputBase, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import type { SxProps, Theme } from "@mui/material";

interface SearchBarProps {
  onClick: () => void;
}

const searchBarStyles: Record<string, SxProps<Theme>> = {
  container: (theme: Theme) => ({
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.radius.full,
    px: 1.5,
    gap: 1,
    cursor: "pointer",
    border: `1px solid ${theme.palette.divider}`,
    width: { xs: "100%", md: theme.spacing(30) },
    transition: theme.transitions.create(["border-color", "background-color"], {
      duration: theme.transitions.duration.short,
    }),
    "&:hover": {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.background.paper,
    },
  }),
  input: (theme: Theme) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    pointerEvents: "none",
    flex: 1,
    "& input::placeholder": {
      fontSize: { xs: theme.typography.caption.fontSize, md: theme.typography.body2.fontSize },
    },
  }),
};

const SearchBar = ({ onClick }: SearchBarProps): ReactElement => {
  return (
    <Box sx={searchBarStyles.container} onClick={onClick} role="button" aria-label="Open search">
      <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
      <InputBase
        placeholder="Search Pokémon..."
        sx={searchBarStyles.input}
        inputProps={{ "aria-hidden": true, tabIndex: -1 }}
      />
    </Box>
  );
};

export default SearchBar;
