import { Link } from "react-router";
import { FaUsers, FaUserSlash, FaHistory } from "react-icons/fa";
import { FaVanShuttle } from "react-icons/fa6";
import PageHeader from "../../../components/PageHeader";

const Guests = () => {
  return (
    <div className="mx-auto p-4 sm:p-6 max-w-6xl">
      {/* ===== Page Header ===== */}
      <PageHeader
        title="Guest Management"
        subtitle="Manage guest information, registrations, and stay history."
        icon={<FaVanShuttle className="text-xl text-white" />}
      />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 mt-2">
        {/* Present Guest List - Emerald */}
        <Link
          to="/dashboard/guests/present_guest_list"
          className="group bg-white rounded-2xl shadow-md border border-emerald-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-emerald-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mb-6 shadow-md shadow-emerald-200 group-hover:scale-110 transition-transform">
            <FaUsers className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-emerald-800 mb-2">
            Present Guest List
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            View and manage all registered guests and their personal details.
          </p>
        </Link>

        {/* Blacklisted Guests - Rose */}
        <Link
          to="/dashboard/guests/black_listed_guests"
          className="group bg-white rounded-2xl shadow-md border border-rose-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-rose-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center mb-6 shadow-md shadow-rose-200 group-hover:scale-110 transition-transform">
            <FaUserSlash className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-rose-800 mb-2">
            Blacklisted Guests
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            View and manage guests who are restricted from making future
            reservations.
          </p>
        </Link>

        {/* Guest History - Sky */}
        <Link
          to="/dashboard/guests/guest_history"
          className="group bg-white rounded-2xl shadow-md border border-sky-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-sky-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center mb-6 shadow-md shadow-sky-200 group-hover:scale-110 transition-transform">
            <FaHistory className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-sky-800 mb-2">
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
