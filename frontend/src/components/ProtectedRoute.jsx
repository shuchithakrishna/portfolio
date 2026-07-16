import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * A route guard component that blocks navigation if the admin is not authenticated.
 * It checks the local storage for an access token.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');

  if (!token) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
