export interface PokemonPaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  boundaryCount?: number;
  siblingCount?: number;
}
