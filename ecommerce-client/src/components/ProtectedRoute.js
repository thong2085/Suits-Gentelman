import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ isAdmin = false }) => {
  const { userInfo } = useSelector((state) => state.auth);

  return userInfo?.token ? (
    userInfo?.isAdmin ? (
      <Outlet />
    ) : (
      <Navigate to="/*" />
    )
  ) : (
    <Navigate to="*" />
  );

  return <Outlet />;
};

export default ProtectedRoute;
