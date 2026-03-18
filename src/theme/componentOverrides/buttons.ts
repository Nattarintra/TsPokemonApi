import { colors } from "@theme/tokens/colors";
import { radii } from "@theme/tokens/radii";

export const buttonOverrides = {
    MuiButton: {
        defaultProps: {
            disableElevation: true,
        },
        styleOverrides: {
            root: {
                borderRadius: radii.sm,
                textTransform: "none",
                fontWeight: 700,
            },
            containedPrimary: {
                "&:hover": {
                    backgroundColor: "#2698c6",
                },
            },
            outlined: {
                borderColor: colors.border,
            },
        },
    },
};