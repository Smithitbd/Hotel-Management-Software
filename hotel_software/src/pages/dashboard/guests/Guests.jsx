import { Link } from "react-router";
import { FaUsers, FaUserSlash, FaHistory } from "react-icons/fa";
import { FaVanShuttle } from "react-icons/fa6";
import PageHeader from "../../../components/PageHeader"; // adjust path if needed

const Guests = () => {
  return (
    <div className="mx-auto p-4 sm:p-6 max-w-6xl">
      {/* ===== Page Header (Title + Logout) ===== */}
      <PageHeader
        title="Guest Management"
        subtitle="Manage guest information, registrations, and stay history."
        icon={<FaVanShuttle className="text-xl text-white" />}
      />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 mt-2">
        {/* Present Guest List */}
        <Link
          to="/dashboard/guests/present_guest_list"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-rose-900"
        >
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-rose-900">
            <FaUsers className="text-2xl text-rose-900 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-900 mb-3">
            Present Guest List
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            View and manage all registered guests and their personal details.
          </p>
        </Link>

        {/* Blacklisted Guests */}
        <Link
          to="/dashboard/guests/black_listed_guests"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-rose-900"
        >
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-rose-900">
            <FaUserSlash className="text-2xl text-rose-900 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-900 mb-3">
            Blacklisted Guests
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            View and manage guests who are restricted from making future
            reservations.
          </p>
        </Link>

        {/* Guest History */}
        <Link
          to="/dashboard/guests/guest_history"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-rose-900"
        >
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-rose-900">
            <FaHistory className="text-2xl text-rose-900 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-900 mb-3">
            Guests History
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            Access previous stays, bookings, and complete guest activity
            history.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Guests;
