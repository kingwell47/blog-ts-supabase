import React, { useState } from "react";
import type { FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setUser, setLoading, setError } from "../slices/authSlice";
import { signIn } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  // Local States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const { user } = await signIn(email, password);
      dispatch(setUser(user));
      navigate("/blogs");
    } catch (err: unknown) {
      let message = "Login failed. Please try again.";
      if (err instanceof Error) {
        message = err.message;
      }
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
            className="input input-primary"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
            className="input input-primary"
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <Link to="/register" className="link link-secondary">
        Create an account here
      </Link>
    </div>
  );
};

export default LoginPage;
