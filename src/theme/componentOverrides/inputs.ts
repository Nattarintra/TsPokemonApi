import type { Components, Theme } from "@mui/material/styles";

export const inputOverrides: Components<Theme> = {
  MuiTextField: {
    defaultProps: {
      variant: "outlined",
      size: "medium",
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.radius.small,
        backgroundColor: theme.palette.background.paper,
        transition: "all 0.2s ease",

        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
        },

        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },

        "&.Mui-focused": {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },

        "&.Mui-error .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.error.main,
        },

        "&.Mui-disabled": {
          backgroundColor: theme.palette.action.disabledBackground,
        },
      }),

      input: ({ theme }) => ({
        padding: theme.spacing(1.5, 1.75),
      }),

      notchedOutline: ({ theme }) => ({
        borderColor: theme.palette.divider,
      }),
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.text.secondary,

        "&.Mui-focused": {
          color: theme.palette.primary.main,
        },

        "&.Mui-error": {
          color: theme.palette.error.main,
        },
      }),
    },
  },

  MuiFormHelperText: {
    styleOverrides: {
      root: ({ theme }) => ({
        marginLeft: 0,
        fontSize: theme.typography.caption.fontSize,
        color: theme.palette.text.secondary,

        "&.Mui-error": {
          color: theme.palette.error.main,
        },
      }),
    },
  },
};
