import {
  createBrowserRouter,
  RouterProvider as RRDRouterProvider,
} from "react-router-dom";
import { MainLayout } from "app/layouts";
import { Home } from "pages/home";
import { Map } from "pages/map";
import { Objects } from "pages/objects";
import { ObjectDetails } from "pages/objects-details";
import { Persons } from "pages/persons";
import { PersonDetails } from "pages/persons-details";
import { Excursions } from "pages/excursions";
import { ExcursionDetails } from "pages/excursion-details";
import { About } from "pages/about";
import { NotFound } from "pages/not-found";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "map", element: <Map /> },
      { path: "objects", element: <Objects /> },
      { path: "objects/:id", element: <ObjectDetails /> },
      { path: "persons", element: <Persons /> },
      { path: "persons/:id", element: <PersonDetails /> },
      { path: "excursions", element: <Excursions /> },
      { path: "excursions/:id", element: <ExcursionDetails /> },
      { path: "about", element: <About /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export const RouterProvider = () => {
  return <RRDRouterProvider router={router} />;
};
