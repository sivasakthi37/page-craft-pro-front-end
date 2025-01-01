import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  authPage?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, authPage = false }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // If it's an auth page (signin/signup) and user is authenticated, redirect to their pages
  if (authPage && isAuthenticated) {
    return <Navigate to={`/pages/${user?.id}`} state={{ from: location }} replace />;
  }

  // For protected routes, redirect to signin if not authenticated
  if (!authPage && !isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
