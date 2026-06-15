import { Navigate } from "react-router-dom";
import useAuth from "../../hook/useAuth";
import Spinner from "./Spinner";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, initialized, loading } = useAuth();

  if (!initialized && loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
