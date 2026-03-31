import { lighten, darken } from "@mui/material/styles";
import { colors } from "./tokens";

export const palette = {
  mode: "light" as const,
  primary: {
    main: colors.brandPrimary,
    light: lighten(colors.brandPrimary, 0.2),
    dark: darken(colors.brandPrimary, 0.2),
    contrastText: colors.surface,
  },
  secondary: {
    main: colors.brandSecondary,
    light: lighten(colors.brandSecondary, 0.2),
    dark: darken(colors.brandSecondary, 0.2),
    contrastText: colors.surface,
  },
  background: {
    default: colors.appBackground,
    paper: colors.surface,
  },
  text: {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    disabled: colors.textMuted,
  },
  divider: colors.divider,

  success: { main: colors.success },
  warning: { main: colors.warning },
  error: { main: colors.error },
  info: { main: colors.info },
};
