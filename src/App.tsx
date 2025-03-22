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
    </Router>
  );
}

export default App;
