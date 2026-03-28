// src/config/env.ts

function getRequiredEnv(envName: string, envValue: string | undefined): string {
    if (!envValue || envValue.trim() === '') {
        throw new Error(`Missing environment variable: ${envName}`)
    }

    return envValue
}

function getOptionalEnv(envValue: string | undefined, fallback: string): string {
    return envValue?.trim() ? envValue : fallback
}

function toBoolean(envValue: string | undefined, fallback = false): boolean {
    if (envValue === undefined) return fallback
    return envValue === 'true'
}

function toNumber(envValue: string | undefined, fallback: number): number {
    if (envValue === undefined || envValue.trim() === '') return fallback

    const parsed = Number(envValue)

    if (Number.isNaN(parsed)) {
        throw new Error(`Invalid number environment variable: ${envValue}`)
    }

    return parsed
}

const metaEnv = (import.meta as any).env || process.env || {};

export const env = {
    appName: getRequiredEnv('VITE_APP_NAME', metaEnv.VITE_APP_NAME),

    apiBaseUrl: getRequiredEnv(
        'VITE_API_BASE_URL',
        metaEnv.VITE_API_BASE_URL
    ),

    pokemonImageBaseUrl: getOptionalEnv(
        metaEnv.VITE_POKEMON_IMAGE_BASE_URL,
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
    ),

    enableSearch: toBoolean(metaEnv.VITE_ENABLE_SEARCH, true),

    enableFilters: toBoolean(metaEnv.VITE_ENABLE_FILTERS, true),

    defaultPageSize: toNumber(metaEnv.VITE_DEFAULT_PAGE_SIZE, 12),

    showPokemonStats: toBoolean(metaEnv.VITE_SHOW_POKEMON_STATS, true),

    delayTime: toNumber(metaEnv.VITE_API_DELAY_MS, 3000),

} as const

export type AppEnv = typeof env