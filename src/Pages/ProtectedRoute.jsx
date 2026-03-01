import React from "react";
import { Navigate } from "react-router-dom";
import toast from 'react-hot-toast';
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Make sure this matches where you store your token

  if (!token) {
    // Redirect to login page if not logged in
    toast.error("Please login first 🔐");
    return <Navigate to="/" replace />;
  }

  return children; // Render the protected component
};

export default ProtectedRoute;