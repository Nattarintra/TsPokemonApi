import type { Components, Theme } from "@mui/material/styles";

export const appBarOverrides: Components<Theme> = {
  MuiAppBar: {
    defaultProps: {
      elevation: 0, // remove shadow
      position: "static",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        boxShadow: "none",
        borderBottom: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.radius.none,
      }),
    },
  },
};
