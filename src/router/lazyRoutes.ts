import { lazy } from "react";

export const Home = lazy(() => import("@/pages/home/Home"));
export const Details = lazy(() => import("@/pages/details/Details"));
export const NotFound = lazy(() => import("@/pages/notFound/NotFound"));
export const Favorites = lazy(() => import("@/pages/favorites/Favorites"));
