import {
  createBrowserRouter,
  RouterProvider as RRDRouterProvider,
} from "react-router-dom";
import { MainLayout } from "app/layouts";
import { Home } from "pages/home";
import { Map } from "pages/map";
import { Objects } from "pages/objects";
import { Persons } from "pages/persons";
import { Excursions } from "pages/excursions";
import { ExcursionDetails } from "pages/excursion-details";
import { About } from "pages/about";
import { Catalog } from "pages/catalog";
import { Game } from "pages/game";
import { PersonDetail } from "pages/person-detail";
import { ObjectDetail } from "pages/object-detail";
import { SearchPage } from "pages/search";
import { NotFound } from "pages/not-found";
import { Cemeteries } from "pages/cemeteries";
import { Infographics } from "pages/infographics";
import { InfographicDetail } from "pages/infographic-detail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "map", element: <Map /> },
      { path: "catalog", element: <Catalog /> },
      { path: "objects", element: <Objects /> },
      { path: "objects/:id", element: <ObjectDetail /> },
      { path: "persons", element: <Persons /> },
      { path: "persons/:id", element: <PersonDetail /> },
      { path: "search", element: <SearchPage /> },
      { path: "excursions", element: <Excursions /> },
      { path: "excursions/:id", element: <ExcursionDetails /> },
      { path: "about", element: <About /> },
      { path: "game", element: <Game /> },
      { path: "cemeteries", element: <Cemeteries /> },
      { path: "infographics", element: <Infographics /> },
      { path: "infographics/:id", element: <InfographicDetail /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export const RouterProvider = () => {
  return <RRDRouterProvider router={router} />;
};
