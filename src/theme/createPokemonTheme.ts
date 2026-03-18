import { createTheme } from "@mui/material/styles";
import { palette } from "@theme/palette";
import { typography } from "@theme/typography";
import { shape } from "@theme/shape";

import { cardOverrides } from "@theme/componentOverrides/cards";
import { buttonOverrides } from "@theme/componentOverrides/buttons";
import { chipOverrides } from "@theme/componentOverrides/chips";
import { inputOverrides } from "@theme/componentOverrides/inputs";
import { paginationOverrides } from "@theme/componentOverrides/pagination";
import { basicLayoutOverrides } from "@theme/componentOverrides/basicLayout"
import { feedbackOverrides } from "@theme/componentOverrides/feedback";

// This is the only file that calls createTheme().
export const pokemonTheme = createTheme({
    palette,
    typography,
    shape,
    spacing: 8,
    components: {
        ...basicLayoutOverrides,
        ...cardOverrides,
        ...buttonOverrides,
        ...chipOverrides,
        ...inputOverrides,
        ...paginationOverrides,
        ...feedbackOverrides,
    },
});