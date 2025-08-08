import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./UserNavbar.css"; // Adjust the path as necessary

function UserNavbar({ setSidebarOpen }) {
  const [isSidebarOpen, setIsSidebarLocal] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarLocal(newState);
    setSidebarOpen(newState);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleNav = (path) => {
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setSidebarOpen(isSidebarOpen); 
  }, []);

  return (
    <div className="user-navbar">
      <header className="header">
        <button onClick={toggleSidebar} className="hamburger">&#x2261;</button>
        <h1 className="header-title">User Dashboard</h1>
        <p className="name ">LIBRARY SYSTEM MANAGEMENT</p>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      {isSidebarOpen && (
        <nav className="sidebar">
          <ul>
            <li className={isActive("/user/available") ? "active-nav" : ""} onClick={() => handleNav("/user/available")}>Home</li>
            <li className={isActive("/user/return") ? "active-nav" : ""} onClick={() => handleNav("/user/return")}>Return</li>
            <li className={isActive("/user/history") ? "active-nav" : ""} onClick={() => handleNav("/user/history")}>My History</li>
            <li className={isActive("/user/profile") ? "active-nav" : ""} onClick={() => handleNav("/user/profile")}>Profile</li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default UserNavbar;
