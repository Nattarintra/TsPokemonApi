export const ERROR_MESSAGES = {
    NETWORK: "Check your internet connection.",
    DEFAULT: "Something went wrong.",
    NOT_FOUND: "The requested Pokémon could not be found.",
    SERVER: "Server error. Please try again.",
    PARTIAL: (count: number) =>
        `Some Pokémon failed to load (${count})`,
};