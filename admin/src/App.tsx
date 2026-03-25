import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Outlet } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type { Navigation } from '@toolpad/core/AppProvider';
import LogoutIcon from '@mui/icons-material/Logout';
import { ToastContainer } from 'react-toastify';
import AddToHomeScreenIcon from '@mui/icons-material/AddToHomeScreen';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: '',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'market',
    title: 'Market',
    icon: <AddToHomeScreenIcon />,
  },
  {
    segment: 'logout',
    title: 'Logout',
    icon: <LogoutIcon />,
  },
];

const BRANDING = {
  title: "Men's Grooming",
  homeUrl: '/dashboard'
};


export default function App() {

  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ReactRouterAppProvider>
  );
}