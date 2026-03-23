import type { Components, Theme } from "@mui/material/styles";

export const paginationOverrides: Components<Theme> = {
    MuiPagination: {
        styleOverrides: {
            root: ({ theme }) => ({
                display: "flex",
                justifyContent: "center",
                padding: theme.spacing(2, 0),
            }),
        },
    },

    MuiPaginationItem: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: theme.shape.radius.small,
                fontWeight: 700,
                minWidth: 36,
                height: 36,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                transition: "all 0.2s ease",

                "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                },

                "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    borderColor: theme.palette.primary.main,

                    "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                    },
                },

                "&.Mui-disabled": {
                    color: theme.palette.text.disabled,
                    borderColor: theme.palette.action.disabledBackground,
                },

                "&.Mui-focusVisible": {
                    outline: `2px solid ${theme.palette.primary.main}`,
                    outlineOffset: 2,
                },
            }),
        },
    },
};