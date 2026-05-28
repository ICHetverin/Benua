import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGuard } from './RoleGuard';
import { AdminLayout } from 'app/layouts/AdminLayout';
import { LoginPage } from 'pages/login/LoginPage';
import { DashboardPage } from 'pages/dashboard/DashboardPage';
import { PersonsListPage } from 'pages/persons/PersonsListPage';
import { PersonEditPage } from 'pages/persons/PersonEditPage';
import { BuildingsListPage } from 'pages/buildings/BuildingsListPage';
import { BuildingEditPage } from 'pages/buildings/BuildingEditPage';
import { ExcursionsListPage } from 'pages/excursions/ExcursionsListPage';
import { ExcursionEditPage } from 'pages/excursions/ExcursionEditPage';
import { BurialsListPage } from 'pages/burials/BurialsListPage';
import { BurialEditPage } from 'pages/burials/BurialEditPage';
import { CemeteriesListPage } from 'pages/cemeteries-admin/CemeteriesListPage';
import { CemeteryEditPage } from 'pages/cemeteries-admin/CemeteryEditPage';
import { UsersListPage } from 'pages/users/UsersListPage';
import { InfographicsListPage } from 'pages/infographics/InfographicsListPage';
import { InfographicEditPage } from 'pages/infographics/InfographicEditPage';

const router = createBrowserRouter(
  [
    { path: '/login', element: <LoginPage /> },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <DashboardPage /> },
        {
          path: 'persons',
          element: (
            <RoleGuard roles={['ADMIN']}>
              <PersonsListPage />
            </RoleGuard>
          ),
        },
        {
          path: 'persons/new',
          element: (
            <RoleGuard roles={['ADMIN']}>
              <PersonEditPage mode="create" />
            </RoleGuard>
          ),
        },
        {
          path: 'persons/:id',
          element: (
            <RoleGuard roles={['ADMIN']}>
              <PersonEditPage mode="edit" />
            </RoleGuard>
          ),
        },
        {
          path: 'buildings',
          element: (
            <RoleGuard roles={['ADMIN']}>
              <BuildingsListPage />
            </RoleGuard>
          ),
        },
        {
          path: 'buildings/new',
          element: (
            <RoleGuard roles={['ADMIN']}>
              <BuildingEditPage mode="create" />
            </RoleGuard>
          ),
        },
        {
          path: 'buildings/:id',
          element: (
            <RoleGuard roles={['ADMIN']}>
              <BuildingEditPage mode="edit" />
            </RoleGuard>
          ),
        },
        {
          path: 'excursions',
          element: (
            <RoleGuard roles={['ADMIN']}>
              <ExcursionsListPage />
            </RoleGuard>
          ),
        },
        {
          path: 'excursions/new',
          element: (
            <RoleGuard roles={['ADMIN']}>
              <ExcursionEditPage mode="create" />
            </RoleGuard>
          ),
        },
        {
          path: 'excursions/:id',
          element: (
            <RoleGuard roles={['ADMIN']}>
              <ExcursionEditPage mode="edit" />
            </RoleGuard>
          ),
        },
        {
          path: 'cemeteries-admin',
          element: (
            <RoleGuard roles={['ADMIN']}>
              <CemeteriesListPage />
            </RoleGuard>
          ),
        },
        {
          path: 'cemeteries-admin/new',
          element: (
            <RoleGuard roles={['ADMIN']}>
              <CemeteryEditPage mode="create" />
            </RoleGuard>
          ),
        },
        {
          path: 'cemeteries-admin/:id',
          element: (
            <RoleGuard roles={['ADMIN']}>
              <CemeteryEditPage mode="edit" />
            </RoleGuard>
          ),
        },
        {
          path: 'burials',
          element: (
            <RoleGuard roles={['ADMIN']}>
              <BurialsListPage />
            </RoleGuard>
          ),
        },
        {
          path: 'burials/new',
          element: (
            <RoleGuard roles={['ADMIN']}>
              <BurialEditPage mode="create" />
            </RoleGuard>
          ),
        },
        {
          path: 'burials/:id',
          element: (
            <RoleGuard roles={['ADMIN']}>
              <BurialEditPage mode="edit" />
            </RoleGuard>
          ),
        },
        {
          path: 'users',
          element: (
            <RoleGuard roles={['ADMIN']}>
              <UsersListPage />
            </RoleGuard>
          ),
        },
        {
          path: 'infographics',
          element: (
            <RoleGuard roles={['ADMIN']}>
              <InfographicsListPage />
            </RoleGuard>
          ),
        },
        {
          path: 'infographics/new',
          element: (
            <RoleGuard roles={['ADMIN']}>
              <InfographicEditPage mode="create" />
            </RoleGuard>
          ),
        },
        {
          path: 'infographics/:id',
          element: (
            <RoleGuard roles={['ADMIN']}>
              <InfographicEditPage mode="edit" />
            </RoleGuard>
          ),
        },
        { path: '*', element: <Navigate to="/" replace /> },
      ],
    },
  ],
  { basename: '/admin' },
);

export function AdminRouter() {
  return <RouterProvider router={router} />;
}
