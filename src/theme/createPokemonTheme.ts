import { createTheme, responsiveFontSizes, type ThemeOptions } from "@mui/material/styles";

import { palette } from "@theme/palette";
import { typography } from "@theme/typography";
import { shape } from "@theme/shape";
import { components } from "@theme/componentOverrides";

const themeOptions: ThemeOptions = {
  palette,
  typography,
  shape,
  spacing: 8,
  components,
};

let theme = createTheme(themeOptions);

// responsive typography
theme = responsiveFontSizes(theme);

export const pokemonTheme = theme;
