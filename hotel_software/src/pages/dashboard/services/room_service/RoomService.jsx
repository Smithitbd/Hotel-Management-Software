import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { MdRoomService, MdWorkHistory } from "react-icons/md";
import { RiHome3Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router";
import useAxios from "../../../../hooks/useAxios";
import Swal from "sweetalert2";

const RoomService = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const selectedRoom = watch("roomNumber");

  const { data: checkIns = [], isLoading } = useQuery({
    queryKey: ["check-ins"],
    queryFn: async () => {
      const res = await axiosInstance.get("/check-in");
      return res.data;
    },
  });

  const selectedCheckIn = checkIns.find(
    (checkIn) => checkIn.roomNumber === selectedRoom,
  );

  const onSubmit = async (data) => {
    const serviceData = {
      ...data,
      checkinId: selectedCheckIn?._id || "",
      roomVariantName: selectedCheckIn?.roomVariantName || "",
      nidNumber: selectedCheckIn?.nidNumber || "",
      orderedBy: selectedCheckIn?.guestName || "",
    };

    const res = await axiosInstance.post("/room-service", serviceData);

    if (res.data.insertedId) {
      await Swal.fire({
        title: "Success!",
        text: "Room service request submitted successfully.",
        icon: "success",
        confirmButtonColor: "#BF1E2E",
      });
      navigate("/dashboard/services");
    }
  };

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <MdRoomService className="text-xl text-white" />
            </div>
            <h1 className="text-lg font-bold text-rose-700">
              Room Service Request
            </h1>
          </div>
          <p className="text-gray-500 ml-12">
            Create a new room service request.
          </p>
        </div>

        <div className="flex flex-row gap-3">
          <Link to="/dashboard/services/room_service/room_service_history">
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

          {/* Room Variant Name */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Room Variant Name</span>
            </label>
            <input
              type="text"
              value={selectedCheckIn?.roomVariantName || ""}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>

          {/* NID Number */}
          <div>
            <label className="label">
              <span className="label-text font-medium">NID Number</span>
            </label>
            <input
              type="text"
              value={selectedCheckIn?.nidNumber || ""}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>

          {/* Ordered By */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Ordered By</span>
            </label>
            <input
              type="text"
              value={selectedCheckIn?.guestName || ""}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>

          {/* Service Requested */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Service Requested</span>
            </label>
            <select
              {...register("serviceRequested", {
                required: "Service is required",
              })}
              className="select select-bordered w-full bg-white"
              defaultValue=""
            >
              <option value="" disabled>
                Select service
              </option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Room Cleaning">Room Cleaning</option>
              <option value="Other">Other</option>
            </select>
            {errors.serviceRequested && (
              <p className="text-red-500 text-sm mt-1">
                {errors.serviceRequested.message}
              </p>
            )}
          </div>

          {/* Service Date */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Service Date</span>
            </label>
            <input
              type="date"
              {...register("serviceDate", {
                required: "Service date is required",
              })}
              className="input input-bordered w-full bg-white"
            />
            {errors.serviceDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.serviceDate.message}
              </p>
            )}
          </div>

          {/* Service Time */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Service Time</span>
            </label>
            <input
              type="time"
              {...register("serviceTime", {
                required: "Service time is required",
              })}
              className="input input-bordered w-full bg-white"
            />
            {errors.serviceTime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.serviceTime.message}
              </p>
            )}
          </div>

          {/* Assigned Staff */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Assigned Staff</span>
            </label>
            <input
              type="text"
              {...register("assignedStaff")}
              className="input input-bordered w-full bg-white"
            />
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

        {/* Special Instructions */}
        <div className="mt-6">
          <label className="label">
            <span className="label-text font-medium">Special Instructions</span>
          </label>
          <textarea
            rows="4"
            {...register("specialInstructions")}
            className="textarea textarea-bordered w-full bg-white"
          ></textarea>
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
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomService;
