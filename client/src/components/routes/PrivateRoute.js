import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children, roleRequired }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("role");

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  if (roleRequired && userRole !== roleRequired) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;
