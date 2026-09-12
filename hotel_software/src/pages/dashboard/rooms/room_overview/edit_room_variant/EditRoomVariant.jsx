import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { RiHome3Line } from "react-icons/ri";
import Swal from "sweetalert2";
import useAxios from "../../../../../hooks/useAxios";

const EditRoomVariant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  const {
    data: variant,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["room-variant", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/room-variants/${id}`);
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
      variantName: variant?.variantName || "",
      baseRoomType: variant?.baseRoomType || "",
      price: variant?.price ?? "",
      maxOccupancy: variant?.maxOccupancy ?? "",
      bedType: variant?.bedType || "",
      amenities: variant?.amenities || "",
      description: variant?.description || "",
    },
  });

  const onSubmit = async (data) => {
    const imageFile = data.image?.[0];

    const formData = new FormData();
    formData.append("variantName", data.variantName);
    formData.append("baseRoomType", data.baseRoomType);
    formData.append("price", data.price);
    formData.append("maxOccupancy", data.maxOccupancy);
    formData.append("bedType", data.bedType || "");
    formData.append("amenities", data.amenities || "");
    formData.append("description", data.description || "");

    // Only send new image if user selected one
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await axiosInstance.patch(`/room-variants/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
      await Swal.fire({
        title: "Updated Successfully!",
        icon: "success",
        confirmButtonColor: "#BF1E2E",
      });

      navigate("/dashboard/rooms/room_overview");
    } else {
      Swal.fire({
        title: "No Changes Made",
        text: "The room variant information was not changed.",
        icon: "info",
        confirmButtonColor: "#BF1E2E",
      });
    }
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
      <div className="max-w-3xl mx-auto p-6">
        <div className="alert alert-error">
          <span>
            {error?.response?.data?.message ||
              error?.message ||
              "Failed to load room variant."}
          </span>
        </div>
      </div>
    );
  }

  if (!variant) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="alert alert-warning">
          <span>Room variant not found.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <RiHome3Line className="text-xl text-white" />
            </div>

            <h1 className="text-lg font-bold text-rose-800">
              Edit Room Variant
            </h1>
          </div>

          <p className="text-gray-500 mt-3 ml-16">
            Update the room variant information and pricing.
          </p>
        </div>

        <Link to="/dashboard/rooms/room_overview">
          <button className="flex items-center justify-center w-10 h-10 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors">
            <RiHome3Line className="text-2xl" />
          </button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card bg-white shadow-md border border-gray-100">
          <div className="card-body p-8 space-y-6">
            {/* Current Image Preview */}
            {variant.image && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Current Image</span>
                </label>

                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={`${axiosInstance.defaults.baseURL}${variant.image}`}
                    alt={variant.variantName}
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            )}

            {/* New Image Upload */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Change Image (optional)
                </span>
              </label>

              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="file-input file-input-bordered w-full bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Variant Name *</span>
                </label>

                <input
                  type="text"
                  placeholder="e.g. Deluxe Sea View"
                  {...register("variantName", {
                    required: "Variant name is required",
                  })}
                  className="input input-bordered w-full bg-white"
                />

                {errors.variantName && (
                  <p className="text-error text-sm mt-1">
                    {errors.variantName.message}
                  </p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Base Room Type *
                  </span>
                </label>

                <input
                  type="text"
                  placeholder="e.g. Deluxe"
                  {...register("baseRoomType", {
                    required: "Base room type is required",
                  })}
                  className="input input-bordered w-full bg-white"
                />

                {errors.baseRoomType && (
                  <p className="text-error text-sm mt-1">
                    {errors.baseRoomType.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Price (per night) *
                  </span>
                </label>

                <input
                  type="number"
                  placeholder="e.g. 150"
                  {...register("price", {
                    required: "Price is required",
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Price cannot be negative",
                    },
                  })}
                  className="input input-bordered w-full bg-white"
                />

                {errors.price && (
                  <p className="text-error text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Max Occupancy *
                  </span>
                </label>

                <input
                  type="number"
                  placeholder="e.g. 2"
                  {...register("maxOccupancy", {
                    required: "Max occupancy is required",
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Minimum occupancy is 1",
                    },
                  })}
                  className="input input-bordered w-full bg-white"
                />

                {errors.maxOccupancy && (
                  <p className="text-error text-sm mt-1">
                    {errors.maxOccupancy.message}
                  </p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Bed Type</span>
                </label>

                <input
                  type="text"
                  placeholder="e.g. King"
                  {...register("bedType")}
                  className="input input-bordered w-full bg-white"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Amenities</span>
              </label>

              <input
                type="text"
                placeholder="e.g. WiFi, AC, Mini Bar, Balcony"
                {...register("amenities")}
                className="input input-bordered w-full bg-white"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Description</span>
              </label>

              <textarea
                rows="4"
                placeholder="Describe the room variant..."
                {...register("description")}
                className="textarea textarea-bordered w-full bg-white"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-5">
              <Link to="/dashboard/rooms/room_overview">
                <button
                  type="button"
                  className="btn btn-outline border-gray-400 text-gray-600 hover:bg-gray-600 hover:text-white"
                >
                  Cancel
                </button>
              </Link>

              <button
                type="submit"
                className="btn bg-rose-800 hover:bg-rose-900 text-white border-none px-10"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditRoomVariant;
