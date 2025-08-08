import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminNavbar.css";

function AdminNavbar({ setSidebarOpen }) {
  const [isSidebarOpen, setIsSidebarLocal] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarLocal(newState);
    if (typeof setSidebarOpen === "function") {
      setSidebarOpen(newState);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleNav = (path) => {
    navigate(path);
  };

  useEffect(() => {
    if (typeof setSidebarOpen === "function") {
      setSidebarOpen(isSidebarOpen); 
    }
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="header">
        <button onClick={toggleSidebar} className="hamburger">&#x2261;</button>
        <h1 className="header-title">Admin Dashboard</h1>
        <p className="name ">LIBRARY SYSTEM MANAGEMENT</p>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      {isSidebarOpen && (
        <nav className="sidebar">
          <ul>
            <li
              className={isActive("/admin") ? "active-nav" : ""}
              onClick={() => handleNav("/admin")}
            >
              Home
            </li>
            <li
              className={isActive("/admin/users") ? "active-nav" : ""}
              onClick={() => handleNav("/admin/users")}
            >
              Users List
            </li>
            <li
              className={isActive("/admin/returned") ? "active-nav" : ""}
              onClick={() => handleNav("/admin/returned")}
            >
              Returned Books
            </li>
            <li
              className={isActive("/admin/history") ? "active-nav" : ""}
              onClick={() => handleNav("/admin/history")}
            >
              Borrow History
            </li>
            <li
              className={isActive("/admin/overdue") ? "active-nav" : ""}
              onClick={() => handleNav("/admin/overdue")}
            >
              Overdue
            </li>
            <li
              className={isActive("/admin/requests") ? "active-nav" : ""}
              onClick={() => handleNav("/admin/requests")}
            >
              Borrow Requests
            </li>
            <li
              className={isActive("/admin/profile") ? "active-nav" : ""}
              onClick={() => handleNav("/admin/profile")}
            >
              Profile
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}

export default AdminNavbar;
