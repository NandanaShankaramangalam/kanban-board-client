import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../../utils/utils";

const AuthGuard = ({ children }) => {
  const isLogged = isLoggedIn();
  if (isLogged) {
    return <Navigate to="/kanban" />;
  }
  return children;
};

export default AuthGuard;
