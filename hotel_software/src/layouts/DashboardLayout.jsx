import { Link, NavLink, Outlet } from "react-router";
import { FaHome, FaBars, FaRegMoneyBillAlt } from "react-icons/fa";
import Logo from "../components/Logo";
import { MdDashboard, MdOutlineDesignServices } from "react-icons/md";
import { FaBuildingCircleCheck, FaPersonCircleCheck } from "react-icons/fa6";
import { BsPersonWorkspace } from "react-icons/bs";
import { TbReport, TbReservedLine } from "react-icons/tb";
import { IoSettingsSharp } from "react-icons/io5";
import useUserStatus from "../hooks/useUserStatus";
import { SiNicehash } from "react-icons/si";

const DashboardLayout = () => {
  const { status, statusLoading } = useUserStatus();

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

      <div className="drawer-content flex flex-col">
        <div className="navbar bg-white shadow-md lg:hidden">
          <div className="flex-none">
            <label htmlFor="dashboard-drawer" className="btn btn-square">
              <FaBars size={10} />
            </label>
          </div>
          <div className="flex-1 justify-center">
            <h2 className="text-sm font-bold text-amber-800 ml-9">Dashboard</h2>
          </div>
        </div>

        <div className="p-6">
          <Outlet />
          <div className="flex flex-row justify-between mt-4 gap-3">
            <footer className="footer ml-6 w-3/5  sm:footer-horizontal  text-neutral-content items-center p-4">
              <aside className="grid-flow-col items-center">
                <SiNicehash className="text-lg text-black" />
                <p className="text-black">
                  Copyright © {new Date().getFullYear()} - All right reserved to
                  <Link
                    to="https://smithitbd.com/"
                    className="text-sm text-rose-900 font-bold underline"
                  >
                    {" "}
                    Smith IT
                  </Link>
                </p>
              </aside>
            </footer>
            <div className="text-green-500 font-bold mt-3  p-4">
              Made in <span className="text-red-500 ">Bangladesh</span>{" "}
            </div>
          </div>
        </div>
      </div>

      <div className="drawer-side z-50">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

        <aside className="w-72 min-h-full bg-rose-900 text-white">
          <div className="p-4">
            <Logo></Logo>
          </div>

          <ul className="menu gap-2">
            {/* ===== Approved users ===== */}
            {status === "Approved" && (
              <>
                <li>
                  <NavLink className="text-lg -mt-10" to="/dashboard">
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
                <li>
                  <NavLink className="text-lg" to="/dashboard/employees">
                    <BsPersonWorkspace /> Employees
                  </NavLink>
                </li>
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
                  <NavLink className="text-lg" to="/dashboard/reports">
                    <TbReport /> Reports
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
