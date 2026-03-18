import { colors } from "@theme/tokens/colors";
import { radii } from "@theme/tokens/radii";

export const cardOverrides = {
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: radii.sm,
                border: `1px solid ${colors.border}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                backgroundImage: "none",
                overflow: "hidden",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
                },
            },
        },
    },

    MuiCardContent: {
        styleOverrides: {
            root: {
                padding: 16,
                "&:last-child": {
                    paddingBottom: 16,
                },
            },
        },
    },

    MuiCardMedia: {
        styleOverrides: {
            root: {
                height: 140,
                objectFit: "contain" as const,
                backgroundColor: colors.surfaceAlt,
                padding: 16,
            },
        },
    },
};