import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "@/App";
import Home from "@/pages/home/Home";
import Details from "@/pages/details/Details";
import NotFound from "@/pages/notFound/NotFound";

export const index = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="/details/:id" element={<Details />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);
