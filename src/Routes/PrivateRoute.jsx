import React, { useEffect, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loader from "@/components/Loader";
import { checkAuthStatus } from "@/redux/actions/authActions";

const PrivateRoute = () => {
  const { isAuthenticated, checkingAuth, authChecked } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const location = useLocation();
  const prevPathRef = useRef("");

  const getBasePath = (path) => {
    const firstSegment = path.split("/")[1];
    return `/${firstSegment}`;
  };

  useEffect(() => {
    const currentBasePath = getBasePath(location.pathname);
    const prevBasePath = getBasePath(prevPathRef.current);
    if (currentBasePath !== prevBasePath) {
      dispatch(checkAuthStatus());
    }

    prevPathRef.current = location.pathname;
  }, [location.pathname, dispatch]);

  // Allow OAuth callback with auth_token to pass through so dashboard can process it
  const params = new URLSearchParams(location.search);
  const oauthTokenPresent = params.get('auth_token');

  if (!isAuthenticated && !checkingAuth && authChecked && !oauthTokenPresent) {
    return (
      <Navigate
        to="/auth/login"
        state={{ returnTo: location.pathname + location.search }}
        replace={true}
      />
    );
  }

  if (checkingAuth || !authChecked) {
    return <Loader />;
  }

  return <Outlet key={location.pathname} />;
};

export default PrivateRoute;
