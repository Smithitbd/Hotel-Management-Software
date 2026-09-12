import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import Swal from "sweetalert2";
import {
  FaArrowLeft,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import { MdHotel } from "react-icons/md";
import useAuth from "../../../../hooks/useAuth";
import useAxios from "../../../../hooks/useAxios";

const HotelInformation = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();

  const {
    data: hotel,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["hotel-by-email", user?.email],
    queryFn: async () => {
      const res = await axiosInstance.get("/hotels/by-email", {
        params: { email: user.email },
      });
      return res.data;
    },
    enabled: !!user?.email,
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    values: hotel
      ? {
          hotelName: hotel.hotelName || "",
          propertyType: hotel.propertyType || "Hotel",
          address: hotel.address || "",
          ownerName: hotel.ownerName || "",
          email: hotel.email || "",
          phone: hotel.phone || "",
        }
      : undefined,
  });

  const onSubmit = async (data) => {
    try {
      await axiosInstance.patch(`/hotels/${hotel._id}`, {
        hotelName: data.hotelName,
        propertyType: data.propertyType,
        address: data.address,
        ownerName: data.ownerName,
        email: data.email,
        phone: data.phone,
      });

      await refetch();

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Hotel information updated successfully",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-rose-700"></span>
      </div>
    );
  }

  if (isError || !hotel) {
    return (
      <div className="text-center py-32">
        <p className="text-red-500 font-medium">
          No hotel found for {user?.email}
        </p>
      </div>
    );
  }

  // Logo URL (change port if needed)
  const logoUrl = hotel.logo ? `http://localhost:3000${hotel.logo}` : null;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
            <MdHotel className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-rose-700">
              Hotel Information
            </h1>
            <p className="text-sm text-gray-500">Loaded with {user.email}</p>
          </div>
        </div>

        <Link
          to="/dashboard/settings"
          className="btn btn-circle bg-rose-700 hover:bg-[#BF1E2E] text-white border-none"
        >
          <FaArrowLeft />
        </Link>
      </div>

      {/* Hotel Summary Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Logo */}
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-rose-50 flex items-center justify-center shrink-0 border">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={hotel.hotelName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <span className="text-rose-700 font-bold text-xl">
                {hotel.hotelName?.charAt(0) || "H"}
              </span>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">
              {hotel.hotelName}
            </h2>
            <p className="text-sm text-gray-500">{hotel.propertyType}</p>
          </div>
          <span className="badge badge-success badge-lg">{hotel.status}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm">
          <p className="flex items-center gap-2 text-gray-600">
            <FaMapMarkerAlt className="text-rose-700" /> {hotel.address}
          </p>
          <p className="flex items-center gap-2 text-gray-600">
            <FaUser className="text-rose-700" /> {hotel.ownerName}
          </p>
          <p className="flex items-center gap-2 text-gray-600">
            <FaPhone className="text-rose-700" /> {hotel.phone}
          </p>
          <p className="flex items-center gap-2 text-gray-600">
            <FaEnvelope className="text-rose-700" /> {hotel.email}
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
      >
        <h3 className="text-lg font-bold text-rose-700 mb-6">Edit details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-medium">Hotel Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full bg-white"
              {...register("hotelName", { required: true })}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Property Type</span>
            </label>
            <select
              className="select select-bordered w-full bg-white"
              {...register("propertyType", { required: true })}
            >
              <option value="Hotel">Hotel</option>
              <option value="Resort">Resort</option>
              <option value="Motel">Motel</option>
              <option value="Guest House">Guest House</option>
              <option value="Boutique Hotel">Boutique Hotel</option>
              <option value="Apartment">Apartment</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Phone</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full bg-white"
              {...register("phone", { required: true })}
            />
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-medium">Address</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full bg-white"
              {...register("address", { required: true })}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Owner Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full bg-white"
              {...register("ownerName", { required: true })}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full bg-white"
              {...register("email", { required: true })}
              readOnly
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn bg-rose-700 hover:bg-[#BF1E2E] text-white border-none"
          >
            {isSubmitting ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelInformation;
