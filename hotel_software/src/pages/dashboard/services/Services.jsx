import { Link } from "react-router";
import {
  FaConciergeBell,
  FaUtensils,
  FaTshirt,
  FaShuttleVan,
} from "react-icons/fa";
import { MdHomeRepairService } from "react-icons/md";

const Services = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
          <MdHomeRepairService className="text-xl text-white" />
        </div>

        <h1 className="text-lg font-bold text-rose-700">Hotel Services</h1>
      </div>

      <p className="text-gray-500 mb-10">
        Manage all guest services offered by the hotel.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {/* Room Service */}
        <Link
          to="/dashboard/services/room_service"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaConciergeBell className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">Room Service</h2>

          <p className="text-gray-600 text-sm">
            Manage room service requests and track their completion.
          </p>
        </Link>

        {/* Restaurant Orders */}
        <Link
          to="/dashboard/services/restaurant_orders"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaUtensils className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Restaurant Orders
          </h2>

          <p className="text-gray-600 text-sm">
            Handle guest food orders and restaurant billing.
          </p>
        </Link>

        {/* Laundry Service */}
        <Link
          to="/dashboard/services/laundry_service"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaTshirt className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Laundry Service
          </h2>

          <p className="text-gray-600 text-sm">
            Track laundry requests, pricing, and delivery status.
          </p>
        </Link>

        {/* Transport Service */}
        <Link
          to="/dashboard/services/transport_service"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaShuttleVan className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
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
