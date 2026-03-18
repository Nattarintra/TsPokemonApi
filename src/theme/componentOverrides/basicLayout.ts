import { colors } from "@theme/tokens/colors";
import { radii } from "@theme/tokens/radii";

export const basicLayoutOverrides = {
    MuiCssBaseline: {
        styleOverrides: {
            html: {
                WebkitFontSmoothing: "antialiased",
                MozOsxFontSmoothing: "grayscale",
            },
            body: {
                margin: 0,
                backgroundColor: colors.background,
                color: colors.textPrimary,
            },
            "*": {
                boxSizing: "border-box",
            },
            img: {
                display: "block",
                maxWidth: "100%",
            },
        },
    },

    MuiPaper: {
        defaultProps: {
            elevation: 0,
        },
        styleOverrides: {
            root: {
                backgroundImage: "none",
                borderRadius: radii.md,
            },
        },
    },

    MuiContainer: {
        styleOverrides: {
            root: {
                paddingLeft: 16,
                paddingRight: 16,
                "@media (min-width:900px)": {
                    paddingLeft: 24,
                    paddingRight: 24,
                },
            },
        },
    },
};