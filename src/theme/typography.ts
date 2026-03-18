import { colors } from "@theme/tokens/colors";

export const typography = {
    fontFamily: [
        "Avenir Next",
        "Avenir",
        "Inter",
        "Segoe UI",
        "Helvetica Neue",
        "Arial",
        "sans-serif",
    ].join(","),

    h1: {
        fontSize: "3rem",
        lineHeight: 1.1,
        fontWeight: 700,
        color: colors.textPrimary,
    },
    h2: {
        fontSize: "2rem",
        lineHeight: 1.15,
        fontWeight: 700,
        color: colors.textPrimary,
    },
    h3: {
        fontSize: "1.5rem",
        lineHeight: 1.2,
        fontWeight: 700,
        color: colors.textPrimary,
    },
    h6: {
        fontSize: "1rem",
        lineHeight: 1.35,
        fontWeight: 700,
        color: colors.textPrimary,
    },
    body1: {
        fontSize: "1rem",
        lineHeight: 1.6,
        fontWeight: 400,
    },
    body2: {
        fontSize: "0.875rem",
        lineHeight: 1.5,
        fontWeight: 400,
    },
    caption: {
        fontSize: "0.75rem",
        lineHeight: 1.4,
        fontWeight: 600,
        color: colors.textMuted,
    },
    button: {
        fontSize: "0.875rem",
        lineHeight: 1.2,
        fontWeight: 700,
        textTransform: "none" as const,
    },
};