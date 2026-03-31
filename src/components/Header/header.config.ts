const HEADER_LABELS = {
  HOME_TITLE: "Home",
  FAVORITES_TITLE: "Favorites",
} as const;

export const navLinks = [
  { label: HEADER_LABELS.HOME_TITLE, path: "/" },
  { label: HEADER_LABELS.FAVORITES_TITLE, path: "/favorites" },
] as const;
