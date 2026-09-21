import { Link } from "react-router";
import { FaBed, FaDoorOpen, FaTools, FaLayerGroup } from "react-icons/fa";
import { MdMeetingRoom } from "react-icons/md";
import { SiHomeassistant } from "react-icons/si";
import { MdChangeCircle } from "react-icons/md";
import PageHeader from "../../../components/PageHeader";
import useUserStatus from "../../../hooks/useUserStatus";

const Rooms = () => {
  const { status, type } = useUserStatus();
  return (
    <div className="p-6">
      {/* ===== Page Header ===== */}
      <PageHeader
        title="Room Management"
        subtitle="Manage hotel rooms, availability, and maintenance."
        icon={<MdMeetingRoom className="text-xl text-white" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {/* Room Overview - Rose */}
        {type !== "sub-user" && (
          <>
            <Link
              to="/dashboard/rooms/room_overview"
              className="group bg-white rounded-2xl shadow-md border border-rose-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-rose-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center mb-6 shadow-md shadow-rose-200 group-hover:scale-110 transition-transform">
                <FaBed className="text-2xl text-white" />
              </div>
              <h2 className="text-lg font-bold text-rose-800 mb-2">
                Room Overview
              </h2>
              <p className="text-gray-600 text-sm">
                View and manage all hotel rooms and their details.
              </p>
            </Link>

            {/* Add Room Variant - Violet */}
            <Link
              to="/dashboard/rooms/add_room_variant"
              className="group bg-white rounded-2xl shadow-md border border-violet-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-violet-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center mb-6 shadow-md shadow-violet-200 group-hover:scale-110 transition-transform">
                <FaLayerGroup className="text-2xl text-white" />
              </div>
              <h2 className="text-lg font-bold text-violet-800 mb-2">
                Add Room Variant
              </h2>
              <p className="text-gray-600 text-sm">
                Create room variants with different configurations and pricing.
              </p>
            </Link>
            {/* Maintenance - Amber */}
            <Link
              to="/dashboard/rooms/maintenance"
              className="group bg-white rounded-2xl shadow-md border border-amber-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-amber-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center mb-6 shadow-md shadow-amber-200 group-hover:scale-110 transition-transform">
                <FaTools className="text-2xl text-white" />
              </div>
              <h2 className="text-lg font-bold text-amber-800 mb-2">
                Maintenance
              </h2>
              <p className="text-gray-600 text-sm">
                Track rooms under maintenance and schedule repairs.
              </p>
            </Link>
          </>
        )}

        {/* Room Status - Emerald */}
        <Link
          to="/dashboard/rooms/room_status"
          className="group bg-white rounded-2xl shadow-md border border-emerald-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-emerald-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mb-6 shadow-md shadow-emerald-200 group-hover:scale-110 transition-transform">
            <FaDoorOpen className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-emerald-800 mb-2">
            Room Status
          </h2>
          <p className="text-gray-600 text-sm">
            Monitor available, occupied, reserved, and vacant rooms.
          </p>
        </Link>

        {/* All Rooms - Sky */}
        <Link
          to="/dashboard/rooms/all-rooms"
          className="group bg-white rounded-2xl shadow-md border border-sky-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-sky-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center mb-6 shadow-md shadow-sky-200 group-hover:scale-110 transition-transform">
            <SiHomeassistant className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-sky-800 mb-2">All Rooms</h2>
          <p className="text-gray-600 text-sm">
            Manage room maintenance, track repairs, and ensure every room stays
            guest-ready.
          </p>
        </Link>

        {/* Change Room - Indigo */}
        <Link
          to="/dashboard/rooms/change-room"
          className="group bg-white rounded-2xl shadow-md border border-indigo-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-indigo-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center mb-6 shadow-md shadow-indigo-200 group-hover:scale-110 transition-transform">
            <MdChangeCircle className="text-3xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-indigo-800 mb-2">
            Change Room
          </h2>
          <p className="text-gray-600 text-sm">
            Change guest room for better service.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Rooms;
