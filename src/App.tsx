import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./store/store";
import { onAuthStateChange } from "./services/authService";
import { setUser } from "./slices/authSlice";

// Pages import
import RegistrationPage from "./pages/RegistrationPage";
/* LoginPage */
import BlogListPage from "./pages/BlogListPage";
import NavBar from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
/* CreateBlogPage */
/* UpdateBlogPage */

// PrivateRoute component to guard authenticated routes
const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const user = useAppSelector((state) => state.auth.user);
  return user ? children : <Navigate to="/login" replace />;
};

// Guard for public-only routes (redirect logged-in users)
const PublicRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const user = useAppSelector((state) => state.auth.user);
  return !user ? children : <Navigate to="/blogs" replace />;
};

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  // Keep Redux auth state in sync with Supabase
  useEffect(() => {
    const unsubscribe = onAuthStateChange((_, session) => {
      dispatch(setUser(session?.user ?? null));
    });
    return unsubscribe; // Unload watcher
  }, [dispatch]);

  return (
    <Router>
      <NavBar />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegistrationPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/blogs"
          element={
            <PrivateRoute>
              <BlogListPage />
            </PrivateRoute>
          }
        />
        {/* Redirect any unknown route to blogs */}
        <Route path="*" element={<Navigate to="/blogs" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
