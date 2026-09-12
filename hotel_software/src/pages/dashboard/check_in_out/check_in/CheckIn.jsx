import { useForm } from "react-hook-form";
import { MdOutlinePlaylistAddCheckCircle } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../hooks/useAxios";
import Swal from "sweetalert2";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const CheckIn = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      advancePayment: 0,
    },
  });

  const selectedVariantId = watch("roomVariant");
  const checkInDate = watch("checkInDate");
  const checkOutDate = watch("checkOutDate");
  const advancePayment = watch("advancePayment");

  // Get all room variants
  const { data: roomVariants = [], isLoading: variantsLoading } = useQuery({
    queryKey: ["room-variants"],
    queryFn: async () => {
      const res = await axiosInstance.get("/room-variants");
      return res.data;
    },
  });

  // Get rooms of selected variant
  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ["rooms-by-variant", selectedVariantId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/rooms/variant/${selectedVariantId}`,
      );
      return res.data;
    },
    enabled: !!selectedVariantId,
  });

  // Selected variant object
  const selectedVariant = roomVariants.find((v) => v._id === selectedVariantId);

  // Calculate number of nights
  let nights = 0;
  if (checkInDate && checkOutDate) {
    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);
    const diffTime = outDate - inDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    nights = diffDays > 0 ? diffDays : 0;
  }

  // Calculate total amount
  const totalAmount =
    selectedVariant && nights > 0 ? selectedVariant.price * nights : 0;

  // Calculate due amount
  const advance = Number(advancePayment) || 0;
  const dueAmount = totalAmount - advance >= 0 ? totalAmount - advance : 0;

  const onSubmit = async (data) => {
    const nidImageFile = data.nidImage?.[0];
    const personImageFile = data.personImage?.[0];

    if (!nidImageFile || !personImageFile) {
      Swal.fire({
        title: "Images Required",
        text: "Please upload both NID image and Person image.",
        icon: "warning",
        confirmButtonColor: "#9f1239",
      });
      return;
    }

    const formData = new FormData();

    // Guest Info
    formData.append("guestName", data.guestName);
    formData.append("guestAddress", data.guestAddress);
    formData.append("contactNumber", data.contactNumber);
    formData.append("designation", data.designation);
    formData.append("nidNumber", data.nidNumber || "");

    // Images
    formData.append("nidImage", nidImageFile);
    formData.append("personImage", personImageFile);

    // Room Info
    formData.append("roomVariantId", data.roomVariant);
    formData.append("roomVariantName", selectedVariant?.variantName || "");
    formData.append("roomNumber", data.roomNumber);
    formData.append("pricePerNight", selectedVariant?.price || 0);

    // Stay Info
    formData.append("checkInDate", data.checkInDate);
    formData.append("checkInTime", data.checkInTime);
    formData.append("checkOutDate", data.checkOutDate);
    formData.append("numberOfNights", nights);
    formData.append("numberOfGuests", data.numberOfGuests);

    // Payment Info
    formData.append("totalAmount", totalAmount);
    formData.append("advancePayment", Number(data.advancePayment) || 0);
    formData.append("dueAmount", dueAmount);

    formData.append("specialRequests", data.specialRequests || "");
    formData.append("status", "Normal");

    const res = await axiosInstance.post("/check-in", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.insertedId) {
      await Swal.fire({
        title: "Success!",
        text: "Guest checked in successfully.",
        icon: "success",
        confirmButtonColor: "#9f1239",
      });

      navigate("/dashboard/check_in_out");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
                <MdOutlinePlaylistAddCheckCircle className="text-xl text-white" />
              </div>

              <h1 className="text-lg font-bold text-rose-700">
                Guest Check In
              </h1>
            </div>

            <p className="text-gray-500 ml-12">
              Manage guest check-ins, room assignments, and stay details.
            </p>
          </div>

          <Link to="/dashboard/check_in_out">
            <button
              type="button"
              className="flex items-center justify-center w-9 h-9 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
              title="Back to Dashboard"
            >
              <IoArrowBackCircleSharp className="text-3xl" />
            </button>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Guest Name */}
          <div>
            <label className="label">
              <span className="label-text">Guest Name</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              {...register("guestName", {
                required: "Guest name is required",
              })}
              className="bg-white input input-bordered w-full"
            />
            {errors.guestName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.guestName.message}
              </p>
            )}
          </div>

          {/* Guest Address */}
          <div>
            <label className="label">
              <span className="label-text">Guest Address</span>
            </label>
            <input
              type="text"
              placeholder="Enter guest address"
              {...register("guestAddress", {
                required: "Guest address is required",
              })}
              className="bg-white input input-bordered w-full"
            />
            {errors.guestAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.guestAddress.message}
              </p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className="label">
              <span className="label-text">Contact Number</span>
            </label>
            <input
              type="tel"
              placeholder="017XXXXXXXX"
              {...register("contactNumber", {
                required: "Contact number is required",
              })}
              className="bg-white input input-bordered w-full"
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contactNumber.message}
              </p>
            )}
          </div>

          {/* Guest Designation */}
          <div>
            <label className="label">
              <span className="label-text">Guest Designation</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Manager, Student, Businessman"
              {...register("designation", {
                required: "Designation is required",
              })}
              className="bg-white input input-bordered w-full"
            />
            {errors.designation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.designation.message}
              </p>
            )}
          </div>

          {/* NID Number */}
          <div>
            <label className="label">
              <span className="label-text">NID Number</span>
            </label>
            <input
              type="text"
              placeholder="Enter National ID Number"
              {...register("nidNumber")}
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* NID Image */}
          <div>
            <label className="label">
              <span className="label-text">NID Image</span>
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("nidImage", {
                required: "NID image is required",
              })}
              className="file-input file-input-bordered w-full bg-white"
            />
            {errors.nidImage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nidImage.message}
              </p>
            )}
          </div>

          {/* Person Image */}
          <div>
            <label className="label">
              <span className="label-text">Person Image</span>
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("personImage", {
                required: "Person image is required",
              })}
              className="file-input file-input-bordered w-full bg-white"
            />
            {errors.personImage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.personImage.message}
              </p>
            )}
          </div>

          {/* Room Variant */}
          <div>
            <label className="label">
              <span className="label-text">Room Variant</span>
            </label>
            <select
              {...register("roomVariant", {
                required: "Room variant is required",
              })}
              className="select select-bordered w-full bg-white"
              defaultValue=""
            >
              <option value="" disabled>
                {variantsLoading
                  ? "Loading room variants..."
                  : "Select room variant"}
              </option>
              {roomVariants.map((variant) => (
                <option key={variant._id} value={variant._id}>
                  {variant.variantName} — ৳{variant.price}/night
                </option>
              ))}
            </select>
            {errors.roomVariant && (
              <p className="text-red-500 text-sm mt-1">
                {errors.roomVariant.message}
              </p>
            )}
          </div>

          {/* Room Number */}
          <div>
            <label className="label">
              <span className="label-text">Room Number</span>
            </label>
            <select
              {...register("roomNumber", {
                required: "Room number is required",
              })}
              className="select select-bordered w-full bg-white"
              defaultValue=""
              disabled={!selectedVariantId || roomsLoading}
            >
              <option value="" disabled>
                {!selectedVariantId
                  ? "Select room variant first"
                  : roomsLoading
                    ? "Loading rooms..."
                    : "Select room number"}
              </option>
              {rooms
                .filter((room) => room.roomStatus === "Available")
                .map((room) => (
                  <option key={room._id} value={room.roomNo}>
                    Room {room.roomNo}
                  </option>
                ))}
            </select>
            {errors.roomNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.roomNumber.message}
              </p>
            )}
          </div>

          {/* Check In Date */}
          <div>
            <label className="label">
              <span className="label-text">Check In Date</span>
            </label>
            <input
              type="date"
              {...register("checkInDate", {
                required: "Check in date is required",
              })}
              className="bg-white input input-bordered w-full"
            />
            {errors.checkInDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.checkInDate.message}
              </p>
            )}
          </div>

          {/* Check Out Date */}
          <div>
            <label className="label">
              <span className="label-text">Check Out Date</span>
            </label>
            <input
              type="date"
              {...register("checkOutDate", {
                required: "Check out date is required",
              })}
              className="bg-white input input-bordered w-full"
            />
            {errors.checkOutDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.checkOutDate.message}
              </p>
            )}
          </div>

          {/* Check In Time */}
          <div>
            <label className="label">
              <span className="label-text">Check In Time</span>
            </label>
            <input
              type="time"
              {...register("checkInTime", {
                required: "Check in time is required",
              })}
              className="bg-white input input-bordered w-full"
            />
            {errors.checkInTime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.checkInTime.message}
              </p>
            )}
          </div>

          {/* Number of Guests */}
          <div>
            <label className="label">
              <span className="label-text">Number of Guests</span>
            </label>
            <input
              type="number"
              placeholder="2"
              {...register("numberOfGuests", {
                required: "Number of guests is required",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "At least 1 guest is required",
                },
              })}
              className="bg-white input input-bordered w-full"
            />
            {errors.numberOfGuests && (
              <p className="text-red-500 text-sm mt-1">
                {errors.numberOfGuests.message}
              </p>
            )}
          </div>
        </div>

        {/* ========== PAYMENT SUMMARY ========== */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-rose-700 mb-2">
            Payment Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Price Per Night */}
            <div>
              <p className="text-sm text-gray-500">Price / Night</p>
              <p className="text-lg font-semibold text-gray-800">
                ৳{selectedVariant?.price || 0}
              </p>
            </div>

            {/* Number of Nights */}
            <div>
              <p className="text-sm text-gray-500">Number of Nights</p>
              <p className="text-lg font-semibold text-gray-800">{nights}</p>
            </div>

            {/* Total Amount */}
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-lg font-bold text-rose-700">
                ৳{totalAmount.toLocaleString()}
              </p>
            </div>

            {/* Due Amount */}
            <div>
              <p className="text-sm text-gray-500">Due Amount</p>
              <p className="text-lg font-bold text-orange-600">
                ৳{dueAmount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Advance Payment Input */}
          <div className="max-w-xs mt-4">
            <label className="label">
              <span className="label-text font-medium">Advance Payment</span>
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              {...register("advancePayment", {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Advance cannot be negative",
                },
              })}
              className="bg-white input input-bordered w-full"
            />
            {errors.advancePayment && (
              <p className="text-red-500 text-sm mt-1">
                {errors.advancePayment.message}
              </p>
            )}
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="label">
            <span className="label-text">Special Requests</span>
          </label>
          <textarea
            {...register("specialRequests")}
            className="textarea textarea-bordered w-full h-32 bg-white"
            placeholder="Any special requests from the guest..."
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="reset"
            className="btn btn-outline border-[#BF1E2E] text-[#BF1E2E] hover:bg-[#BF1E2E] hover:text-white"
          >
            Reset
          </button>

          <button
            type="submit"
            className="btn bg-[#BF1E2E] text-white hover:bg-red-800 border-none"
          >
            Check In Guest
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckIn;
