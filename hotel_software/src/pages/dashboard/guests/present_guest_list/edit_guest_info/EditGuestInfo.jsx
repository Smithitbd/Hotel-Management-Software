import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { MdManageAccounts } from "react-icons/md";
import Swal from "sweetalert2";
import useAxios from "../../../../../hooks/useAxios";
import { IoCaretBackCircleSharp } from "react-icons/io5";

const EditGuestInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  // Get guest
  const {
    data: guest,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["guest", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/check-in/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Get room variants
  const { data: roomVariants = [] } = useQuery({
    queryKey: ["room-variants"],
    queryFn: async () => {
      const res = await axiosInstance.get("/room-variants");
      return res.data;
    },
  });

  // Resolve roomVariantId from name if id is missing
  const resolvedVariantId =
    guest?.roomVariantId ||
    roomVariants.find((v) => v.variantName === guest?.roomVariantName)?._id ||
    "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    values: {
      guestName: guest?.guestName || "",
      guestAddress: guest?.guestAddress || "",
      contactNumber: guest?.contactNumber || "",
      designation: guest?.designation || "",
      nidNumber: guest?.nidNumber || "",

      roomVariantName: guest?.roomVariantName || "",

      roomNumber: guest?.roomNumber || "",

      checkInDate: guest?.checkInDate || "",

      checkInTime: guest?.checkInTime || "",

      checkOutDate: guest?.checkOutDate || "",

      numberOfGuests: guest?.numberOfGuests || "",

      advancePayment: guest?.advancePayment || "",

      specialRequests: guest?.specialRequests || "",

      status: guest?.status || "Normal",
    },
  });

  const selectedRoomVariantId = watch("roomVariantId");

  // Get rooms by selected variant
  const { data: rooms = [] } = useQuery({
    queryKey: ["rooms", selectedRoomVariantId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/rooms/variant/${selectedRoomVariantId}`,
      );
      return res.data;
    },
    enabled: !!selectedRoomVariantId,
  });

  const onSubmit = async (data) => {
    const selectedVariant = roomVariants.find(
      (variant) => variant._id === data.roomVariantId,
    );

    const start = new Date(data.checkInDate);
    const end = new Date(data.checkOutDate);
    const numberOfNights = Math.max(
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)),
      0,
    );

    const pricePerNight =
      selectedVariant?.price || Number(guest?.pricePerNight) || 0;
    const totalAmount = Number(pricePerNight) * numberOfNights;
    const advancePayment = Number(data.advancePayment) || 0;
    const dueAmount = Math.max(totalAmount - advancePayment, 0);

    const updateData = {
      guestName: data.guestName,
      guestAddress: data.guestAddress,
      contactNumber: data.contactNumber,
      designation: data.designation,
      nidNumber: data.nidNumber,
      roomVariantId: data.roomVariantId,
      roomVariantName:
        selectedVariant?.variantName || guest?.roomVariantName || "",
      roomNumber: data.roomNumber,
      pricePerNight,
      checkInDate: data.checkInDate,
      checkInTime: data.checkInTime,
      checkOutDate: data.checkOutDate,
      numberOfNights,
      numberOfGuests: Number(data.numberOfGuests) || 1,
      totalAmount,
      advancePayment,
      dueAmount,
      specialRequests: data.specialRequests || "",
      status: data.status || "Normal",
    };

    const res = await axiosInstance.patch(`/check-in/${id}`, updateData);

    if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
      await Swal.fire({
        title: "Updated Successfully!",
        text: "Guest information has been updated.",
        icon: "success",
        confirmButtonColor: "#BF1E2E",
      });
      navigate("/dashboard/guests/present_guest_list");
    } else {
      Swal.fire({
        title: "No Changes Made",
        text: "The guest information was not changed.",
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
              "Failed to load guest information."}
          </span>
        </div>
      </div>
    );
  }

  if (!guest) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="alert alert-warning">
          <span>Guest not found.</span>
        </div>
      </div>
    );
  }

  const selectedVariantPrice =
    roomVariants.find((v) => v._id === selectedRoomVariantId)?.price ||
    guest.pricePerNight ||
    0;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <MdManageAccounts className="text-xl text-white" />
            </div>
            <h1 className="text-lg font-bold text-rose-800">
              Edit Guest Information
            </h1>
          </div>
          <p className="text-gray-500 mt-3 ml-16">
            Update the guest information and booking details.
          </p>
        </div>

        <Link to="/dashboard/guests/present_guest_list">
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
          >
            <IoCaretBackCircleSharp className="text-2xl" />
          </button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card bg-white shadow-md border border-gray-100">
          <div className="card-body p-8 space-y-6">
            {/* Guest Information */}
            <div>
              <h2 className="text-lg font-bold text-rose-800 mb-5">
                Guest Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Guest Name *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter guest name"
                    {...register("guestName", {
                      required: "Guest name is required",
                    })}
                    className="input input-bordered w-full bg-white"
                  />
                  {errors.guestName && (
                    <p className="text-error text-sm mt-1">
                      {errors.guestName.message}
                    </p>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Guest Address *
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter guest address"
                    {...register("guestAddress", {
                      required: "Guest address is required",
                    })}
                    className="input input-bordered w-full bg-white"
                  />
                  {errors.guestAddress && (
                    <p className="text-error text-sm mt-1">
                      {errors.guestAddress.message}
                    </p>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Contact Number *
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter contact number"
                    {...register("contactNumber", {
                      required: "Contact number is required",
                    })}
                    className="input input-bordered w-full bg-white"
                  />
                  {errors.contactNumber && (
                    <p className="text-error text-sm mt-1">
                      {errors.contactNumber.message}
                    </p>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Designation</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Farmer"
                    {...register("designation")}
                    className="input input-bordered w-full bg-white"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">NID Number</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter NID number"
                    {...register("nidNumber")}
                    className="input input-bordered w-full bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Room Information */}
            <div>
              <h2 className="text-lg font-bold text-rose-800 mb-5">
                Room Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Room Variant */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Room Variant *
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Deluxe Sea View"
                    {...register("roomVariantName", {
                      required: "Room variant is required",
                    })}
                    className="input input-bordered w-full bg-white"
                  />
                  {errors.roomVariantName && (
                    <p className="text-error text-sm mt-1">
                      {errors.roomVariantName.message}
                    </p>
                  )}
                </div>

                {/* Room Number */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Room Number *
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 01"
                    {...register("roomNumber", {
                      required: "Room number is required",
                    })}
                    className="input input-bordered w-full bg-white"
                  />
                  {errors.roomNumber && (
                    <p className="text-error text-sm mt-1">
                      {errors.roomNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Stay Information */}
            <div>
              <h2 className="text-lg font-bold text-rose-800 mb-5">
                Stay Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Check In Date *
                    </span>
                  </label>
                  <input
                    type="date"
                    {...register("checkInDate", {
                      required: "Check in date is required",
                    })}
                    className="input input-bordered w-full bg-white"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Check In Time
                    </span>
                  </label>
                  <input
                    type="time"
                    {...register("checkInTime")}
                    className="input input-bordered w-full bg-white"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Check Out Date *
                    </span>
                  </label>
                  <input
                    type="date"
                    {...register("checkOutDate", {
                      required: "Check out date is required",
                    })}
                    className="input input-bordered w-full bg-white"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Number of Guests
                    </span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register("numberOfGuests")}
                    className="input input-bordered w-full bg-white"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Current Status
                    </span>
                  </label>
                  <select
                    {...register("status")}
                    className="select select-bordered w-full bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Ban">Blacklisted</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h2 className="text-lg font-bold text-rose-800 mb-5">
                Payment Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Price Per Night
                    </span>
                  </label>
                  <input
                    type="number"
                    value={selectedVariantPrice}
                    readOnly
                    className="input input-bordered w-full bg-gray-100"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Advance Payment
                    </span>
                  </label>
                  <input
                    type="number"
                    {...register("advancePayment")}
                    className="input input-bordered w-full bg-white"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Current Due</span>
                  </label>
                  <input
                    type="number"
                    value={guest.dueAmount || 0}
                    readOnly
                    className="input input-bordered w-full bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Special Requests</span>
              </label>
              <textarea
                rows="4"
                placeholder="Enter special requests..."
                {...register("specialRequests")}
                className="textarea textarea-bordered w-full bg-white"
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-5">
              <Link to="/dashboard/guests/present_guest_list">
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

export default EditGuestInfo;
