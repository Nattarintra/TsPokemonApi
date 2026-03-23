import { colors } from "@theme/tokens/colors";

export const palette = {
    mode: "light" as const,
    primary: {
        main: colors.primary,
        contrastText: colors.surface,
    },
    secondary: {
        main: colors.secondary,
        contrastText: colors.surface,
    },
    background: {
        default: colors.primary,
        paper: colors.surface,
    },
    text: {
        primary: colors.textPrimary,
        secondary: colors.textSecondary,
    },
    divider: colors.divider,
    success: { main: colors.success },
    warning: { main: colors.warning },
    error: { main: colors.error },
    info: { main: colors.info },
};