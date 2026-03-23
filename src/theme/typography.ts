import type { ThemeOptions } from "@mui/material/styles";

export const typography: ThemeOptions["typography"] = {
    fontFamily: [
        "Avenir Next",
        "Inter",
        "Segoe UI",
        "Helvetica Neue",
        "Arial",
        "sans-serif",
    ].join(","),

    // Headings
    h1: {
        fontSize: "3rem",      // 48px
        lineHeight: 1.1,
        fontWeight: 700,
    },
    h2: {
        fontSize: "2rem",      // 32px
        lineHeight: 1.15,
        fontWeight: 700,
    },
    h3: {
        fontSize: "1.5rem",    // 24px
        lineHeight: 1.2,
        fontWeight: 700,
    },
    h4: {
        fontSize: "1.25rem",   // 20px
        lineHeight: 1.25,
        fontWeight: 600,
    },
    h5: {
        fontSize: "1.125rem",  // 18px
        lineHeight: 1.3,
        fontWeight: 600,
    },
    h6: {
        fontSize: "1rem",      // 16px
        lineHeight: 1.35,
        fontWeight: 600,
    },

    // Body
    body1: {
        fontSize: "1rem",      // 16px
        lineHeight: 1.6,
        fontWeight: 400,
    },
    body2: {
        fontSize: "0.875rem",  // 14px
        lineHeight: 1.5,
        fontWeight: 400,
    },

    // Small text
    caption: {
        fontSize: "0.75rem",   // 12px
        lineHeight: 1.4,
        fontWeight: 500,
    },

    // Buttons
    button: {
        fontSize: "0.875rem",
        lineHeight: 1.2,
        fontWeight: 600,
        textTransform: "none",
    },
};