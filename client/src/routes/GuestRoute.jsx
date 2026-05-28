import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContextValue";

const GuestRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;
