/*
    created by Nattawut.c
    16/04/2026
*/

import React from "react";
import { Navigate } from "react-router-dom";

const ProviderRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const role = user?.role;

  if (!token) return <Navigate to="/login" />;
  if (role !== "provider") return <Navigate to="/unauthorized" />;

  return children;
};

export default ProviderRoute;
