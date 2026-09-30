import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../../hooks/useAxios";
import { FaUsers, FaMoneyBillWave, FaEdit, FaTrash } from "react-icons/fa";
import { MdHotel } from "react-icons/md";
import { RiHome3Line } from "react-icons/ri";
import { useNavigate, useSearchParams, Link } from "react-router";
import useUserStatus from "../../../../hooks/useUserStatus"; // adjust path if needed
import { useState, useMemo } from "react";
import Swal from "sweetalert2";

const AllRooms = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  const imageBaseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { hotelEmail, statusLoading } = useUserStatus();

  const [searchTerm, setSearchTerm] = useState("");
  const [variantFilter, setVariantFilter] = useState("");
  const [roomNoFilter, setRoomNoFilter] = useState("");

  const mode = searchParams.get("mode");
  const selectedDate = searchParams.get("date");

  // 1. Always fetch all rooms
  const {
    data: rooms = [],
    isLoading: roomsLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["all-rooms", hotelEmail],
    queryFn: async () => {
      const res = await axiosInstance.get("/rooms", {
        params: { hotelEmail },
      });
      return res.data;
    },
    enabled: !!hotelEmail,
  });

  // 2. When in reserve mode → check real availability
  const { data: availability, isLoading: availabilityLoading } = useQuery({
    queryKey: ["room-availability", selectedDate, hotelEmail],
    queryFn: async () => {
      const res = await axiosInstance.get("/rooms/available", {
        params: {
          arriving: selectedDate,
          departure: selectedDate,
          hotelEmail,
        },
      });
      return res.data;
    },
    enabled: mode === "reserve" && !!selectedDate && !!hotelEmail,
  });

  // Unique variant names for filter dropdown
  const variantNames = useMemo(() => {
    const names = [...new Set(rooms.map((r) => r.variantName).filter(Boolean))];
    return names.sort();
  }, [rooms]);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const term = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !term ||
        String(room.roomNo || "")
          .toLowerCase()
          .includes(term) ||
        (room.variantName || "").toLowerCase().includes(term) ||
        (room.baseRoomType || "").toLowerCase().includes(term) ||
        (room.bedType || "").toLowerCase().includes(term);

      const matchesVariant =
        !variantFilter || room.variantName === variantFilter;

      const matchesRoomNo =
        !roomNoFilter.trim() ||
        String(room.roomNo || "")
          .toLowerCase()
          .includes(roomNoFilter.toLowerCase().trim());

      return matchesSearch && matchesVariant && matchesRoomNo;
    });
  }, [rooms, searchTerm, variantFilter, roomNoFilter]);

  const isLoading =
    statusLoading ||
    roomsLoading ||
    (mode === "reserve" && availabilityLoading);

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

  // Delete room
  const handleDelete = async (room) => {
    const result = await Swal.fire({
      title: "Delete Room?",
      text: `Are you sure you want to delete Room ${room.roomNo}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#BF1E2E",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.delete(`/room-delete/${room._id}`);

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `Room ${room.roomNo} has been deleted.`,
        timer: 1500,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: ["all-rooms"] });
      refetch();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || "Failed to delete room",
      });
    }
  };

  if (statusLoading || isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-rose-900"></span>
      </div>
    );
  }

  if (!hotelEmail) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="text-amber-800">
            No hotel linked to this account. Please complete hotel registration.
          </p>
        </div>
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
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

      {/* Search + Filters */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-medium text-sm">Search</span>
            </label>
            <input
              type="text"
              placeholder="Search by room no, variant, bed type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full bg-white focus:outline-none focus:border-rose-900"
            />
          </div>

          {/* Variant Filter */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-medium text-sm">
                Room Variant
              </span>
            </label>
            <select
              value={variantFilter}
              onChange={(e) => setVariantFilter(e.target.value)}
              className="select select-bordered w-full bg-white focus:outline-none focus:border-rose-900"
            >
              <option value="">All Variants</option>
              {variantNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Room Number Filter */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-medium text-sm">
                Room Number
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. 201"
              value={roomNoFilter}
              onChange={(e) => setRoomNoFilter(e.target.value)}
              className="input input-bordered w-full bg-white focus:outline-none focus:border-rose-900"
            />
          </div>
        </div>

        {/* Clear filters */}
        {(searchTerm || variantFilter || roomNoFilter) && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {filteredRooms.length} of {rooms.length} rooms
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setVariantFilter("");
                setRoomNoFilter("");
              }}
              className="btn btn-sm btn-ghost text-rose-900"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Room Count */}
      <div className="mb-6">
        <span className="inline-flex items-center rounded-full bg-red-100 px-4 py-1.5 text-sm font-medium text-[#BF1E2E]">
          {filteredRooms.length} Rooms
        </span>
      </div>

      {/* No Rooms */}
      {filteredRooms.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <MdHotel className="text-2xl text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-rose-400 mb-2">
            No Rooms Found
          </h2>
          <p className="text-gray-500">
            {searchTerm || variantFilter || roomNoFilter
              ? "No rooms match your filters."
              : "There are currently no rooms available."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredRooms.map((room) => {
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
                  <figure className="w-full sm:w-44 sm:min-w-44 h-56 sm:h-auto bg-gray-100 relative">
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
                    {/* Title + Status + Edit/Delete */}
                    <div className="flex justify-between items-start gap-3 mb-4">
                      <div>
                        <h2 className="text-lg font-bold text-rose-900">
                          Room {room.roomNo || "N/A"}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {room.variantName || room.baseRoomType || "Standard"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            isAvailable
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isAvailable
                            ? "Available"
                            : room.roomStatus || "Reserved"}
                        </span>

                        {/* Edit & Delete - only in normal mode */}
                        {mode !== "reserve" && (
                          <div className="flex gap-1">
                            <button
                              onClick={() =>
                                navigate(`/dashboard/rooms/edit/${room._id}`)
                              }
                              className="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50"
                              title="Edit Room"
                            >
                              <FaEdit className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleDelete(room)}
                              className="btn btn-ghost btn-xs text-red-600 hover:bg-red-50"
                              title="Delete Room"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        )}
                      </div>
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
