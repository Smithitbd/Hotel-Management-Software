import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxios from "../../../hooks/useAxios";
import { LuBookImage } from "react-icons/lu";
import useAuth from "../../../hooks/useAuth";

const MainReserve = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user, loading } = useAuth();
  if (loading) {
    return <span className="loading loading-spinner text-error"></span>;
  }
  // Get data from previous page
  const room = location.state?.room || null;
  const selectedDate = searchParams.get("date") || location.state?.date || "";

  // Same base URL as your axiosInstance
  const imageBaseURL = "http://localhost:3000";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      guestName: "",
      contactNumber: "",
      month: selectedDate
        ? selectedDate.slice(0, 7)
        : new Date().toISOString().slice(0, 7),
      arrivingDate: selectedDate || "",
      departureDate: "",
    },
  });

  const arrivingDate = watch("arrivingDate");
  const departureDate = watch("departureDate");

  // Check availability when dates change
  const { data: availability, isFetching } = useQuery({
    queryKey: ["check-availability", arrivingDate, departureDate, room?._id],
    queryFn: async () => {
      if (!arrivingDate || !departureDate || !room) return null;
      const res = await axiosInstance.get("/rooms/available", {
        params: {
          arriving: arrivingDate,
          departure: departureDate,
          hotelEmail: user.email,
        },
      });
      return res.data;
    },
    enabled: !!arrivingDate && !!departureDate && !!room,
  });

  const isRoomAvailable = () => {
    if (!availability || !room) return true;
    const allAvailableRooms =
      availability.variants?.flatMap((v) => v.rooms) || [];
    return allAvailableRooms.some(
      (r) => r._id === room._id || r.roomNo === room.roomNo,
    );
  };

  const onSubmit = async (data) => {
    if (!room) {
      Swal.fire("Error", "No room selected", "error");
      return;
    }

    if (data.departureDate <= data.arrivingDate) {
      Swal.fire({
        title: "Invalid Dates",
        text: "Departure date must be after arriving date",
        icon: "warning",
        confirmButtonColor: "#BF1E2E",
      });
      return;
    }

    if (!isRoomAvailable()) {
      Swal.fire({
        title: "Room Not Available",
        text: "This room is already reserved or occupied for the selected dates.",
        icon: "error",
        confirmButtonColor: "#BF1E2E",
      });
      return;
    }

    const reservationData = {
      hotelEmail: user.email,
      guestName: data.guestName,
      contactNumber: data.contactNumber,
      arrivingDate: data.arrivingDate,
      departureDate: data.departureDate,
      room: {
        _id: room._id,
        roomNo: room.roomNo,
        variantName: room.variantName,
        baseRoomType: room.baseRoomType,
        price: room.price,
        maxOccupancy: room.maxOccupancy,
        bedType: room.bedType,
        amenities: room.amenities,
        image: room.image,
        roomStatus: "Reserved",
      },
      status: "Reserved",
    };

    try {
      const res = await axiosInstance.post("/reservations", reservationData);

      if (res.data.insertedId) {
        Swal.fire({
          title: "Success!",
          text: `Room ${room.roomNo} reserved for ${data.guestName}`,
          icon: "success",
          confirmButtonColor: "#BF1E2E",
        }).then(() => {
          navigate("/dashboard/reservations");
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: error.response?.data?.message || "Could not create reservation",
        icon: "error",
        confirmButtonColor: "#BF1E2E",
      });
    }
  };

  // Image URL builder
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://images.unsplash.com/photo-1566665797739-1674de7a421a";
    }
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    return `${imageBaseURL}${imagePath}`;
  };

  if (!room) {
    return (
      <div className="p-10 text-center">
        <p className="text-xl text-gray-500">No room selected.</p>
        <button
          onClick={() => navigate("/dashboard/reservations")}
          className="btn bg-rose-900 text-white mt-4"
        >
          Back to Calendar
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-rose-900 flex items-center justify-center">
          <LuBookImage className="text-xl text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-rose-900">
            Complete Reservation
          </h1>
          <p className="text-gray-500">
            Room {room.roomNo} • {room.variantName}
          </p>
        </div>
      </div>

      {/* Selected Room Card */}
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 mb-8 flex gap-5 items-center">
        <img
          src={getImageUrl(room.image)}
          alt={room.variantName || "Room"}
          className="w-24 h-24 object-cover rounded-xl border border-rose-200"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1566665797739-1674de7a421a";
          }}
        />
        <div>
          <h3 className="font-bold text-lg text-rose-900">
            {room.variantName || room.baseRoomType}
          </h3>
          <p className="text-sm text-gray-600">
            {room.bedType} • Max {room.maxOccupancy} guests
          </p>
          <p className="text-xl font-bold text-rose-900 mt-1">
            ৳{Number(room.price || 0).toLocaleString()} / night
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-xl rounded-2xl p-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Guest Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Guest Name *</span>
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              className="input input-bordered w-full bg-white"
              {...register("guestName", { required: "Guest name is required" })}
            />
            {errors.guestName && (
              <p className="text-error text-sm mt-1">
                {errors.guestName.message}
              </p>
            )}
          </div>

          {/* Contact Number */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Contact Number *</span>
            </label>
            <input
              type="tel"
              placeholder="01XXXXXXXXX"
              className="input input-bordered w-full bg-white"
              {...register("contactNumber", {
                required: "Contact number is required",
              })}
            />
            {errors.contactNumber && (
              <p className="text-error text-sm mt-1">
                {errors.contactNumber.message}
              </p>
            )}
          </div>

          {/* Month */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Month</span>
            </label>
            <input
              type="month"
              className="input input-bordered w-full bg-white"
              {...register("month")}
            />
          </div>

          {/* Arriving Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Arriving Date *</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full bg-white"
              {...register("arrivingDate", {
                required: "Arriving date is required",
              })}
            />
            {errors.arrivingDate && (
              <p className="text-error text-sm mt-1">
                {errors.arrivingDate.message}
              </p>
            )}
          </div>

          {/* Departure Date */}
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-medium">Departure Date *</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full bg-white"
              {...register("departureDate", {
                required: "Departure date is required",
              })}
            />
            {errors.departureDate && (
              <p className="text-error text-sm mt-1">
                {errors.departureDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Availability Status */}
        {arrivingDate && departureDate && (
          <div className="alert shadow-sm">
            {isFetching ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : isRoomAvailable() ? (
              <span className="text-success font-medium">
                ✓ Room is available for these dates
              </span>
            ) : (
              <span className="text-error font-medium">
                ✗ This room is already reserved for the selected period
              </span>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-outline border-rose-900 text-rose-900"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={
              isSubmitting ||
              (arrivingDate && departureDate && !isRoomAvailable())
            }
            className="btn bg-[#BF1E2E] text-white hover:bg-red-800 border-none px-8"
          >
            {isSubmitting ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Confirm Reservation"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MainReserve;
