import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./store/store";
import { onAuthStateChange } from "./services/authService";
import { setUser } from "./slices/authSlice";

// Pages import
import RegistrationPage from "./pages/RegistrationPage";
import BlogListPage from "./pages/BlogListPage";
import LoginPage from "./pages/LoginPage";
import CreateBlogPage from "./pages/CreateBlogPage";
import BlogViewPage from "./pages/BlogViewPage";
import UpdateBlogPage from "./pages/UpdateBlogPage";

import NavBar from "./components/NavBar";

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
      <div className="p-5 md:flex md:flex-col md:items-center md:justify-center">
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
                <Outlet />
              </PrivateRoute>
            }
          >
            <Route index element={<BlogListPage />} />
            <Route path="create" element={<CreateBlogPage />} />
            <Route path=":id" element={<BlogViewPage />} />
            <Route path=":id/edit" element={<UpdateBlogPage />} />
          </Route>

          {/* Redirect any unknown route to blogs */}
          <Route path="*" element={<Navigate to="/blogs" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
