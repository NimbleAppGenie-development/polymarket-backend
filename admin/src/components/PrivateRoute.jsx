import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('UserToken');
  const expiry = localStorage.getItem('UserTokenExpiry');

  if (token && expiry && Date.now() < parseInt(expiry)) {
  } else {
    localStorage.removeItem('UserToken');
    localStorage.removeItem('UserTokenExpiry');
    console.log('Token expired or not found');
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
