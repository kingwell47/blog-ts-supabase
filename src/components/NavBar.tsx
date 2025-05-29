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
      setLogoutMessage("Logged out successfully!");
      setTimeout(() => {
        dispatch(setUser(null));
        setLogoutMessage(null);
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (!user && !logoutMessage) return null;

  const displayName = user?.user_metadata.display_name;

  return (
    <nav>
      {logoutMessage && <p>{logoutMessage}</p>}
      {!logoutMessage && (
        <>
          <Link to="/blogs" className="btn btn-primary">
            Home
          </Link>
          <p>{displayName ?? "Guest"}</p>
          <Link to="/blogs/create" className="btn btn-primary">
            New Blog
          </Link>
          <button onClick={handleLogout} className="btn btn-primary">
            Logout
          </button>
        </>
      )}
    </nav>
  );
};

export default NavBar;
