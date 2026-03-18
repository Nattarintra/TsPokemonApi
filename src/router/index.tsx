import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "@/App";
import Home from "@pages/Home";
import Details from "@pages/Details";


export const index = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path='/details' element={<Details />} />
        </Route>
    )
);