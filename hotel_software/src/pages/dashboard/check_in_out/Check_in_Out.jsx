import { Link } from "react-router";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { IoLogInOutline } from "react-icons/io5";
import PageHeader from "../../../components/PageHeader"; // adjust path if needed

const Check_In_Out = () => {
  return (
    <div className="mx-auto p-4 sm:p-6 max-w-5xl">
      {/* ===== Page Header (Title + Logout) ===== */}
      <PageHeader
        title="Check In & Check Out"
        subtitle="Manage guest arrivals and departures efficiently."
        icon={<IoLogInOutline className="text-xl text-white" />}
      />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-2">
        {/* Check In */}
        <Link
          to="/dashboard/check_in_out/check_in"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-rose-900"
        >
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-rose-900">
            <FaSignInAlt className="text-2xl text-rose-900 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-900 mb-3">Check In</h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            Register arriving guests, assign rooms, and complete the check-in
            process quickly.
          </p>
        </Link>

        {/* Check Out */}
        <Link
          to="/dashboard/check_in_out/check_out"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-rose-900"
        >
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-rose-900">
            <FaSignOutAlt className="text-2xl text-rose-900 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-900 mb-3">Check Out</h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            Complete guest departures, generate bills, and free rooms for the
            next reservation.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Check_In_Out;
