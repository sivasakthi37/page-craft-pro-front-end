import React from 'react';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Pages from './pages/pages';
import Users from './pages/users';
import Profile from './pages/Profile';
import PageBuilder from './pages/PageBuilder';
import SubscriptionPage from './pages/Subscription';

// Route Configuration Type
export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  title: string;
  isProtected?: boolean;
  isAuthPage?: boolean;
  isAdmin?: boolean;
}

// Page Routes
export const PAGE_ROUTES: RouteConfig[] = [
  {
    path: '/',
    component: SignIn,
    title: 'Sign In | PageCraft Pro',
    isAuthPage: true,
  },
  {
    path: '/signin',
    component: SignIn,
    title: 'Sign In | PageCraft Pro',
    isAuthPage: true,
  },
  {
    path: '/admin',
    component: SignIn,
    title: 'Admin Sign In | PageCraft Pro',
    isAuthPage: true,
    isAdmin: true,
  },
  {
    path: '/signup',
    component: SignUp,
    title: 'Sign Up | PageCraft Pro',
    isAuthPage: true,
  },
  {
    path: '/pages/:userId',
    component: Pages,
    title: 'Pages | PageCraft Pro',
    isProtected: true,
  },
  {
    path: '/users',
    component: Users,
    title: 'Users | PageCraft Pro',
    isProtected: true,
  },
  {
    path: '/profile',
    component: Profile,
    title: 'Profile | PageCraft Pro',
    isProtected: true,
  },
  {
    path: '/page-builder/:userId/:id',
    component: PageBuilder,
    title: 'Page Builder | PageCraft Pro',
    isProtected: true,
  },
  {
    path: '/subscription',
    component: SubscriptionPage,
    title: 'Subscription | PageCraft Pro',
    isProtected: true,
  },
];
