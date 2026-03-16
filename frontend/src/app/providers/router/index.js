import { createBrowserRouter, RouterProvider as RRDRouterProvider } from 'react-router-dom';
import { Home } from 'pages/home';
import { Map } from 'pages/map';
import { Objects } from 'pages/objects';
import { Persons } from 'pages/persons';
import { Excursions } from 'pages/excursions';
import { About } from 'pages/about';
import { NotFound } from 'pages/not-found';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/map',
    element: <Map />,
  },
  {
    path: '/objects',
    element: <Objects />,
  },
  {
    path: '/persons',
    element: <Persons />,
  },
  {
    path: '/excursions',
    element: <Excursions />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export const RouterProvider = () => {
  return <RRDRouterProvider router={router} />;
};