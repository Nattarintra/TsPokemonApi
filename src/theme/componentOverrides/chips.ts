import { radii } from "@theme/tokens/radii";

export const chipOverrides = {
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: radii.pill,
                fontWeight: 700,
                fontSize: "0.75rem",
                height: 24,
            },
            label: {
                paddingLeft: 10,
                paddingRight: 10,
            },
        },
    },
};