import { Link } from "react-router";
import {
  FaConciergeBell,
  FaUtensils,
  FaTshirt,
  FaShuttleVan,
} from "react-icons/fa";
import { MdHomeRepairService } from "react-icons/md";
import PageHeader from "../../../components/PageHeader";

const Services = () => {
  return (
    <div className="p-6">
      {/* ===== Page Header ===== */}
      <PageHeader
        title="Hotel Services"
        subtitle="Manage all guest services offered by the hotel."
        icon={<MdHomeRepairService className="text-xl text-white" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
        {/* Room Service - Rose */}
        <Link
          to="/dashboard/services/room_service"
          className="group bg-white rounded-2xl shadow-md border border-rose-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-rose-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center mb-6 shadow-md shadow-rose-200 group-hover:scale-110 transition-transform">
            <FaConciergeBell className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-rose-800 mb-2">Room Service</h2>
          <p className="text-gray-600 text-sm">
            Manage room service requests and track their completion.
          </p>
        </Link>

        {/* Restaurant Orders - Orange */}
        <Link
          to="/dashboard/services/restaurant_orders"
          className="group bg-white rounded-2xl shadow-md border border-orange-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-orange-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mb-6 shadow-md shadow-orange-200 group-hover:scale-110 transition-transform">
            <FaUtensils className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-orange-800 mb-2">
            Restaurant Orders
          </h2>
          <p className="text-gray-600 text-sm">
            Handle guest food orders and restaurant billing.
          </p>
        </Link>

        {/* Laundry Service - Sky */}
        <Link
          to="/dashboard/services/laundry_service"
          className="group bg-white rounded-2xl shadow-md border border-sky-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-sky-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center mb-6 shadow-md shadow-sky-200 group-hover:scale-110 transition-transform">
            <FaTshirt className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-sky-800 mb-2">
            Laundry Service
          </h2>
          <p className="text-gray-600 text-sm">
            Track laundry requests, pricing, and delivery status.
          </p>
        </Link>

        {/* Transport Service - Emerald */}
        <Link
          to="/dashboard/services/transport_service"
          className="group bg-white rounded-2xl shadow-md border border-emerald-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-emerald-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mb-6 shadow-md shadow-emerald-200 group-hover:scale-110 transition-transform">
            <FaShuttleVan className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-emerald-800 mb-2">
            Transport Service
          </h2>
          <p className="text-gray-600 text-sm">
            Manage airport pickups, drop-offs, and guest transportation.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Services;
