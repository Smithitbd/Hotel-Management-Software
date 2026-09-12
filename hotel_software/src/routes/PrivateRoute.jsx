import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import useUserStatus from "../hooks/useUserStatus";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { status, statusLoading } = useUserStatus();

  // Show spinner while auth or status is loading
  if (loading || statusLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-rose-700"></span>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Hotel account is still pending approval
  if (status === "Pending") {
    return <Navigate to="/under_preview" replace />;
  }

  // Payment due
  if (status === "Due") {
    return <Navigate to="/under_due" replace />;
  }

  // Only allow Approved or Admin
  if (status !== "Approved" && status !== "Admin") {
    return <Navigate to="/" replace />;
  }

  // Everything OK → show the protected page
  return children;
};

export default PrivateRoute;
