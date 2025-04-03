import { Toaster } from "sonner";
import "./App.css";

import AuthPage from "./components/auth/AuthPage";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/shared/Layout";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import PostForm from "./components/post/PostForm";
import PostDetail from "./components/post/PostDetail";
import ProfilePage from "./pages/ProfilePage";

import { Analytics } from "@vercel/analytics/react";

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Toaster position="top-right" />

      <Routes>
        {/* Auth Page */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <HomePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <PostDetail />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/post/new"
          element={
            <ProtectedRoute>
              <Layout>
                <PostForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/post/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <PostForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:username"
          element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 404 page */}
        <Route
          path="*"
          element={
            <Layout>
              <NotFoundPage />
            </Layout>
          }
        />
      </Routes>
      <Analytics />
    </Router>
  );
}

export default App;
