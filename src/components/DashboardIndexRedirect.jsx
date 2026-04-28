import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const DashboardIndexRedirect = () => {
  const location = useLocation();
  const search = location.search || "";
  return <Navigate to={`/dashboard/profile${search}`} replace />;
};

export default DashboardIndexRedirect;



