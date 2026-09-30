import { useForm } from "react-hook-form";
import { MdOutlinePlaylistAddCheckCircle } from "react-icons/md";
import { Link, useNavigate, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../hooks/useAxios";
import Swal from "sweetalert2";
import { RiHome3Line } from "react-icons/ri";
import imageCompression from "browser-image-compression";
import useUserStatus from "../../../../hooks/useUserStatus";

const CheckIn = () => {
  const axiosInstance = useAxios();
  const { hotelEmail, statusLoading } = useUserStatus();
  const navigate = useNavigate();
  const location = useLocation();

  const prefilledRoom = location.state?.room;
  const prefilledReservation = location.state?.reservation;

  const getDefaults = () => {
    if (prefilledReservation) {
      const r = prefilledReservation;
      return {
        guestName: r.guestName || "",
        contactNumber: r.contactNumber || "",
        guestAddress: r.guestAddress || "",
        designation: r.designation || "",
        nidNumber: r.nidNumber || "",
        roomVariant: r.room?.variantId || r.roomVariantId || "",
        roomNumber: String(r.room?.roomNo || r.roomNo || ""),
        checkInDate: r.arrivingDate || "",
        checkOutDate: r.departureDate || "",
        numberOfGuests: r.numberOfGuests || 1,
        advancePayment: Number(r.advancePayment) || 0,
        discountType: "amount",
        discountValue: 0,
        specialRequests: r.specialRequests || "",
      };
    }

    return {
      advancePayment: 0,
      discountType: "amount",
      discountValue: 0,
      roomVariant: prefilledRoom?.variantId || "",
      roomNumber: prefilledRoom?.roomNo || "",
    };
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: getDefaults(),
  });

  const selectedVariantId = watch("roomVariant");
  const checkInDate = watch("checkInDate");
  const checkOutDate = watch("checkOutDate");
  const advancePayment = watch("advancePayment");
  const discountType = watch("discountType");
  const discountValue = watch("discountValue");

  const { data: roomVariants = [], isLoading: variantsLoading } = useQuery({
    queryKey: ["room-variants", hotelEmail],
    queryFn: async () => {
      const res = await axiosInstance.get("/room-variants", {
        params: { hotelEmail },
      });
      return res.data;
    },
    enabled: !!hotelEmail,
  });

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

  const selectedVariant = roomVariants.find((v) => v._id === selectedVariantId);

  let nights = 0;
  if (checkInDate && checkOutDate) {
    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);
    const diffTime = outDate - inDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    nights = diffDays > 0 ? diffDays : 0;
  }

  const subtotal =
    selectedVariant && nights > 0 ? selectedVariant.price * nights : 0;

  const discountVal = Number(discountValue) || 0;
  let discountAmount = 0;

  if (discountType === "percentage") {
    const pct = Math.min(Math.max(discountVal, 0), 100);
    discountAmount = (subtotal * pct) / 100;
  } else {
    discountAmount = Math.min(Math.max(discountVal, 0), subtotal);
  }

  const totalAmount = Math.max(subtotal - discountAmount, 0);
  const advance = Number(advancePayment) || 0;
  const dueAmount = Math.max(totalAmount - advance, 0);

  const compressImage = async (file) => {
    if (file.size < 400 * 1024) return file;

    const options = {
      maxSizeMB: 0.6,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      fileType: "image/jpeg",
      initialQuality: 0.8,
    };

    try {
      const compressed = await imageCompression(file, options);
      return new File([compressed], file.name.replace(/\.[^.]+$/, ".jpg"), {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
    } catch (err) {
      console.error("Compression failed, using original:", err);
      return file;
    }
  };

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

    Swal.fire({
      title: "Preparing images…",
      text: "Compressing for faster upload",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const [compressedNid, compressedPerson] = await Promise.all([
      compressImage(nidImageFile),
      compressImage(personImageFile),
    ]);

    Swal.close();

    const formData = new FormData();

    formData.append("guestName", data.guestName);
    formData.append("guestAddress", data.guestAddress);
    formData.append("contactNumber", data.contactNumber);
    formData.append("designation", data.designation);
    formData.append("nidNumber", data.nidNumber || "");
    formData.append("nidImage", compressedNid);
    formData.append("personImage", compressedPerson);
    formData.append("roomVariantId", data.roomVariant);
    formData.append("roomVariantName", selectedVariant?.variantName || "");
    formData.append("roomNumber", data.roomNumber);
    formData.append("pricePerNight", selectedVariant?.price || 0);
    formData.append("checkInDate", data.checkInDate);
    formData.append("checkInTime", data.checkInTime);
    formData.append("checkOutDate", data.checkOutDate);
    formData.append("numberOfNights", nights);
    formData.append("numberOfGuests", data.numberOfGuests);
    formData.append("discountType", data.discountType || "amount");
    formData.append("discountValue", Number(data.discountValue) || 0);
    formData.append("advancePayment", Number(data.advancePayment) || 0);
    formData.append("specialRequests", data.specialRequests || "");
    formData.append("status", "Normal");
    formData.append("hotelEmail", hotelEmail);

    if (prefilledReservation?._id) {
      formData.append("reservationId", prefilledReservation._id);
    }

    try {
      const res = await axiosInstance.post("/check-in", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.insertedId) {
        await Swal.fire({
          title: "Success!",
          text: prefilledReservation
            ? "Guest checked in from reservation successfully."
            : "Guest checked in successfully.",
          icon: "success",
          confirmButtonColor: "#9f1239",
        });
        navigate("/dashboard/check_in_out");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message || "Failed to check in guest.",
        icon: "error",
        confirmButtonColor: "#9f1239",
      });
    }
  };

  if (statusLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
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

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
      <div className="mb-8">
        <div className="flex justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-rose-900 flex items-center justify-center">
                <MdOutlinePlaylistAddCheckCircle className="text-xl text-white" />
              </div>
              <h1 className="text-lg font-bold text-rose-900">
                Guest Check In
              </h1>
            </div>
            <p className="text-gray-500 ml-12">
              Manage guest check-ins, room assignments, and stay details.
            </p>

            {prefilledRoom && !prefilledReservation && (
              <p className="ml-12 mt-2 text-sm font-medium text-rose-600">
                Booking → Room {prefilledRoom.roomNo} (
                {prefilledRoom.variantName || prefilledRoom.baseRoomType})
              </p>
            )}

            {prefilledReservation && (
              <p className="ml-12 mt-2 text-sm font-medium text-emerald-600">
                From Reservation → Room{" "}
                {prefilledReservation.room?.roomNo ||
                  prefilledReservation.roomNo}{" "}
                ({prefilledReservation.room?.variantName || "—"}) ·{" "}
                {prefilledReservation.arrivingDate} →{" "}
                {prefilledReservation.departureDate}
              </p>
            )}
          </div>

          <Link to="/dashboard/check_in_out">
            <button
              type="button"
              className="flex items-center justify-center w-9 h-9 border border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white rounded-lg transition-colors"
            >
              <RiHome3Line className="text-xl" />
            </button>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div>
            <label className="label">
              <span className="label-text">Contact Number</span>
            </label>
            <input
              type="tel"
              placeholder="017XXXXXXXX"
              {...register("contactNumber", {
                required: "Contact number is required",
                pattern: {
                  value: /^\d{11}$/,
                  message: "Contact number must be exactly 11 digits",
                },
              })}
              className="bg-white input input-bordered w-full"
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contactNumber.message}
              </p>
            )}
          </div>

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

          <div>
            <label className="label">
              <span className="label-text">NID Number</span>
            </label>
            <input
              type="text"
              placeholder="Enter 10-digit National ID Number"
              {...register("nidNumber", {
                required: "NID number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "NID must be exactly 10 digits",
                },
              })}
              className="bg-white input input-bordered w-full"
            />
            {errors.nidNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nidNumber.message}
              </p>
            )}
          </div>

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

          <div>
            <label className="label">
              <span className="label-text">Room Variant</span>
            </label>
            <select
              {...register("roomVariant", {
                required: "Room variant is required",
              })}
              className="select select-bordered w-full bg-white"
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

          <div>
            <label className="label">
              <span className="label-text">Room Number</span>
            </label>
            <select
              {...register("roomNumber", {
                required: "Room number is required",
              })}
              className="select select-bordered w-full bg-white"
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
                .filter(
                  (room) =>
                    room.roomStatus === "Available" ||
                    room.roomStatus === "Reserved" ||
                    String(room.roomNo) ===
                      String(
                        prefilledReservation?.room?.roomNo ||
                          prefilledRoom?.roomNo ||
                          "",
                      ),
                )
                .map((room) => (
                  <option key={room._id} value={room.roomNo}>
                    Room {room.roomNo}
                    {room.roomStatus === "Reserved" ? " (Reserved)" : ""}
                  </option>
                ))}
            </select>
            {errors.roomNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.roomNumber.message}
              </p>
            )}
          </div>

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

        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-rose-900 mb-2">
            Payment Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Price / Night</p>
              <p className="text-lg font-semibold text-gray-800">
                ৳{selectedVariant?.price || 0}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Number of Nights</p>
              <p className="text-lg font-semibold text-gray-800">{nights}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Subtotal</p>
              <p className="text-lg font-semibold text-gray-800">
                ৳{subtotal.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Discount</p>
              <p className="text-lg font-semibold text-green-600">
                −৳{discountAmount.toLocaleString()}
                {discountType === "percentage" && discountVal > 0 && (
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    ({Math.min(discountVal, 100)}%)
                  </span>
                )}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-lg font-bold text-rose-900">
                ৳{totalAmount.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Due Amount</p>
              <p className="text-lg font-bold text-orange-600">
                ৳{dueAmount.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 max-w-2xl">
            <div>
              <label className="label">
                <span className="label-text font-medium">Discount Type</span>
              </label>
              <div className="flex gap-6 mt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="amount"
                    {...register("discountType")}
                    className="radio radio-sm radio-error"
                  />
                  <span className="text-sm">Amount (৳)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="percentage"
                    {...register("discountType")}
                    className="radio radio-sm radio-error"
                  />
                  <span className="text-sm">Percentage (%)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">
                  Discount Value {discountType === "percentage" ? "(%)" : "(৳)"}
                </span>
              </label>
              <input
                type="number"
                min="0"
                step={discountType === "percentage" ? "0.01" : "1"}
                placeholder="0"
                {...register("discountValue", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Discount cannot be negative",
                  },
                  validate: (value) => {
                    if (discountType === "percentage" && value > 100) {
                      return "Percentage cannot exceed 100%";
                    }
                    return true;
                  },
                })}
                className="bg-white input input-bordered w-full"
              />
              {errors.discountValue && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.discountValue.message}
                </p>
              )}
            </div>
          </div>

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
