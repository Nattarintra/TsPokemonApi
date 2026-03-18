import { colors } from "@theme/tokens/colors";
import { radii } from "@theme/tokens/radii";

export const inputOverrides = {
    MuiTextField: {
        defaultProps: {
            variant: "outlined" as const,
            size: "medium" as const,
        },
    },

    MuiOutlinedInput: {
        styleOverrides: {
            root: {
                borderRadius: radii.sm,
                backgroundColor: colors.surface,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.primary,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.primary,
                    borderWidth: 2,
                },
            },
            input: {
                padding: "12px 14px",
            },
            notchedOutline: {
                borderColor: colors.border,
            },
        },
    },
};