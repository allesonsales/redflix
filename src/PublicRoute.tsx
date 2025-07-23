import { useContext, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContexts";

type PublicRoutesProps = {
  children: JSX.Element;
};

function PublicRoute({ children }: PublicRoutesProps) {
  const auth = useContext(AuthContext);

  if (auth?.user) {
    return <Navigate to="/filmes" replace />;
  }

  return children;
}

export default PublicRoute;
