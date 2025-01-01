import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { Toaster } from 'react-hot-toast';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Pages from './pages/pages';
import Users from './pages/users';

import Profile from './pages/Profile';

import DefaultLayout from './layout/DefaultLayout';
import ProtectedRoute from './ProtectedRoute';
import PageBuilder from './pages/PageBuilder';
import SubscriptionPage from './pages/Subscription';

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
          {/* Authentication Routes */}
          <Route
            path="/signin"
            element={
              <ProtectedRoute authPage={true}>
                <PageTitle title="Signin | pagecraft pro" />
                <SignIn />
              </ProtectedRoute>
            }
          />
           <Route
            path="/admin"
            element={
              <ProtectedRoute authPage={true}>
                <PageTitle title="admin signIn | pagecraft pro" />
                <SignIn isAdmin={true} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <ProtectedRoute authPage={true}>
                <PageTitle title="Signup | pagecraft pro" />
                <SignUp />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DefaultLayout>
                  <Routes>
                    <Route
                      path="/pages/:userId"
                      element={
                          <>
                            <PageTitle title="Pages" />
                            <Pages />
                          </>
                      }
                    />
                    <Route
                      path="/users"
                      element={
                        <>
                          <PageTitle title="users" />
                          <Users />
                        </>
                      }
                    />
                   
                    <Route
                      path="/profile"
                      element={
                        <>
                          <PageTitle title="Profile | pagecraft pro" />
                          <Profile />
                        </>
                      }
                    />
                   
                   
                    <Route
                      path="/page-builder/:userId/:id"
                      element={
                        <ProtectedRoute>
                          <PageTitle title="Page Builder | PageCraft Pro" />
                          <PageBuilder />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/subscription"
                      element={
                        <ProtectedRoute>
                          <PageTitle title="Subscription | PageCraft Pro" />
                          <SubscriptionPage />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </DefaultLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
      <Toaster />
    </AuthProvider>
  );
};

export default App;
