import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="header">
      <h2 className="logo">🎯 Habit Tracker</h2>
      <nav>
        {user ? (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/statistics">Statistics</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
