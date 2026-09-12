import { useForm, useFieldArray } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router";
import { MdRestaurantMenu } from "react-icons/md";
import { RiHome3Line } from "react-icons/ri";
import { FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxios from "../../../../../hooks/useAxios";

const EditRestaurantHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  // Fetch single order
  const { data: order, isLoading } = useQuery({
    queryKey: ["restaurant-order", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/restaurant-orders/${id}`);
      return res.data;
    },
  });

  // Fetch food menu
  const { data: menuItems = [] } = useQuery({
    queryKey: ["food-menu"],
    queryFn: async () => {
      const res = await axiosInstance.get("/food-menu");
      return res.data;
    },
  });

  const { register, control, handleSubmit, watch, setValue } = useForm({
    values: order
      ? {
          paymentStatus: order.paymentStatus || "Due",
          foodItems: order.foodItems || [],
        }
      : undefined,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "foodItems",
  });

  const foodItems = watch("foodItems") || [];

  const totalAmount = foodItems.reduce((sum, item) => {
    return sum + Number(item.quantity || 0) * Number(item.price || 0);
  }, 0);

  const handleFoodChange = (index, value) => {
    const selected = menuItems.find((item) => item.itemName === value);
    setValue(`foodItems.${index}.itemName`, value);
    setValue(`foodItems.${index}.price`, selected ? selected.price : 0);
  };

  const onSubmit = async (data) => {
    const updatedData = {
      foodItems: data.foodItems,
      paymentStatus: data.paymentStatus,
      totalAmount,
    };

    const res = await axiosInstance.patch(
      `/restaurant-orders/${id}`,
      updatedData,
    );

    if (res.data.modifiedCount > 0 || res.data.acknowledged) {
      await Swal.fire({
        title: "Updated!",
        text: "Restaurant order updated successfully.",
        icon: "success",
        confirmButtonColor: "#BF1E2E",
      });
      navigate(
        "/dashboard/services/restaurant_orders/restaurant_orders_history",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-rose-700"></span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 text-red-500">Order not found.</div>
    );
  }

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-700 flex items-center justify-center shadow-md">
            <MdRestaurantMenu className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-rose-700">
              Edit Restaurant Order
            </h1>
            <p className="text-sm text-gray-500">
              Only food items and payment status can be updated.
            </p>
          </div>
        </div>

        <Link to="/dashboard/services/restaurant_orders/restaurant_orders_history">
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
          >
            <RiHome3Line className="text-xl" />
          </button>
        </Link>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-2xl p-8"
      >
        {/* Read-only Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="label">
              <span className="label-text font-medium">Room Number</span>
            </label>
            <input
              type="text"
              value={order.roomNumber ? `Room ${order.roomNumber}` : "—"}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Guest Name</span>
            </label>
            <input
              type="text"
              value={order.guestName || "—"}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Order Date</span>
            </label>
            <input
              type="text"
              value={order.orderDate || "—"}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Order Time</span>
            </label>
            <input
              type="text"
              value={order.orderTime || "—"}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Assigned Waiter</span>
            </label>
            <input
              type="text"
              value={order.assignedWaiter || "—"}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Payment Method</span>
            </label>
            <input
              type="text"
              value={order.paymentMethod || "—"}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>
        </div>

        {/* ========== Editable: Payment Status ========== */}
        <div className="mb-8">
          <label className="label">
            <span className="label-text font-medium">Payment Status</span>
          </label>
          <select
            {...register("paymentStatus")}
            className="select select-bordered w-full max-w-xs bg-white"
          >
            <option value="Due">Due</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        {/* ========== Editable: Food Items ========== */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-rose-700">
              Food Items
            </h3>

            <button
              type="button"
              onClick={() => append({ itemName: "", quantity: 1, price: 0 })}
              className="btn btn-sm bg-rose-700 text-white hover:bg-rose-800 border-none gap-2"
            >
              <FaPlus /> Add Food Item
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-rose-50 border border-rose-100 rounded-xl p-4"
              >
                {/* Item Name */}
                <div className="md:col-span-5">
                  <label className="label">
                    <span className="label-text font-medium">Item Name</span>
                  </label>
                  <select
                    {...register(`foodItems.${index}.itemName`)}
                    onChange={(e) => handleFoodChange(index, e.target.value)}
                    className="select select-bordered w-full bg-white"
                  >
                    <option value="">Select food item</option>
                    {menuItems.map((menu) => (
                      <option key={menu._id} value={menu.itemName}>
                        {menu.itemName} — ৳{menu.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div className="md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Quantity</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register(`foodItems.${index}.quantity`)}
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
                    {...register(`foodItems.${index}.price`)}
                    readOnly
                    className="input input-bordered w-full bg-gray-100"
                  />
                </div>

                {/* Remove */}
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="btn btn-sm btn-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-40"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Amount */}
        <div className="mt-6 bg-rose-50 border border-rose-200 rounded-xl p-5 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-700">
            Total Amount
          </span>
          <span className="text-2xl font-bold text-rose-700">
            ৳{totalAmount.toLocaleString()}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Link to="/dashboard/services/restaurant_orders/restaurant_orders_history">
            <button
              type="button"
              className="btn btn-outline border-[#BF1E2E] text-[#BF1E2E] hover:bg-[#BF1E2E] hover:text-white"
            >
              Cancel
            </button>
          </Link>

          <button
            type="submit"
            className="btn bg-[#BF1E2E] text-white hover:bg-red-800 border-none px-8"
          >
            Update Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRestaurantHistory;
