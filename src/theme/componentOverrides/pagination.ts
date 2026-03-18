import { colors } from "@theme/tokens/colors";

export const paginationOverrides = {
    MuiPagination: {
        styleOverrides: {
            root: {
                display: "flex",
                justifyContent: "center",
            },
        },
    },

    MuiPaginationItem: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                fontWeight: 700,
                minWidth: 36,
                height: 36,
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.surface,
                "&.Mui-selected": {
                    backgroundColor: colors.primary,
                    color: "#FFFFFF",
                    borderColor: colors.primary,
                },
            },
        },
    },
};