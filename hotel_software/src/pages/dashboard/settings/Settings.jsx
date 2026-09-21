import { Link, useNavigate } from "react-router";
import {
  FaHotel,
  FaUserShield,
  FaLock,
  FaSignOutAlt,
  FaUserPlus,
} from "react-icons/fa";
import { RiSettings5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useUserStatus from "../../../hooks/useUserStatus";

const Settings = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const { status, type } = useUserStatus();

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
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-900 flex items-center justify-center">
            <RiSettings5Line className="text-xl text-white" />
          </div>
          <h1 className="text-lg font-bold text-rose-900">Settings</h1>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-sm bg-rose-900 hover:bg-rose-800 text-white border-none gap-2"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      <p className="text-gray-500 mb-10">
        Configure your hotel management system and account preferences.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Hotel Information → Hidden for Admin */}
        {status !== "Admin" && type !== "sub-user" && (
          <Link
            to="/dashboard/settings/hotel_information"
            className="group bg-white rounded-2xl shadow-md border border-rose-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-rose-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center mb-6 shadow-md shadow-rose-200 group-hover:scale-110 transition-transform">
              <FaHotel className="text-2xl text-white" />
            </div>
            <h2 className="text-lg font-bold text-rose-800 mb-2">
              Hotel Information
            </h2>
            <p className="text-gray-600 text-sm">
              Update hotel name, address, contact details, and branding.
            </p>
          </Link>
        )}

        {/* Hotels → Only for Admin */}
        {status === "Admin" && (
          <Link
            to="/dashboard/settings/hotels"
            className="group bg-white rounded-2xl shadow-md border border-violet-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-violet-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center mb-6 shadow-md shadow-violet-200 group-hover:scale-110 transition-transform">
              <FaUserShield className="text-2xl text-white" />
            </div>
            <h2 className="text-lg font-bold text-violet-800 mb-2">Hotels</h2>
            <p className="text-gray-600 text-sm">
              Manage staff accounts, permissions, and access levels.
            </p>
          </Link>
        )}

        {/* Security */}
        <Link
          to="/dashboard/settings/security"
          className="group bg-white rounded-2xl shadow-md border border-sky-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-sky-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center mb-6 shadow-md shadow-sky-200 group-hover:scale-110 transition-transform">
            <FaLock className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-sky-800 mb-2">Security</h2>
          <p className="text-gray-600 text-sm">
            Change passwords, configure authentication, and manage security
            settings.
          </p>
        </Link>

        {/* Add Sub User → Only for Hotel Owner (main email) */}
        {type === "owner" && (
          <Link
            to="/dashboard/settings/sub-user"
            className="group bg-white rounded-2xl shadow-md border border-emerald-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-emerald-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mb-6 shadow-md shadow-emerald-200 group-hover:scale-110 transition-transform">
              <FaUserPlus className="text-2xl text-white" />
            </div>
            <h2 className="text-lg font-bold text-emerald-800 mb-2">
              Add Sub User
            </h2>
            <p className="text-gray-600 text-sm">
              The sub-user usually has restricted permissions (view-only,
              specific modules, no billing access, etc.).
            </p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Settings;
