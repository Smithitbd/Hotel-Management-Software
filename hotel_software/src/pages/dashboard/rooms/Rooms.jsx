import { Link } from "react-router";
import { FaBed, FaDoorOpen, FaTools, FaLayerGroup } from "react-icons/fa";
import { MdMeetingRoom } from "react-icons/md";

const Rooms = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
          <MdMeetingRoom className="text-xl text-white" />
        </div>

        <h1 className="text-lg font-bold text-rose-700">Room Management</h1>
      </div>

      <p className="text-gray-500 mb-10">
        Manage hotel rooms, availability, and maintenance.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {/* Room Overview */}
        <Link
          to="/dashboard/rooms/room_overview"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaBed className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Room Overview
          </h2>

          <p className="text-gray-600 text-sm">
            View and manage all hotel rooms and their details.
          </p>
        </Link>

        {/* Add Room Variant */}
        <Link
          to="/dashboard/rooms/add_room_variant"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaLayerGroup className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Add Room Variant
          </h2>

          <p className="text-gray-600 text-sm">
            Create room variants with different configurations and pricing.
          </p>
        </Link>

        {/* Room Status */}
        <Link
          to="/dashboard/rooms/room_status"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaDoorOpen className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">Room Status</h2>

          <p className="text-gray-600 text-sm">
            Monitor available, occupied, reserved, and vacant rooms.
          </p>
        </Link>

        {/* Maintenance */}
        <Link
          to="/dashboard/rooms/maintenance"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaTools className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">Maintenance</h2>

          <p className="text-gray-600 text-sm">
            Track rooms under maintenance and schedule repairs.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Rooms;
