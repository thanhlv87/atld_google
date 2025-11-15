import React, { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const RequestsPage = lazy(() => import('./pages/RequestsPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const TrainingLandingPage = lazy(() => import('./pages/TrainingLandingPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'requests',
        element: <RequestsPage />
      },
      {
        path: 'blog',
        element: <BlogPage />
      },
      {
        path: 'blog/:postId',
        element: <BlogDetailPage />
      },
      {
        path: 'documents',
        element: <DocumentsPage />
      },
      {
        path: 'chat',
        element: <ChatPage />
      },
      {
        path: 'admin',
        element: <AdminPage />
      },
      // Training landing pages - using dynamic route with param
      {
        path: 'training/:type',
        element: <TrainingLandingPage />
      },
      // Catch-all redirect to home
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  }
]);
