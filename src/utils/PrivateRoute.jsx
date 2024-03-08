import AuthContext from "@src/context/AuthContext";
import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  let { user } = useContext(AuthContext);
  return user ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoute;
