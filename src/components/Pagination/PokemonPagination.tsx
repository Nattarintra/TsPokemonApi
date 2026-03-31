import { Box, Pagination as MuiPagination, Typography } from "@mui/material";
import type { ReactElement } from "react";
import type { PokemonPaginationProps } from "@/types/interfaces";

const PokemonPagination = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  boundaryCount = 1,
  siblingCount = 1,
}: PokemonPaginationProps): ReactElement | null => {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const handleChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
  };

  return (
    <Box
      component="nav"
      aria-label="Pokemon list pagination"
      sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}
    >
      <Typography variant="body2" aria-live="polite">
        Showing {start} - {end} of {totalItems} Pokémon
      </Typography>
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        boundaryCount={boundaryCount}
        siblingCount={siblingCount}
        showFirstButton
        showLastButton
        color="primary"
        shape="rounded"
        aria-label="Pokemon pagination controls"
      />
    </Box>
  );
};

export default PokemonPagination;
