import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { MdLocalLaundryService, MdWorkHistory } from "react-icons/md";
import { RiHome3Line } from "react-icons/ri";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import useAxios from "../../../../hooks/useAxios";
import Swal from "sweetalert2";

const LaundryService = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const selectedRoom = watch("roomNumber");

  const [clothItems, setClothItems] = useState([
    { clothName: "", quantity: 1, price: 0 },
  ]);

  // Get current check-in guests
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

  const handleAddItem = () => {
    setClothItems([...clothItems, { clothName: "", quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    if (clothItems.length === 1) return;
    const updated = clothItems.filter((_, i) => i !== index);
    setClothItems(updated);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...clothItems];
    updated[index][field] = value;
    setClothItems(updated);
  };

  const totalCost = clothItems.reduce((sum, item) => {
    return sum + Number(item.quantity || 0) * Number(item.price || 0);
  }, 0);

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

    const laundryData = {
      ...data,
      checkinId: selectedCheckIn._id,
      guestName: selectedCheckIn.guestName || "",
      contactNumber: selectedCheckIn.contactNumber || "",
      clothItems,
      totalCost,
    };

    try {
      const res = await axiosInstance.post("/laundry-service", laundryData);

      if (res.data.insertedId) {
        Swal.fire({
          title: "Success!",
          text: "Laundry service request submitted successfully.",
          icon: "success",
          confirmButtonColor: "#BF1E2E",
        });
        navigate("/dashboard/services");
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Failed to submit laundry request",
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
              <MdLocalLaundryService className="text-xl text-white" />
            </div>

            <h1 className="text-lg font-bold text-rose-700">Laundry Service</h1>
          </div>

          <p className="text-gray-500 ml-12">
            Create a new laundry service request.
          </p>
        </div>

        <div className="flex flex-row gap-3">
          <Link to="/dashboard/services/laundry_service/laundry_service_history">
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
              type="text"
              value={selectedCheckIn?.contactNumber || ""}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>

          {/* Laundry Type */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Laundry Type</span>
            </label>
            <select
              {...register("laundryType", {
                required: "Laundry type is required",
              })}
              className="select select-bordered w-full bg-white"
              defaultValue=""
            >
              <option value="" disabled>
                Select laundry type
              </option>
              <option value="Wash">Wash</option>
              <option value="Dry Clean">Dry Clean</option>
              <option value="Iron">Iron</option>
              <option value="Wash & Iron">Wash & Iron</option>
            </select>
            {errors.laundryType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.laundryType.message}
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

          {/* Delivery Date */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Delivery Date</span>
            </label>
            <input
              type="date"
              {...register("deliveryDate", {
                required: "Delivery date is required",
              })}
              className="input input-bordered w-full bg-white"
            />
            {errors.deliveryDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.deliveryDate.message}
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
              placeholder="Enter staff name"
              {...register("assignedStaff")}
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

        {/* ========== Cloth Items Section ========== */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-rose-700">
              Cloth Items
            </h3>

            <button
              type="button"
              onClick={handleAddItem}
              className="btn btn-sm bg-rose-700 text-white hover:bg-rose-800 border-none gap-2"
            >
              <FaPlus /> Add Item
            </button>
          </div>

          <div className="space-y-4">
            {clothItems.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-rose-50 border border-rose-100 rounded-xl p-4"
              >
                {/* Cloth Name */}
                <div className="md:col-span-5">
                  <label className="label">
                    <span className="label-text font-medium">
                      Cloth Name / Type
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shirt, Pant, Suit"
                    value={item.clothName}
                    onChange={(e) =>
                      handleItemChange(index, "clothName", e.target.value)
                    }
                    className="input input-bordered w-full bg-white"
                  />
                </div>

                {/* Quantity */}
                <div className="md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Quantity</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    className="input input-bordered w-full bg-white"
                  />
                </div>

                {/* Price */}
                <div className="md:col-span-3">
                  <label className="label">
                    <span className="label-text font-medium">Price (৳)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(index, "price", e.target.value)
                    }
                    className="input input-bordered w-full bg-white"
                  />
                </div>

                {/* Remove */}
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    disabled={clothItems.length === 1}
                    className="btn btn-sm btn-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-40"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Special Instructions */}
        <div className="mt-6">
          <label className="label">
            <span className="label-text font-medium">Special Instructions</span>
          </label>
          <textarea
            rows="4"
            placeholder="Enter any special requests..."
            {...register("specialInstructions")}
            className="textarea textarea-bordered w-full bg-white"
          ></textarea>
        </div>

        {/* Total Cost */}
        <div className="mt-6 bg-rose-50 border border-rose-200 rounded-xl p-5 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-700">
            Total Cost
          </span>
          <span className="text-2xl font-bold text-rose-700">
            ৳{totalCost.toLocaleString()}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => {
              setClothItems([{ clothName: "", quantity: 1, price: 0 }]);
            }}
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

export default LaundryService;
