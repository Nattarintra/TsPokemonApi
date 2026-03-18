// src/config/env.ts

type EnvValue = string | boolean | number

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

export const env = {
    appName: getRequiredEnv('VITE_APP_NAME', import.meta.env.VITE_APP_NAME),

    apiBaseUrl: getRequiredEnv(
        'VITE_API_BASE_URL',
        import.meta.env.VITE_API_BASE_URL
    ),

    pokemonImageBaseUrl: getOptionalEnv(
        import.meta.env.VITE_POKEMON_IMAGE_BASE_URL,
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
    ),

    enableSearch: toBoolean(import.meta.env.VITE_ENABLE_SEARCH, true),

    enableFilters: toBoolean(import.meta.env.VITE_ENABLE_FILTERS, true),

    defaultPageSize: toNumber(import.meta.env.VITE_DEFAULT_PAGE_SIZE, 12),

    showPokemonStats: toBoolean(import.meta.env.VITE_SHOW_POKEMON_STATS, true),
} as const

export type AppEnv = typeof env