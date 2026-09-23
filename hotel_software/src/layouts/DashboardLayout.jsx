import { Link, NavLink, Outlet } from "react-router";
import { FaHome, FaBars, FaRegMoneyBillAlt } from "react-icons/fa";
import Logo from "../components/Logo";
import { MdDashboard, MdOutlineDesignServices } from "react-icons/md";
import { FaBuildingCircleCheck, FaPersonCircleCheck } from "react-icons/fa6";
import { BsPersonWorkspace } from "react-icons/bs";
import { TbReport, TbReservedLine } from "react-icons/tb";
import { IoSettingsSharp } from "react-icons/io5";
import useUserStatus from "../hooks/useUserStatus";

const DashboardLayout = () => {
  const { status, statusLoading, type } = useUserStatus();

  if (statusLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-rose-900"></span>
      </div>
    );
  }

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-gray-100">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* ===================== MAIN CONTENT ===================== */}
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Mobile Navbar */}
        <div className="navbar bg-white shadow-md lg:hidden">
          <div className="flex-none">
            <label htmlFor="dashboard-drawer" className="btn btn-square">
              <FaBars size={20} />
            </label>
          </div>
          <div className="flex-1 justify-center">
            <h2 className="text-sm font-bold text-amber-800">Dashboard</h2>
          </div>
        </div>

        {/* Page Content + Footer */}
        <div className="flex flex-col flex-1">
          {/* Main content grows */}
          <div className="flex-1 p-6">
            <Outlet />
          </div>

          {/* ===== FOOTER (Smith IT style) ===== */}
          <footer className="px-6 py-5 mt-auto border-t border-gray-200 bg-white">
            <div className="flex flex-col items-center gap-3">
              {/* Smith IT Logo */}
              <div className="flex items-center gap-1.5"></div>

              {/* Copyright text */}
              <p className="text-xs text-gray-500 text-center">
                © All Rights Reserved. Obokash is a product of{" "}
                <Link
                  to="https://smithitbd.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 font-semibold hover:underline"
                >
                  Smith IT
                </Link>
              </p>
            </div>
          </footer>
        </div>
      </div>

      {/* ===================== SIDEBAR ===================== */}
      <div className="drawer-side z-50">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

        <aside className="w-72 min-h-full bg-rose-900 text-white">
          <div className="pt-4">
            <Logo />
          </div>

          <ul className="menu gap-2">
            {/* ===== Approved users ===== */}
            {status === "Approved" && (
              <>
                <li>
                  <NavLink className="text-lg" to="/dashboard">
                    <MdDashboard /> Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink className="text-lg" to="/dashboard/rooms">
                    <FaHome /> Rooms
                  </NavLink>
                </li>
                <li>
                  <NavLink className="text-lg" to="/dashboard/services">
                    <MdOutlineDesignServices /> Services
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="text-lg"
                    to="/dashboard/billing_and_payments"
                  >
                    <FaRegMoneyBillAlt /> Billing & Payments
                  </NavLink>
                </li>
                <li>
                  <NavLink className="text-lg" to="/dashboard/check_in_out">
                    <FaBuildingCircleCheck /> Check In & Out
                  </NavLink>
                </li>
                {type !== "sub-user" && (
                  <>
                    <li>
                      <NavLink className="text-lg" to="/dashboard/employees">
                        <BsPersonWorkspace /> Employees
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="text-lg" to="/dashboard/reports">
                        <TbReport /> Reports
                      </NavLink>
                    </li>
                  </>
                )}
                <li>
                  <NavLink className="text-lg" to="/dashboard/guests">
                    <FaPersonCircleCheck /> Guests
                  </NavLink>
                </li>
                <li>
                  <NavLink className="text-lg" to="/dashboard/reservations">
                    <TbReservedLine /> Reservations
                  </NavLink>
                </li>
                <li>
                  <NavLink className="text-lg" to="/dashboard/settings">
                    <IoSettingsSharp /> Settings
                  </NavLink>
                </li>
              </>
            )}

            {/* ===== Admin users ===== */}
            {status === "Admin" && (
              <>
                <li>
                  <NavLink className="text-lg" to="/dashboard/settings">
                    <IoSettingsSharp /> Settings
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
