/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_NAME: string
    readonly VITE_API_BASE_URL: string
    readonly VITE_POKEMON_IMAGE_BASE_URL?: string
    readonly VITE_ENABLE_SEARCH?: string
    readonly VITE_ENABLE_FILTERS?: string
    readonly VITE_DEFAULT_PAGE_SIZE?: string
    readonly VITE_SHOW_POKEMON_STATS?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}