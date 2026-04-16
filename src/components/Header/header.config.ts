const HEADER_LABELS = {
  HOME_TITLE: "Home",
  DETAILS_TITLE: "Details",
  //FAVORITES_TITLE: "Favorites",
} as const;

export interface HeaderNavLink {
  label: string;
  path: string;
}

const baseNavLinks: HeaderNavLink[] = [
  { label: HEADER_LABELS.HOME_TITLE, path: "/" },
  // { label: HEADER_LABELS.FAVORITES_TITLE, path: "/favorites" },
] as const;

interface GetNavLinksParams {
  isDetailsPage: boolean;
  detailsPath?: string;
}

export const getNavLinks = ({ isDetailsPage, detailsPath }: GetNavLinksParams): HeaderNavLink[] => [
  ...baseNavLinks,
  ...(isDetailsPage && detailsPath
    ? [{ label: HEADER_LABELS.DETAILS_TITLE, path: detailsPath }]
    : []),
];
