import { appBarOverrides } from "./appBar";
import { baseStylesOverrides } from "./baseStyles";
import { buttonOverrides } from "./buttons";
import { cardOverrides } from "./cards";
import { chipOverrides } from "./chips";
import { feedbackOverrides } from "./feedback";
import { inputOverrides } from "./inputs";
import { paginationOverrides } from "./pagination";
import { linkOverrides } from "./links";
import { skeletonOverrides } from "./skeletons";

export const components = {
  ...baseStylesOverrides,
  ...cardOverrides,
  ...buttonOverrides,
  ...chipOverrides,
  ...inputOverrides,
  ...paginationOverrides,
  ...feedbackOverrides,
  ...appBarOverrides,
  ...linkOverrides,
  ...skeletonOverrides,
};
