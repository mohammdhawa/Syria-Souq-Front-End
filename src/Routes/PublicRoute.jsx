import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "@/components/Loader";


const PublicRoute = () => {
  const { isAuthenticated, checkingAuth, authChecked } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();

  if (checkingAuth || !authChecked) {
    return <Loader />;
  }
  const isAuthRoute =
    location.pathname === "/auth/login" ||
    location.pathname === "/auth/signup" ||
    location.pathname === "/auth/verify-otp" ||
    location.pathname === "/auth/reset-password" ||
    location.pathname === "/auth/forgot-password";

  if (isAuthenticated && isAuthRoute) {
    const redirectTo = location.state?.returnTo || "/";
    return <Navigate to={redirectTo} replace={true} />;
  }
  return <Outlet key={location.pathname} />;
};

export default PublicRoute;
