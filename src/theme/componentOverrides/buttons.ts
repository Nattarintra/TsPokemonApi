import type { Components, Theme } from "@mui/material/styles";

export const buttonOverrides: Components<Theme> = {
    MuiButton: {
        defaultProps: {
            disableElevation: true,
        },

        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: theme.shape.radius.small,
                textTransform: "none",
                fontWeight: 700,
                padding: theme.spacing(1, 2),
                transition: "all 0.2s ease",

                "&:focus-visible": {
                    outline: `2px solid ${theme.palette.primary.main}`,
                    outlineOffset: 2,
                }
            }),

            contained: () => ({
                boxShadow: "none",

                "&:hover": {
                    boxShadow: "none",
                },
            }),

            containedPrimary: ({ theme }) => ({
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,

                "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                },

                "&:active": {
                    backgroundColor: theme.palette.primary.dark,
                },
            }),

            outlined: ({ theme }) => ({
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary,

                "&:hover": {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.action.hover,
                },
            }),

            text: ({ theme }) => ({
                color: theme.palette.primary.main,

                "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                },
            }),
        },
    },
};
