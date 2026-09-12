import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../hooks/useAxios";
import { IoMdSkipBackward } from "react-icons/io";
import Swal from "sweetalert2";
import { MdOutlineViewInAr } from "react-icons/md";

const ViewRooms = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const {
    data: rooms = [],
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["variant-rooms", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/rooms/variant/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // All check-ins (for date-based Occupied)
  const { data: checkIns = [] } = useQuery({
    queryKey: ["check-ins"],
    queryFn: async () => {
      const res = await axiosInstance.get("/check-in");
      return res.data;
    },
  });

  // All reservations (for date-based Reserved)
  const { data: reservations = [] } = useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      const res = await axiosInstance.get("/reservations");
      return res.data;
    },
  });

  // Status for today based on dates
  const getDisplayStatus = (room) => {
    // Manual offline statuses win
    if (
      room.roomStatus === "Maintenance" ||
      room.roomStatus === "In Progress"
    ) {
      return room.roomStatus;
    }

    const roomNo = String(room.roomNo);

    // Occupied today (check-in)
    const occupied = checkIns.some(
      (c) =>
        String(c.roomNumber) === roomNo &&
        c.checkInDate <= today &&
        c.checkOutDate > today,
    );
    if (occupied) return "Occupied";

    // Reserved today (reservation)
    const reserved = reservations.some(
      (r) =>
        String(r.room?.roomNo || r.roomNo) === roomNo &&
        r.status === "Reserved" &&
        r.arrivingDate <= today &&
        r.departureDate > today,
    );
    if (reserved) return "Reserved";

    // Otherwise use stored status (usually Available)
    return room.roomStatus || "Available";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-rose-800"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto mt-10">
        <div className="alert alert-error">
          <span>{error?.message || "Failed to load rooms."}</span>
        </div>
      </div>
    );
  }

  const changeStatus = async (roomId, status) => {
    const res = await axiosInstance.patch(`/rooms/${roomId}`, {
      roomStatus: status,
    });

    if (res.data.modifiedCount > 0) {
      await Swal.fire({
        title: "Status Updated!",
        text: `Room status changed to ${status}.`,
        icon: "success",
        confirmButtonColor: "#BF1E2E",
      });
      refetch();
    } else {
      Swal.fire({
        title: "No Changes Made",
        text: "The room already has this status.",
        icon: "info",
        confirmButtonColor: "#BF1E2E",
      });
    }
  };

  const getStatusClass = (status) => {
    if (status === "Available")
      return "bg-green-400 text-white border-green-200";
    if (status === "Maintenance") return "bg-red-700 text-white border-red-200";
    if (status === "In Progress")
      return "bg-violet-500 text-white border-yellow-200";
    if (status === "Occupied")
      return "bg-orange-900 text-white border-blue-200";
    if (status === "Reserved")
      return "bg-blue-900 text-white border-purple-200";
    return "bg-gray-100 text-gray-700 border-gray-300";
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-5 justify-center items-center">
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <MdOutlineViewInAr className="text-2xl text-white" />
            </div>
            <h1 className="text-lg font-bold text-rose-700">View Rooms</h1>
          </div>
          <Link to="/dashboard/rooms/room_status">
            <button className="flex items-center justify-center w-9 h-9 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors">
              <IoMdSkipBackward className="text-lg" />
            </button>
          </Link>
        </div>

        <p className="text-gray-500 mt-1">
          Rooms belonging to this room variant (status based on today&apos;s
          dates)
        </p>
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-10 text-center">
          <p className="text-gray-500">No rooms found for this variant.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => {
            const status = getDisplayStatus(room);

            return (
              <div
                key={room._id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition duration-300"
              >
                <div className="p-5">
                  <div className="flex justify-between items-center gap-3 mb-5">
                    <h2 className="text-xl font-bold text-rose-800">
                      Room : {room.roomNo}
                    </h2>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold border whitespace-nowrap ${getStatusClass(
                        status,
                      )}`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Room Type</span>
                      <span className="font-semibold text-gray-800 text-right">
                        {room.variantName}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Base Type</span>
                      <span className="font-semibold text-gray-800">
                        {room.baseRoomType}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Bed</span>
                      <span className="font-semibold text-gray-800">
                        {room.bedType}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Occupancy</span>
                      <span className="font-semibold text-gray-800">
                        {room.maxOccupancy} Persons
                      </span>
                    </div>
                  </div>

                  {/* Manual status (Maintenance etc.) */}
                  <div className="flex justify-center mt-6">
                    <select
                      defaultValue={room.roomStatus}
                      onChange={(e) => changeStatus(room._id, e.target.value)}
                      className={`select select-bordered font-medium w-full max-w-xs
                        ${
                          room.roomStatus === "Available"
                            ? "border-emerald-400 text-emerald-700 bg-emerald-50"
                            : room.roomStatus === "Maintenance"
                              ? "border-red-400 text-red-700 bg-red-50"
                              : room.roomStatus === "In Progress"
                                ? "border-violet-400 text-violet-700 bg-violet-50"
                                : room.roomStatus === "Occupied"
                                  ? "border-orange-400 text-orange-700 bg-orange-50"
                                  : room.roomStatus === "Reserved"
                                    ? "border-blue-400 text-blue-700 bg-blue-50"
                                    : "border-gray-300 text-gray-700 bg-white"
                        }
                      `}
                    >
                      <option value="Available">Available</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Reserved">Reserved</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewRooms;
