import type { Components, Theme } from "@mui/material/styles";

export const chipOverrides: Components<Theme> = {
    MuiChip: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: theme.shape.radius.full,
                fontWeight: 700,
                fontSize: theme.typography.caption.fontSize,
                height: 24,
            }),

            label: ({ theme }) => ({
                paddingLeft: theme.spacing(1.25),  // 10px
                paddingRight: theme.spacing(1.25),
            }),
        },
    },
};