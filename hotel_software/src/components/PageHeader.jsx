import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";

const PageHeader = ({ title, subtitle, icon, extra }) => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#be123c",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Logout",
    });

    if (!result.isConfirmed) return;

    try {
      await logOut();
      navigate("/");
      Swal.fire({
        title: "Logged out!",
        text: "You have been logged out successfully.",
        icon: "success",
        confirmButtonColor: "#be123c",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to logout",
        icon: "error",
        confirmButtonColor: "#be123c",
      });
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: Icon + Title */}
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-9 h-9 rounded-full bg-rose-900 flex items-center justify-center">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold text-rose-900">{title}</h1>
            {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
          </div>
        </div>

        {/* Right: Extra buttons + Logout */}
        <div className="flex items-center gap-3">
          {extra}
          <button
            onClick={handleLogout}
            className="btn btn-sm bg-rose-900 hover:bg-rose-900 text-white border-none gap-2"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
