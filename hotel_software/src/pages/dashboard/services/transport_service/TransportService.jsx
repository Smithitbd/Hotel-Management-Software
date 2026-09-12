import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { FaCar } from "react-icons/fa";
import { RiHome3Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../../../hooks/useAxios";
import { MdWorkHistory } from "react-icons/md";

const TransportService = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const selectedRoom = watch("roomNumber");

  // Get current check-in guests
  const { data: checkIns = [], isLoading } = useQuery({
    queryKey: ["check-ins"],
    queryFn: async () => {
      const res = await axiosInstance.get("/check-in");
      return res.data;
    },
  });

  // Find selected guest/room
  const selectedCheckIn = checkIns.find(
    (checkIn) => checkIn.roomNumber === selectedRoom,
  );

  const onSubmit = async (data) => {
    if (!selectedCheckIn?._id) {
      Swal.fire({
        title: "Error",
        text: "Please select a valid room",
        icon: "error",
        confirmButtonColor: "#BF1E2E",
      });
      return;
    }

    const transportData = {
      ...data,
      checkinId: selectedCheckIn._id,
      guestName: selectedCheckIn.guestName || "",
      contactNumber: selectedCheckIn.contactNumber || "",
    };

    try {
      const res = await axiosInstance.post("/transport-service", transportData);

      if (res.data.insertedId) {
        Swal.fire({
          title: "Success!",
          text: "Transport service booking submitted successfully.",
          icon: "success",
          confirmButtonColor: "#BF1E2E",
        });
        navigate("/dashboard/services");
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Failed to submit transport booking",
        icon: "error",
        confirmButtonColor: "#BF1E2E",
      });
    }
  };

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <FaCar className="text-xl text-white" />
            </div>

            <h1 className="text-lg font-bold text-rose-700">
              Transport Service
            </h1>
          </div>

          <p className="text-gray-500 ml-12">
            Create a new transport service booking.
          </p>
        </div>

        <div className="flex flex-row gap-3">
          <Link to="/dashboard/services/transport_service/transport_service_history">
            <button
              type="button"
              className="flex items-center justify-center w-9 h-9 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
            >
              <MdWorkHistory className="text-xl" />
            </button>
          </Link>
          <Link to="/dashboard/services">
            <button
              type="button"
              className="flex items-center justify-center w-9 h-9 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
            >
              <RiHome3Line className="text-xl" />
            </button>
          </Link>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-2xl p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Room Number */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Room Number</span>
            </label>
            <select
              {...register("roomNumber", {
                required: "Room number is required",
              })}
              className="select select-bordered w-full bg-white"
              defaultValue=""
              disabled={isLoading}
            >
              <option value="" disabled>
                {isLoading ? "Loading rooms..." : "Select room number"}
              </option>
              {checkIns.map((checkIn) => (
                <option key={checkIn._id} value={checkIn.roomNumber}>
                  Room {checkIn.roomNumber}
                </option>
              ))}
            </select>
            {errors.roomNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.roomNumber.message}
              </p>
            )}
          </div>

          {/* Guest Name */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Guest Name</span>
            </label>
            <input
              type="text"
              value={selectedCheckIn?.guestName || ""}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Contact Number</span>
            </label>
            <input
              type="tel"
              value={selectedCheckIn?.contactNumber || ""}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>

          {/* Pickup Location */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Pickup Location</span>
            </label>
            <input
              type="text"
              placeholder="Enter pickup location"
              {...register("pickupLocation", {
                required: "Pickup location is required",
              })}
              className="input input-bordered w-full bg-white"
            />
            {errors.pickupLocation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.pickupLocation.message}
              </p>
            )}
          </div>

          {/* Destination */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Destination</span>
            </label>
            <input
              type="text"
              placeholder="Enter destination"
              {...register("destination", {
                required: "Destination is required",
              })}
              className="input input-bordered w-full bg-white"
            />
            {errors.destination && (
              <p className="text-red-500 text-sm mt-1">
                {errors.destination.message}
              </p>
            )}
          </div>

          {/* Pickup Date */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Pickup Date</span>
            </label>
            <input
              type="date"
              {...register("pickupDate", {
                required: "Pickup date is required",
              })}
              className="input input-bordered w-full bg-white"
            />
            {errors.pickupDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.pickupDate.message}
              </p>
            )}
          </div>

          {/* Pickup Time */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Pickup Time</span>
            </label>
            <input
              type="time"
              {...register("pickupTime", {
                required: "Pickup time is required",
              })}
              className="input input-bordered w-full bg-white"
            />
            {errors.pickupTime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.pickupTime.message}
              </p>
            )}
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Vehicle Type</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Sedan, SUV, Microbus"
              {...register("vehicleType", {
                required: "Vehicle type is required",
              })}
              className="input input-bordered w-full bg-white"
            />
            {errors.vehicleType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.vehicleType.message}
              </p>
            )}
          </div>

          {/* Driver Number */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Driver Number</span>
            </label>
            <input
              type="tel"
              placeholder="Enter driver contact number"
              {...register("driverNumber")}
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Fare ($) */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Fare ($)</span>
            </label>
            <input
              type="number"
              placeholder="Enter fare amount"
              {...register("fare", {
                valueAsNumber: true,
              })}
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Payment Status */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Payment Status</span>
            </label>
            <select
              {...register("paymentStatus", {
                required: "Payment status is required",
              })}
              className="select select-bordered w-full bg-white"
              defaultValue=""
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="Due">Due</option>
              <option value="Paid">Paid</option>
            </select>
            {errors.paymentStatus && (
              <p className="text-red-500 text-sm mt-1">
                {errors.paymentStatus.message}
              </p>
            )}
          </div>

          {/* Active Status */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Active Status</span>
            </label>
            <select
              {...register("active_status", {
                required: "Active status is required",
              })}
              className="select select-bordered w-full bg-white"
              defaultValue="active"
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="active">Active</option>
              <option value="left">Left</option>
            </select>
            {errors.active_status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.active_status.message}
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="reset"
            className="btn btn-outline border-[#BF1E2E] text-[#BF1E2E] hover:bg-[#BF1E2E] hover:text-white"
          >
            Reset
          </button>

          <button
            type="submit"
            className="btn bg-[#BF1E2E] text-white hover:bg-red-800 border-none px-8"
          >
            Submit Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransportService;
