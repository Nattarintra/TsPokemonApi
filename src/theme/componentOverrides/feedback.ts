import { colors } from "@theme/tokens/colors";

export const feedbackOverrides = {
    MuiLinearProgress: {
        styleOverrides: {
            root: {
                height: 10,
                borderRadius: 999,
                backgroundColor: "rgba(48, 167, 215, 0.15)",
                overflow: "hidden",
            },
            bar: {
                borderRadius: 999,
            },
        },
    },

    MuiDivider: {
        styleOverrides: {
            root: {
                borderColor: colors.divider,
            },
        },
    },

    MuiTooltip: {
        styleOverrides: {
            tooltip: {
                borderRadius: 8,
                fontSize: "0.75rem",
                backgroundColor: "#222222",
            },
        },
    },
};