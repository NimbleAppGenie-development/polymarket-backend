import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import Layout from './layouts/dashboard';
import LoginPage from './pages/LoginPage';

import PrivateRoute from './components/PrivateRoute';
import LogoutPage from './pages/Logout';
import Dashboard from './pages/Dashboard';

import { Navigate } from 'react-router-dom';
import MarketList from './pages/MarketList';

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/login',
        Component: LoginPage,
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: '/',
            Component: Layout,
            children: [
              {
                index: true,
                element: <Navigate to="dashboard" replace />,
              },
              { path: 'dashboard', Component: Dashboard },
              { path: 'logout', Component: LogoutPage },
              { path: 'market', Component: MarketList },
              { path: "*", element: <Navigate to="/dashboard" replace /> },
            ],
          }
        ],
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
