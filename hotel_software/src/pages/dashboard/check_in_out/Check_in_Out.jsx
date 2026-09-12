import { Link } from "react-router";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { IoLogInOutline } from "react-icons/io5";
const Check_In_Out = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
          <IoLogInOutline className="text-xl text-white" />
        </div>

        <h1 className="text-xl font-bold text-[#BF1E2E]">
          Check In & Check Out
        </h1>
      </div>

      <p className="text-gray-500 mb-10">
        Manage guest arrivals and departures efficiently.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Check In */}
        <Link
          to="/dashboard/check_in_out/check_in"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaSignInAlt className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-xl font-bold text-[#BF1E2E] mb-3">Check In</h2>

          <p className="text-gray-600 text-sm">
            Register arriving guests, assign rooms, and complete the check-in
            process quickly.
          </p>
        </Link>

        {/* Check Out */}
        <Link
          to="/dashboard/check_in_out/check_out"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaSignOutAlt className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-xl font-bold text-[#BF1E2E] mb-3">Check Out</h2>

          <p className="text-gray-600 text-sm">
            Complete guest departures, generate bills, and free rooms for the
            next reservation.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Check_In_Out;
