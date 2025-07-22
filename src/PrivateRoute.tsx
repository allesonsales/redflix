import { useContext, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContexts";

type PrivateRouteProps = {
  children: JSX.Element;
};

function PrivateRoute({ children }: PrivateRouteProps) {
  const auth = useContext(AuthContext);

  if (!auth?.user) {
    return <Navigate to="/redflix" replace />;
  }

  return children;
}

export default PrivateRoute;
