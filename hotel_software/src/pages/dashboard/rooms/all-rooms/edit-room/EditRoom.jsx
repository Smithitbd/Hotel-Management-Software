import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { RiHome3Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import useAxios from "../../../../../hooks/useAxios";
import useAuth from "../../../../../hooks/useAuth";

const EditRoom = () => {
  const axiosInstance = useAxios();
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading } = useAuth();

  const imageBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Fetch room data
  const {
    data: room,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["room", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/rooms/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Form — uses `values` so it auto-fills when room data arrives (no useEffect)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    values: room
      ? {
          roomNo: room.roomNo || "",
          roomStatus: room.roomStatus || "Available",
          assignedPerson: room.assignedPerson || "",
          assignedPersonNumber: room.assignedPersonNumber || "",
          maintenanceCost: room.maintenanceCost || "",
          correctives: room.correctives || "",
          workBegins: room.workBegins || "",
          workEnds: room.workEnds || "",
        }
      : undefined,
  });

  const onSubmit = async (data) => {
    try {
      const updateData = {
        roomNo: data.roomNo,
        roomStatus: data.roomStatus,
        assignedPerson: data.assignedPerson || "",
        assignedPersonNumber: data.assignedPersonNumber || "",
        maintenanceCost: data.maintenanceCost || "",
        correctives: data.correctives || "",
        workBegins: data.workBegins || "",
        workEnds: data.workEnds || "",
      };

      const res = await axiosInstance.patch(`/rooms/${id}`, updateData);

      if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
        await Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Room updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/dashboard/rooms/all-rooms");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Failed to update room",
        confirmButtonColor: "#9f1239",
      });
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-96 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-rose-900"></span>
      </div>
    );
  }

  if (isError || !room) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="alert alert-error">
          <span>Failed to load room information.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between gap-3 mb-2">
          <div className="flex flex-row gap-4 items-center">
            <MdOutlineEdit className="bg-rose-900 h-10 w-10 text-white p-2 rounded-full" />
            <div>
              <h1 className="text-lg font-bold text-rose-900">Edit Room</h1>
              <p className="text-sm text-gray-500">
                Room {room.roomNo} — {room.variantName}
              </p>
            </div>
          </div>
          <Link to="/dashboard/rooms/all-rooms">
            <button className="flex items-center justify-center w-11 h-11 border border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white rounded-lg transition-colors">
              <RiHome3Line className="text-xl" />
            </button>
          </Link>
        </div>
      </div>

      {/* Variant Info (read-only) */}
      <div className="card shadow-xl mb-8 bg-white">
        <div className="card-body">
          <h2 className="card-title text-xl text-rose-900 mb-5">
            Room Variant Information
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              {room.image ? (
                <img
                  src={`${imageBaseUrl}${room.image}`}
                  alt={room.variantName}
                  className="w-full h-64 object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-sm text-gray-500">Variant Name</p>
                <p className="font-semibold text-lg">{room.variantName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Base Room Type</p>
                <p className="font-semibold">{room.baseRoomType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-semibold">৳{room.price}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Max Occupancy</p>
                <p className="font-semibold">{room.maxOccupancy} Persons</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bed Type</p>
                <p className="font-semibold">{room.bedType || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amenities</p>
                <p className="font-semibold">{room.amenities || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editable Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card shadow-xl bg-white"
      >
        <div className="card-body">
          <h2 className="card-title text-xl text-rose-900 mb-6">
            Room Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Room Number */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Room No</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full bg-white"
                {...register("roomNo", {
                  required: "Room number is required",
                })}
              />
              {errors.roomNo && (
                <p className="text-error text-sm mt-1">
                  {errors.roomNo.message}
                </p>
              )}
            </div>

            {/* Room Status */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Room Status</span>
              </label>
              <select
                className="select select-bordered w-full bg-white"
                {...register("roomStatus", {
                  required: "Room status is required",
                })}
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Reserved">Reserved</option>
                <option value="Maintenance">Maintenance</option>
                <option value="In Progress">In Progress</option>
              </select>
              {errors.roomStatus && (
                <p className="text-error text-sm mt-1">
                  {errors.roomStatus.message}
                </p>
              )}
            </div>

            {/* Assigned Person */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Assigned Person
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter name"
                className="input input-bordered w-full bg-white"
                {...register("assignedPerson")}
              />
            </div>

            {/* Assigned Person Number */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Assigned Person Number
                </span>
              </label>
              <input
                type="tel"
                placeholder="Enter phone"
                className="input input-bordered w-full bg-white"
                {...register("assignedPersonNumber")}
              />
            </div>

            {/* Maintenance Cost */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Maintenance Cost
                </span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                className="input input-bordered w-full bg-white"
                {...register("maintenanceCost", { valueAsNumber: true })}
              />
            </div>

            {/* Correctives */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Correctives</span>
              </label>
              <input
                type="text"
                placeholder="Enter corrective action"
                className="input input-bordered w-full bg-white"
                {...register("correctives")}
              />
            </div>

            {/* Work Begins */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Work Begins</span>
              </label>
              <input
                type="datetime-local"
                className="input input-bordered w-full bg-white"
                {...register("workBegins")}
              />
            </div>

            {/* Work Ends */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Work Ends</span>
              </label>
              <input
                type="datetime-local"
                className="input input-bordered w-full bg-white"
                {...register("workEnds")}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-rose-900 hover:bg-rose-800 text-white border-none"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Updating...
                </>
              ) : (
                "Update Room"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditRoom;
