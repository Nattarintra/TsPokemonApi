import {
  Box,
  Pagination as MuiPagination,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { ChangeEvent, ReactElement } from "react";
import type { PokemonPaginationProps } from "@/types/interfaces";

const PokemonPagination = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  boundaryCount = 1,
  siblingCount = 1,
}: PokemonPaginationProps): ReactElement | null => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const handleChange = (_event: ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
  };

  return (
    <Box
      component="nav"
      aria-label="Pokemon list pagination"
      sx={{
        mt: { xs: 3, sm: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        px: { xs: 1, sm: 0 },
      }}
    >
      <Typography variant="body2" aria-live="polite">
        Showing {start} - {end} of {totalItems} Pokémon
      </Typography>
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        boundaryCount={isMobile ? 1 : boundaryCount}
        siblingCount={isMobile ? 0 : siblingCount}
        showFirstButton={!isMobile}
        showLastButton={!isMobile}
        size={isMobile ? "small" : "medium"}
        color="primary"
        shape="rounded"
        aria-label="Pokemon pagination controls"
      />
    </Box>
  );
};

export default PokemonPagination;
