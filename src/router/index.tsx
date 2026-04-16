import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Suspense } from "react";
import App from "@/App";
import PokemonGridSkeleton from "@/components/Skeletons/PokemonGridSkeleton";
import DetailsSkeleton from "@/components/Skeletons/DetailsSkeleton";
import { Details, Home, NotFound } from "./lazyRoutes";

export const index = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route
        index
        element={
          <Suspense fallback={<PokemonGridSkeleton />}>
            <Home />
          </Suspense>
        }
      />
      <Route
        path="/details/:id"
        element={
          <Suspense fallback={<DetailsSkeleton />}>
            <Details />
          </Suspense>
        }
      />
      <Route
        path="*"
        element={
          <Suspense fallback={null}>
            <NotFound />
          </Suspense>
        }
      />
    </Route>,
  ),
);
