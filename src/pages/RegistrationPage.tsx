import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setUser, setLoading, setError } from "../slices/authSlice";
import { signUp } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

const RegistrationPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  // Local States
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  // Enable register button only when all fields are filled and passwords match
  useEffect(() => {
    if (!email || !password || !confirmPassword || !displayName) {
      setIsButtonDisabled(true);
      setLocalError(null);
    } else if (password !== confirmPassword) {
      setIsButtonDisabled(true);
      setLocalError("Passwords do not match.");
    } else {
      setIsButtonDisabled(false);
      setLocalError(null);
    }
  }, [email, password, confirmPassword, displayName]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Extra check before submission
    if (password !== confirmPassword) return;

    dispatch(setLoading(true));
    dispatch(setError(null));
    setSuccess(null);
    try {
      const { user } = await signUp(email, password, displayName);
      setSuccess("Registration successful! Redirecting...");
      // delay navigation slightly to show the success message
      setTimeout(() => {
        dispatch(setUser(user));
        navigate("/blogs");
      }, 1500);
    } catch (err: unknown) {
      let message = "Registration failed. Please try again.";
      if (err instanceof Error) {
        message = err.message;
      }
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="md:w-3xl">
      <form onSubmit={handleSubmit} className="card">
        <h1 className="text-center text-2xl text-primary-content">Register</h1>
        <div className="card-body">
          <label htmlFor="displayName" className="label">
            Display Name:
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            autoComplete="off"
            className="input w-full"
          />

          <label htmlFor="email" className="label">
            Email:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
            className="input w-full"
          />

          <label htmlFor="password" className="label">
            Password:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
            className="input w-full"
          />

          <label htmlFor="confirm" className="label">
            Confirm Password:
          </label>
          <input
            id="confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="off"
            className="input w-full"
          />

          {localError && <p className="text-error">{localError}</p>}
          {error && <p className="text-error">{error}</p>}
          {success && <p className="text-success">{success}</p>}

          <button
            type="submit"
            disabled={isLoading || isButtonDisabled}
            className="btn btn-primary"
          >
            {isLoading ? "Creating..." : "Create Account"}
          </button>
          <span className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="link link-secondary">
              Log-in
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default RegistrationPage;
