import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useNavigate, Link } from "react-router-dom";
import { setUser } from "../slices/authSlice";
import { signOut } from "../services/authService";

const LogOutIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="#e3e3e3"
  >
    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
  </svg>
);

const AddPostIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="#e3e3e3"
  >
    <path d="M160-400v-80h280v80H160Zm0-160v-80h440v80H160Zm0-160v-80h440v80H160Zm360 560v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z" />
  </svg>
);

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

  const displayName = user?.user_metadata.display_name;

  const confirmAndLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      handleLogout();
    }
  };

  return (
    <nav className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <Link to="/blogs" className="btn btn-ghost text-xl">
          Blogs
        </Link>
        <p className="text-md text-primary-content/50">
          {logoutMessage ?? `Welcome, ${displayName ?? "Guest"}`}
        </p>
      </div>
      <div className="navbar-end">
        {user && (
          <>
            <Link to="/blogs/create" className="btn btn-ghost btn-circle">
              <AddPostIcon />
            </Link>
            <button
              onClick={confirmAndLogout}
              className="btn btn-ghost btn-circle"
            >
              <LogOutIcon />
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
