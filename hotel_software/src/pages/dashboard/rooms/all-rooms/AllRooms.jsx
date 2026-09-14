import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../hooks/useAxios";
import { FaUsers, FaMoneyBillWave } from "react-icons/fa";
import { MdHotel } from "react-icons/md";
import { useNavigate } from "react-router";

const AllRooms = () => {
  const axiosInstance = useAxios();
  const imageBaseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const navigate = useNavigate();
  const {
    data: rooms = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["all-rooms"],
    queryFn: async () => {
      const res = await axiosInstance.get("/rooms");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-rose-700"></span>
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
            className="rounded-lg bg-[#BF1E2E] px-5 py-2 text-sm font-medium text-white transition hover:bg-rose-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-700">
          <MdHotel className="text-xl text-white" />
        </div>
        <h1 className="text-lg font-bold text-rose-700">All Rooms</h1>
      </div>

      <p className="mb-6 text-gray-500">
        Manage rooms and make bookings easily.
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
            <h2 className="text-xl font-semibold text-rose-700">
              No Rooms Found
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              There are currently no rooms available.
            </p>
          </div>
        </div>
      ) : (
        /* Compact Rooms Grid */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => {
            const imageUrl = room.image
              ? room.image.startsWith("http")
                ? room.image
                : `${imageBaseURL}${room.image}`
              : "https://images.unsplash.com/photo-1566665797739-1674de7a421a";

            return (
              <div
                key={room._id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#BF1E2E] hover:shadow-xl"
              >
                {/* Smaller Image */}
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

                {/* Compact Card Body */}
                <div className="p-4">
                  {/* Room Number + Status */}
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-base font-bold text-rose-700">
                        Room {room.roomNo || "N/A"}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {room.variantName || room.baseRoomType || "Standard"}
                      </p>
                    </div>

                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        room.roomStatus?.toLowerCase() === "available"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {room.roomStatus || "Unknown"}
                    </span>
                  </div>

                  {/* Only Price + Capacity */}
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
                  {room.roomStatus?.toLowerCase() === "available" ? (
                    <button
                      className="w-full rounded-lg bg-[#BF1E2E] py-2 text-sm font-medium text-white transition hover:bg-rose-800"
                      onClick={() => {
                        navigate("/dashboard/check_in_out/check_in", {
                          state: {
                            room: room, // full room object
                          },
                        });
                      }}
                    >
                      Book Room
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
