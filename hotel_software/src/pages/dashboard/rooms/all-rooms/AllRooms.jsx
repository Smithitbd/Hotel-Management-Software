import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../hooks/useAxios";
import { FaUsers, FaMoneyBillWave } from "react-icons/fa";
import { MdHotel } from "react-icons/md";
import { RiHome3Line } from "react-icons/ri";
import { useNavigate, useSearchParams, Link } from "react-router";
import useAuth from "../../../../hooks/useAuth";

const AllRooms = () => {
  const axiosInstance = useAxios();
  const imageBaseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();

  const mode = searchParams.get("mode");
  const selectedDate = searchParams.get("date");

  if (loading) {
    return <span className="loading loading-spinner text-error"></span>;
  }

  // 1. Always fetch all rooms
  const {
    data: rooms = [],
    isLoading: roomsLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["all-rooms", user?.email],
    queryFn: async () => {
      const res = await axiosInstance.get("/rooms", {
        params: { hotelEmail: user.email },
      });
      return res.data;
    },
    enabled: !!user?.email,
  });

  // 2. When in reserve mode → check real availability for the selected date
  const { data: availability, isLoading: availabilityLoading } = useQuery({
    queryKey: ["room-availability", selectedDate, user?.email],
    queryFn: async () => {
      const res = await axiosInstance.get("/rooms/available", {
        params: {
          arriving: selectedDate,
          departure: selectedDate,
          hotelEmail: user.email,
        },
      });
      return res.data;
    },
    enabled: mode === "reserve" && !!selectedDate && !!user?.email,
  });

  const isLoading = roomsLoading || (mode === "reserve" && availabilityLoading);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-rose-900"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="mb-4 text-red-700">
            {error?.message || "Failed to load rooms."}
          </p>
          <button
            onClick={refetch}
            className="rounded-lg bg-[#BF1E2E] px-5 py-2 text-sm font-medium text-white transition hover:bg-rose-900"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Helper: check if a room is available on the selected date
  const isRoomAvailableOnDate = (room) => {
    if (mode !== "reserve" || !selectedDate) {
      return room.roomStatus?.toLowerCase() === "available";
    }

    if (!availability) return false;

    const allAvailableRooms =
      availability.variants?.flatMap((v) => v.rooms) || [];

    return allAvailableRooms.some(
      (r) => r._id === room._id || r.roomNo === room.roomNo,
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-900 flex items-center justify-center">
              <MdHotel className="text-2xl text-white" />
            </div>
            <h1 className="text-lg font-bold text-rose-900">
              {mode === "reserve" ? "Select Room to Reserve" : "All Rooms"}
            </h1>
          </div>

          <p className="text-gray-500 ml-9">
            {mode === "reserve" ? (
              <>
                Selected Date:{" "}
                <span className="font-medium text-rose-900">
                  {selectedDate}
                </span>
              </>
            ) : (
              "Manage rooms and make bookings easily."
            )}
          </p>
        </div>

        {/* Header Buttons */}
        <div className="flex items-center gap-3">
          {mode === "reserve" ? (
            <button
              onClick={() => navigate("/dashboard/reservations")}
              className="btn btn-sm btn-outline border-rose-900 text-rose-900"
            >
              ← Back to Calendar
            </button>
          ) : (
            <Link to="/dashboard/rooms">
              <button className="flex items-center justify-center w-11 h-11 border border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white rounded-lg transition-colors">
                <RiHome3Line className="text-xl" />
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Room Count */}
      <div className="mb-8">
        <span className="inline-flex items-center rounded-full bg-red-100 px-4 py-1.5 text-sm font-medium text-[#BF1E2E]">
          {rooms.length} Rooms
        </span>
      </div>

      {/* No Rooms */}
      {rooms.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <MdHotel className="text-2xl text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-rose-400 mb-2">
            No Rooms Found
          </h2>
          <p className="text-gray-500">
            There are currently no rooms available.
          </p>
        </div>
      ) : (
        /* Room Cards - Horizontal Layout like RoomStatus */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {rooms.map((room) => {
            const imageUrl = room.image
              ? room.image.startsWith("http")
                ? room.image
                : `${imageBaseURL}${room.image}`
              : "https://images.unsplash.com/photo-1566665797739-1674de7a421a";

            const isAvailable = isRoomAvailableOnDate(room);

            return (
              <div
                key={room._id}
                className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-rose-900"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <figure className="w-full sm:w-44 sm:min-w-44 h-56 sm:h-auto bg-gray-100">
                    <img
                      src={imageUrl}
                      alt={`Room ${room.roomNo || ""}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1566665797739-1674de7a421a";
                      }}
                    />
                  </figure>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Title + Status */}
                    <div className="flex justify-between items-start gap-3 mb-4">
                      <div>
                        <h2 className="text-lg font-bold text-rose-900">
                          Room {room.roomNo || "N/A"}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {room.variantName || room.baseRoomType || "Standard"}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          isAvailable
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {isAvailable ? "Available" : "Reserved"}
                      </span>
                    </div>

                    {/* Room Information */}
                    <div className="space-y-2 text-sm flex-1">
                      <p className="flex items-center gap-2">
                        <FaMoneyBillWave className="text-[#BF1E2E]" />
                        <span className="text-gray-500">Price:</span>{" "}
                        <span className="font-semibold text-gray-800">
                          ৳{Number(room.price || 0).toLocaleString()}
                        </span>
                      </p>

                      <p className="flex items-center gap-2">
                        <FaUsers className="text-[#BF1E2E]" />
                        <span className="text-gray-500">Occupancy:</span>{" "}
                        <span className="font-medium text-gray-800">
                          {room.maxOccupancy || "-"} Guests
                        </span>
                      </p>

                      {room.bedType && (
                        <p>
                          <span className="text-gray-500">Bed:</span>{" "}
                          <span className="font-medium text-gray-800">
                            {room.bedType}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Button */}
                    <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
                      {isAvailable ? (
                        <button
                          className="btn btn-sm h-10 bg-[#BF1E2E] hover:bg-rose-900 text-white border-none px-5"
                          onClick={() => {
                            if (mode === "reserve") {
                              navigate(`/dashboard/reservations/main-reserve`, {
                                state: {
                                  room: room,
                                  date: selectedDate,
                                },
                              });
                            } else {
                              navigate("/dashboard/check_in_out/check_in", {
                                state: { room },
                              });
                            }
                          }}
                        >
                          {mode === "reserve" ? "Reserve Now" : "Book Room"}
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm h-10 bg-gray-200 text-gray-500 border-none px-5 cursor-not-allowed"
                          disabled
                        >
                          Not Available
                        </button>
                      )}
                    </div>
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

export default AllRooms;
