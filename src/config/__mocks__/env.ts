// Test-safe replacement for env.ts.
// Reads from process.env (set by setupTests.ts) instead of import.meta.env.
export const env = {
  appName: process.env.VITE_APP_NAME ?? "Test App",
  apiBaseUrl: process.env.VITE_API_BASE_URL ?? "https://pokeapi.co/api/v2",
  pokemonImageBaseUrl:
    process.env.VITE_POKEMON_IMAGE_BASE_URL ??
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
  enableSearch: true,
  enableFilters: true,
  pageSize: 12,
  limitPokemonList: 150,
  showPokemonStats: true,
  delayTime: 0,
} as const;

export type AppEnv = typeof env;
