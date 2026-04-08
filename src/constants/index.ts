export const MAX_RETRIES = 2;
export const RETRY_BASE_DELAY = 500;
export const RETRY_MAX_DELAY = 2000;

export const SKELETON_COUNT = 6;

export const GRID_MAX_WIDTH = 1200;

export const DRAWER_WIDTH = 240;

export const QUERY_KEYS = {
  POKEMON_LIST: ["pokemon-list"],
  POKEMON_DETAIL: (id: number) => ["pokemon-detail", id],
} as const;
