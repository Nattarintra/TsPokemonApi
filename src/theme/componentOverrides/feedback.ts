import type { Components, Theme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

export const feedbackOverrides: Components<Theme> = {
    MuiLinearProgress: {
        styleOverrides: {
            root: ({ theme }) => ({
                height: 10,
                borderRadius: theme.shape.radius.full,
                backgroundColor: alpha(theme.palette.primary.main, 0.15),
                overflow: "hidden",

                "&.MuiLinearProgress-colorSuccess .MuiLinearProgress-bar": {
                    backgroundColor: theme.palette.success.main,
                },
            }),

            bar: ({ theme }) => ({
                borderRadius: theme.shape.radius.full,
                backgroundColor: theme.palette.primary.main,
            }),
        },
    },

    MuiDivider: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderColor: theme.palette.divider,
            }),
        },
    },

    MuiTooltip: {
        styleOverrides: {
            tooltip: ({ theme }) => ({
                borderRadius: theme.shape.radius.small,
                fontSize: theme.typography.caption.fontSize,
                backgroundColor: theme.palette.grey[900],
                color: theme.palette.common.white,
                boxShadow: theme.shadows[3],
            }),

            arrow: ({ theme }) => ({
                color: theme.palette.grey[900],
            }),
        },
    },
};