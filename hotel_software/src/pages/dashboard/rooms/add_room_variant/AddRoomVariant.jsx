import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { FaLayerGroup, FaArrowLeft, FaSave } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxios from "../../../../hooks/useAxios";
import { RiHome3Line } from "react-icons/ri";

const AddRoomVariant = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      variantName: "",
      baseRoomType: "",
      price: "",
      maxOccupancy: "",
      bedType: "",
      amenities: "",
      description: "",
      image: "",
    },
  });

  const onSubmit = async (data) => {
    const imageFile = data.image?.[0];

    if (!imageFile) {
      Swal.fire({
        title: "Image Required",
        text: "Please select a room image.",
        icon: "warning",
        confirmButtonColor: "#9f1239",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("variantName", data.variantName);
    formData.append("baseRoomType", data.baseRoomType);
    formData.append("price", data.price);
    formData.append("maxOccupancy", data.maxOccupancy);
    formData.append("bedType", data.bedType || "");
    formData.append("amenities", data.amenities || "");
    formData.append("description", data.description || "");

    const res = await axiosInstance.post("/add-room-variant", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.insertedId) {
      await Swal.fire({
        title: "Success!",
        text: "Room variant added successfully.",
        icon: "success",
        confirmButtonColor: "#9f1239",
      });

      reset();
      navigate("/dashboard/rooms");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <FaLayerGroup className="text-xl text-white" />
            </div>

            <h1 className="text-lg font-bold text-rose-700">
              Add Room Variant
            </h1>
          </div>

          <Link to="/dashboard/rooms">
            <button
              type="button"
              className="flex items-center justify-center w-11 h-11 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
            >
              <RiHome3Line className="text-xl" />
            </button>
          </Link>
        </div>

        <p className="text-gray-500 ml-9">
          Create a new room variant with different configurations and pricing.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Image <span className="text-rose-700">*</span>
            </label>

            <input
              type="file"
              accept="image/*"
              {...register("image", {
                required: "Room image is required",
              })}
              className="file-input file-input-bordered w-full bg-white"
            />

            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Variant Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variant Name <span className="text-rose-700">*</span>
              </label>

              <input
                type="text"
                placeholder="e.g. Deluxe Sea View"
                {...register("variantName", {
                  required: "Variant name is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-700 focus:border-transparent"
              />

              {errors.variantName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.variantName.message}
                </p>
              )}
            </div>

            {/* Base Room Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Room Type <span className="text-rose-700">*</span>
              </label>

              <input
                type="text"
                placeholder="e.g. Deluxe"
                {...register("baseRoomType", {
                  required: "Base room type is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-700 focus:border-transparent"
              />

              {errors.baseRoomType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.baseRoomType.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (per night) <span className="text-rose-700">*</span>
              </label>

              <input
                type="number"
                placeholder="e.g. 550"
                min="0"
                {...register("price", {
                  required: "Price is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-700 focus:border-transparent"
              />

              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Max Occupancy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Occupancy <span className="text-rose-700">*</span>
              </label>

              <input
                type="number"
                placeholder="e.g. 2"
                min="1"
                {...register("maxOccupancy", {
                  required: "Max occupancy is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-700 focus:border-transparent"
              />

              {errors.maxOccupancy && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.maxOccupancy.message}
                </p>
              )}
            </div>

            {/* Bed Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bed Type
              </label>

              <input
                type="text"
                placeholder="e.g. King"
                {...register("bedType")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-700 focus:border-transparent"
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>

            <input
              type="text"
              placeholder="e.g. WiFi, AC, Mini Bar, Balcony"
              {...register("amenities")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>

            <textarea
              rows={4}
              placeholder="Write a short description of this room variant..."
              {...register("description")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-700 focus:border-transparent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Link
              to="/dashboard/rooms"
              className="flex items-center gap-2 px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <FaArrowLeft className="text-sm" />
              Cancel
            </Link>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg transition-colors border-none"
            >
              <FaSave className="text-sm" />
              Save Variant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomVariant;
