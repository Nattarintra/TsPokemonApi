import type { Components, Theme } from "@mui/material/styles";

export const cardOverrides: Components<Theme> = {
    MuiCard: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: theme.shape.radius.small,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[1],
                backgroundImage: "none",
                overflow: "hidden",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",

                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows[4],
                },
            }),
        },
    },

    MuiCardContent: {
        styleOverrides: {
            root: ({ theme }) => ({
                padding: theme.spacing(2),

                "&:last-child": {
                    paddingBottom: theme.spacing(2),
                },
            }),
        },
    },

    MuiCardMedia: {
        styleOverrides: {
            root: ({ theme }) => ({
                width: "100%",
                height: "100%",
                objectFit: "contain",
                backgroundColor: theme.palette.background.default,
                padding: theme.spacing(2),
            }),
        },
    },
};