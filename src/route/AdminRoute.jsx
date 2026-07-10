/*
    created by Nattawut.c
    16/04/2026
*/

import React from "react";
import { Navigate } from "react-router-dom";
import { getStoredUser } from "../api/Api";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = getStoredUser();
  const role = user?.role;

  if (!token) return <Navigate to="/login" />;
  if (role !== "admin") return <Navigate to="/unauthorized" />;

  return children;
};

export default AdminRoute;
