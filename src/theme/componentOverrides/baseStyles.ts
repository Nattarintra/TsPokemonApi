import type { Components, Theme } from "@mui/material/styles";

export const baseStylesOverrides: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
      html: {
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        scrollBehavior: "smooth",
      },

      body: {
        margin: 0,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      },

      "::selection": {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      },

      "*": {
        boxSizing: "border-box",
      },

      img: {
        display: "block",
        maxWidth: "100%",
      },
    }),
  },

  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },

    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: "none",
        borderRadius: theme.shape.radius.medium,
      }),
    },
  },

  MuiContainer: {
    styleOverrides: {
      root: ({ theme }) => ({
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),

        [theme.breakpoints.up("md")]: {
          paddingLeft: theme.spacing(3),
          paddingRight: theme.spacing(3),
        },
      }),
    },
  },
};
