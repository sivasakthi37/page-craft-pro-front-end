import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
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
              <>
                <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <SignIn />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <SignUp />
              </>
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
                      path="/pages"
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
                      path="/calendar"
                      element={
                        <>
                          <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                          <Calendar />
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
                      path="/forms/form-elements"
                      element={
                        <>
                          <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                          <FormElements />
                        </>
                      }
                    />
                    <Route
                      path="/forms/form-layout"
                      element={
                        <>
                          <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                          <FormLayout />
                        </>
                      }
                    />
                    <Route
                      path="/tables"
                      element={
                        <>
                          <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                          <Tables />
                        </>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <>
                          <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                          <Settings />
                        </>
                      }
                    />
                    <Route
                      path="/chart"
                      element={
                        <>
                          <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                          <Chart />
                        </>
                      }
                    />
                    <Route
                      path="/ui/alerts"
                      element={
                        <>
                          <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                          <Alerts />
                        </>
                      }
                    />
                    <Route
                      path="/ui/buttons"
                      element={
                        <>
                          <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                          <Buttons />
                        </>
                      }
                    />
                    <Route
                      path="/page-builder/:id"
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
