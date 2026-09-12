import { Link, useNavigate } from "react-router";
import {
  FaHotel,
  FaUserShield,
  FaLock,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { RiSettings5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useUserStatus from "../../../hooks/useUserStatus";

const Settings = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const { status } = useUserStatus();

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
          <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
            <RiSettings5Line className="text-xl text-white" />
          </div>
          <h1 className="text-lg font-bold text-rose-700">Settings</h1>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-sm bg-rose-700 hover:bg-rose-800 text-white border-none gap-2"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      <p className="text-gray-500 mb-10">
        Configure your hotel management system and account preferences.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {/* Hotel Information → Hidden for Admin */}
        {status !== "Admin" && (
          <Link
            to="/dashboard/settings/hotel_information"
            className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
          >
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
              <FaHotel className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
            </div>

            <h2 className="text-lg font-bold text-rose-700 mb-3">
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
            className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
          >
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
              <FaUserShield className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
            </div>

            <h2 className="text-lg font-bold text-rose-700 mb-3">Hotels</h2>

            <p className="text-gray-600 text-sm">
              Manage staff accounts, permissions, and access levels.
            </p>
          </Link>
        )}

        {/* Security → Visible for both */}
        <Link
          to="/dashboard/settings/security"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaLock className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">Security</h2>

          <p className="text-gray-600 text-sm">
            Change passwords, configure authentication, and manage security
            settings.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Settings;
