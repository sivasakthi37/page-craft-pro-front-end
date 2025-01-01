import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { Toaster } from 'react-hot-toast';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Pages from './pages/pages';
import Users from './pages/users';
import ECommerce from './pages/Dashboard/ECommerce';
import Profile from './pages/Profile';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Tables from './pages/Tables';
import Settings from './pages/Settings';
import Chart from './pages/Chart';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
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
                <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <SignIn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <ProtectedRoute authPage={true}>
                <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
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
                    {/* <Route
                      index
                      element={
                        <>
                          <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                          <ECommerce />
                        </>
                      }
                    /> */}
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
                          <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
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
