import type { Components, Theme } from "@mui/material/styles";

export const skeletonOverrides: Components<Theme> = {
    MuiSkeleton: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: theme.shape.borderRadius,
            }),

            rectangular: ({ theme }) => ({
                borderRadius: theme.shape.radius.none,
            }),

            rounded: ({ theme }) => ({
                borderRadius: theme.shape.radius.full,
            }),


            text: ({ }) => ({
                transform: "none",
                marginTop: 0,
                marginBottom: 0,
            }),
        },

        defaultProps: {
            animation: "wave",
        },
    },
};