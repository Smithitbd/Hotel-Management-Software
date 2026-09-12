import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../../hooks/useAxios";
import { RiHome3Line } from "react-icons/ri";
import { LuNetwork } from "react-icons/lu";
import Swal from "sweetalert2";

const EditMaintenance = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const {
    data: room,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["maintenance-room", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/rooms/maintenance/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: {
      roomStatus: room?.roomStatus || "Maintenance",
      workBegins: room?.workBegins || "",
      workEnds: room?.workEnds || "",
      assignedPerson: room?.assignedPerson || "",
      assignedPersonNumber: room?.assignedPersonNumber || "",
      maintenanceCost: room?.maintenanceCost ?? "",
      correctives: room?.correctives || "",
    },
  });

  const onSubmit = async (data) => {
    const res = await axiosInstance.patch(
      `/edit-maintenance-history/${id}`,
      data,
    );

    if (res.data.room_res?.modifiedCount > 0) {
      await Swal.fire({
        title: "Updated Successfully!",
        icon: "success",
        confirmButtonColor: "#9f1239",
      });

      navigate("/dashboard/rooms/maintenance");
    } else {
      Swal.fire({
        title: "No Changes Made",
        text: "The room information was not changed.",
        icon: "info",
        confirmButtonColor: "#9f1239",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-96 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-rose-700"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="alert alert-error">
          <span>{error?.message || "Failed to load room."}</span>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="alert alert-warning">
          <span>Room not found.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <LuNetwork className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-rose-700">
                Edit Room Maintenance
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Room #{room.roomNo} — {room.variantName}
              </p>
            </div>
          </div>

          <Link to="/dashboard/rooms/maintenance">
            <button className="flex items-center justify-center w-11 h-11 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors">
              <RiHome3Line className="text-xl" />
            </button>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Room Image */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <img
            src={
              room.image
                ? `${axiosInstance.defaults.baseURL}${room.image}`
                : "https://via.placeholder.com/800x400?text=No+Image"
            }
            alt={room.variantName}
            className="w-full h-72 object-cover"
          />
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 space-y-6">
          {/* Room Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Status <span className="text-rose-700">*</span>
            </label>
            <select
              {...register("roomStatus", {
                required: "Room status is required",
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-700 focus:border-transparent bg-white"
            >
              <option value="Maintenance">Maintenance</option>
              <option value="In Progress">In Progress</option>
              <option value="Available">Available</option>
            </select>
            {errors.roomStatus && (
              <p className="text-red-500 text-sm mt-1">
                {errors.roomStatus.message}
              </p>
            )}
          </div>

          {/* Work Begins & Ends */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Begins <span className="text-rose-700">*</span>
              </label>
              <input
                type="datetime-local"
                {...register("workBegins", {
                  required: "Work begins is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-700 focus:border-transparent"
              />
              {errors.workBegins && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.workBegins.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Ends <span className="text-rose-700">*</span>
              </label>
              <input
                type="datetime-local"
                {...register("workEnds", {
                  required: "Work ends is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-700 focus:border-transparent"
              />
              {errors.workEnds && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.workEnds.message}
                </p>
              )}
            </div>
          </div>

          {/* Assigned Person & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Person <span className="text-rose-700">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter name"
                {...register("assignedPerson", {
                  required: "Assigned person is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-700 focus:border-transparent"
              />
              {errors.assignedPerson && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.assignedPerson.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Person Number <span className="text-rose-700">*</span>
              </label>
              <input
                type="tel"
                placeholder="Enter phone number"
                {...register("assignedPersonNumber", {
                  required: "Phone number is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-700 focus:border-transparent"
              />
              {errors.assignedPersonNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.assignedPersonNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Maintenance Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maintenance Cost <span className="text-rose-700">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter cost"
              min="0"
              {...register("maintenanceCost", {
                required: "Maintenance cost is required",
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Cost cannot be negative",
                },
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-700 focus:border-transparent"
            />
            {errors.maintenanceCost && (
              <p className="text-red-500 text-sm mt-1">
                {errors.maintenanceCost.message}
              </p>
            )}
          </div>

          {/* Correctives */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correctives
            </label>
            <input
              type="text"
              placeholder="Enter corrective action"
              {...register("correctives")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-700 focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Link to="/dashboard/rooms/maintenance">
              <button
                type="button"
                className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </Link>

            <button
              type="submit"
              className="px-6 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg transition-colors border-none"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditMaintenance;
