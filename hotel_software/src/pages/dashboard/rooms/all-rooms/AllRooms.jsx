import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../hooks/useAxios";
import { FaUsers, FaMoneyBillWave } from "react-icons/fa";
import { MdHotel } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router";
import useAuth from "../../../../hooks/useAuth";

const AllRooms = () => {
  const axiosInstance = useAxios();
  const imageBaseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();

  const mode = searchParams.get("mode"); // "reserve" or null
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
      // We use the same date as both arriving & departure
      // (because we only care about that single day)
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
      // Normal mode → use static status
      return room.roomStatus?.toLowerCase() === "available";
    }

    // Reserve mode → check against the availability API
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
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-900">
            <MdHotel className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-rose-900">
              {mode === "reserve" ? "Select Room to Reserve" : "All Rooms"}
            </h1>
            {mode === "reserve" && selectedDate && (
              <p className="text-sm text-gray-500">
                Selected Date:{" "}
                <span className="font-medium text-rose-900">
                  {selectedDate}
                </span>
              </p>
            )}
          </div>
        </div>

        {mode === "reserve" && (
          <button
            onClick={() => navigate("/dashboard/reservations")}
            className="btn btn-sm btn-outline border-rose-900 text-rose-900"
          >
            ← Back to Calendar
          </button>
        )}
      </div>

      <p className="mb-6 text-gray-500">
        {mode === "reserve"
          ? "Choose a room and click Reserve Now."
          : "Manage rooms and make bookings easily."}
      </p>

      {/* Room Count */}
      <div className="mb-8">
        <span className="inline-flex items-center rounded-full bg-red-100 px-4 py-1.5 text-sm font-medium text-[#BF1E2E]">
          {rooms.length} Rooms
        </span>
      </div>

      {/* No Rooms */}
      {rooms.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-md">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-rose-900">
              No Rooms Found
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              There are currently no rooms available.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#BF1E2E] hover:shadow-xl"
              >
                {/* Image */}
                <figure className="h-40 overflow-hidden bg-gray-100">
                  <img
                    src={imageUrl}
                    alt={`Room ${room.roomNo || ""}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1566665797739-1674de7a421a";
                    }}
                  />
                </figure>

                {/* Card Body */}
                <div className="p-4">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-base font-bold text-rose-900">
                        Room {room.roomNo || "N/A"}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {room.variantName || room.baseRoomType || "Standard"}
                      </p>
                    </div>

                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isAvailable ? "Available" : "Reserved"}
                    </span>
                  </div>

                  <div className="mb-4 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <FaMoneyBillWave className="text-[#BF1E2E]" />
                      <span className="font-semibold">৳{room.price}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-600">
                      <FaUsers className="text-[#BF1E2E]" />
                      <span>{room.maxOccupancy} Guests</span>
                    </div>
                  </div>

                  {/* Button */}
                  {isAvailable ? (
                    <button
                      className="w-full rounded-lg bg-[#BF1E2E] py-2 text-sm font-medium text-white transition hover:bg-rose-900"
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
                      className="w-full cursor-not-allowed rounded-lg bg-gray-200 py-2 text-sm font-medium text-gray-500"
                      disabled
                    >
                      Not Available
                    </button>
                  )}
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
