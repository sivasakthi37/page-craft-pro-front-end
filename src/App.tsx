import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { Toaster } from 'react-hot-toast';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import DefaultLayout from './layout/DefaultLayout';
import ProtectedRoute from './ProtectedRoute';

// Import route configurations
import { PAGE_ROUTES } from './routes';

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <AuthProvider>
      {loading ? (
        <Loader />
      ) : (
        <Routes>
          {PAGE_ROUTES.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.isProtected ? (
                  <ProtectedRoute>
                    <DefaultLayout>
                      <PageTitle title={route.title} />
                      <route.component />
                    </DefaultLayout>
                  </ProtectedRoute>
                ) : route.isAuthPage ? (
                  <ProtectedRoute authPage={true}>
                    <PageTitle title={route.title} />
                    <route.component 
                      isAdmin={route.isAdmin} 
                    />
                  </ProtectedRoute>
                ) : (
                  <route.component />
                )
              }
            />
          ))}
          
          {/* Catch-all route to redirect to sign-in */}
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      )}
      <Toaster />
    </AuthProvider>
  );
};

export default App;
