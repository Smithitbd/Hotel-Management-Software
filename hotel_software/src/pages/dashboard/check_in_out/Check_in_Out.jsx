import { Link } from "react-router";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { IoLogInOutline } from "react-icons/io5";
import PageHeader from "../../../components/PageHeader";

const Check_In_Out = () => {
  return (
    <div className="mx-auto p-4 sm:p-6 max-w-5xl">
      {/* ===== Page Header ===== */}
      <PageHeader
        title="Check In & Check Out"
        subtitle="Manage guest arrivals and departures efficiently."
        icon={<IoLogInOutline className="text-xl text-white" />}
      />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-2">
        {/* Check In - Emerald */}
        <Link
          to="/dashboard/check_in_out/check_in"
          className="group bg-white rounded-2xl shadow-md border border-emerald-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-emerald-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mb-6 shadow-md shadow-emerald-200 group-hover:scale-110 transition-transform">
            <FaSignInAlt className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-emerald-800 mb-2">Check In</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Register arriving guests, assign rooms, and complete the check-in
            process quickly.
          </p>
        </Link>

        {/* Check Out - Rose */}
        <Link
          to="/dashboard/check_in_out/check_out"
          className="group bg-white rounded-2xl shadow-md border border-rose-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-rose-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center mb-6 shadow-md shadow-rose-200 group-hover:scale-110 transition-transform">
            <FaSignOutAlt className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-rose-800 mb-2">Check Out</h2>
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
