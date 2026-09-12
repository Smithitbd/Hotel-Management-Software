import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import useUserStatus from "../hooks/useUserStatus";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { status, statusLoading } = useUserStatus();

  if (loading || statusLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (status !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
