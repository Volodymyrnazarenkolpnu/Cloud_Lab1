import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth?.user);
  
  // Check both Redux state and localStorage
  const isAuthenticated = user || localStorage.getItem("redux_user");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
