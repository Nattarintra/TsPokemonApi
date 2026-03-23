import { radii } from "@theme/tokens/radii";
import type { Components, Theme } from "@mui/material/styles";

export const chipOverrides: Components<Theme> = {
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: radii.full,
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