import { Link } from "react-router";
import { FaUsers, FaUserSlash, FaHistory } from "react-icons/fa";
import { FaVanShuttle } from "react-icons/fa6";

const Guests = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
          <FaVanShuttle className="text-xl text-white" />
        </div>

        <h1 className="text-lg font-bold text-rose-700">Guest Management</h1>
      </div>

      <p className="text-gray-500 mb-10">
        Manage guest information, registrations, and stay history.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Present Guest List */}
        <Link
          to="/dashboard/guests/present_guest_list"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaUsers className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Present Guest List
          </h2>

          <p className="text-gray-600 text-sm">
            View and manage all registered guests and their personal details.
          </p>
        </Link>

        {/* Blacklisted Guests */}
        <Link
          to="/dashboard/guests/black_listed_guests"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaUserSlash className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Blacklisted Guests
          </h2>

          <p className="text-gray-600 text-sm">
            View and manage guests who are restricted from making future
            reservations.
          </p>
        </Link>

        {/* Guest History */}
        <Link
          to="/dashboard/guests/guest_history"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaHistory className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Guests History
          </h2>

          <p className="text-gray-600 text-sm">
            Access previous stays, bookings, and complete guest activity
            history.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Guests;
