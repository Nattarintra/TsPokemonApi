import type { Components, Theme } from "@mui/material/styles";

export const linkOverrides: Components<Theme> = {
    MuiLink: {
        styleOverrides: {
            root: ({ theme }) => ({
                textDecoration: "none",
                color: theme.palette.text.primary,
                ...theme.typography.body2,

                transition: theme.transitions.create(
                    ["color", "transform"],
                    {
                        duration: theme.transitions.duration.short,
                    }
                ),

                "&:hover": {
                    color: theme.palette.primary.main,
                    transform: "scale(1.05)",
                },
            }),
        },
    },
};