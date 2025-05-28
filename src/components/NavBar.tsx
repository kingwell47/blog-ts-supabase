import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useNavigate, Link } from "react-router-dom";
import { setUser } from "../slices/authSlice";
import { signOut } from "../services/authService";

const NavBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await signOut();
      setLogoutMessage("Logged out successfully! Redirecting...");
      setTimeout(() => {
        dispatch(setUser(null));
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (!user && !logoutMessage) return null;

  return (
    <nav>
      {logoutMessage && <p>{logoutMessage}</p>}
      {!logoutMessage && (
        <>
          <Link to="/blogs">Home</Link>
          <button onClick={handleLogout} className="btn btn-primary">
            Logout
          </button>
        </>
      )}
    </nav>
  );
};

export default NavBar;
