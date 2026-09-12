import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MdRestaurantMenu } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";
import { Link } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../../../../hooks/useAxios";
import { IoCaretBackOutline } from "react-icons/io5";

const FoodMenu = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Get all food items
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["food-menu"],
    queryFn: async () => {
      const res = await axiosInstance.get("/food-menu");
      return res.data;
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      itemName: data.itemName,
      itemDescription: data.itemDescription || "",
      price: Number(data.price),
    };

    if (data.editId) {
      // Update
      await axiosInstance.patch(`/food-menu/${data.editId}`, payload);

      Swal.fire({
        title: "Updated!",
        text: "Food item updated successfully.",
        icon: "success",
        confirmButtonColor: "#9f1239",
      });
    } else {
      // Add
      await axiosInstance.post("/food-menu", payload);

      Swal.fire({
        title: "Success!",
        text: "Food item added successfully.",
        icon: "success",
        confirmButtonColor: "#9f1239",
      });
    }

    reset();
    queryClient.invalidateQueries(["food-menu"]);
  };

  const handleUpdate = (item) => {
    setValue("itemName", item.itemName);
    setValue("itemDescription", item.itemDescription);
    setValue("price", item.price);
    setValue("editId", item._id);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This food item will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9f1239",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      await axiosInstance.delete(`/food-menu/${id}`);
      queryClient.invalidateQueries(["food-menu"]);

      Swal.fire({
        title: "Deleted!",
        text: "Food item removed.",
        icon: "success",
        confirmButtonColor: "#9f1239",
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
              <MdRestaurantMenu className="text-xl text-white" />
            </div>
            <h1 className="text-lg font-bold text-rose-700">Food Menu</h1>
          </div>
          <p className="text-gray-500 ml-12">
            Add and manage restaurant food items.
          </p>
        </div>

        <Link to="/dashboard/services/restaurant_orders">
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
          >
            <IoCaretBackOutline className="text-xl" />
          </button>
        </Link>
      </div>

      {/* Items List */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
        <h2 className="text-base font-semibold text-rose-700 mb-4">
          All Food Items
        </h2>

        {isLoading ? (
          <p className="text-center py-8 text-gray-400">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No food items added yet.
          </p>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-rose-50 rounded-lg text-sm font-semibold text-gray-600">
              <div className="col-span-3">Item Name</div>
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2 text-center">Action</div>
            </div>

            {items.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-12 gap-4 px-4 py-3 border border-gray-100 rounded-lg items-center hover:bg-gray-50 transition"
              >
                <div className="col-span-3 font-medium text-gray-800">
                  {item.itemName}
                </div>
                <div className="col-span-5 text-gray-600 text-sm">
                  {item.itemDescription || "—"}
                </div>
                <div className="col-span-2 font-semibold text-rose-700">
                  ৳{item.price}
                </div>
                <div className="col-span-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleUpdate(item)}
                    className="btn btn-sm btn-outline border-cyan-500 text-cyan-500 hover:bg-cyan-700 hover:text-white"
                  >
                    <FaRegPenToSquare />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="btn btn-sm btn-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-2xl p-8"
      >
        <h2 className="text-base font-semibold text-rose-700 mb-5">
          Add / Edit Food Item
        </h2>

        {/* Hidden field for edit */}
        <input type="hidden" {...register("editId")} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="label">
              <span className="label-text font-medium">Item Name</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Chicken Biryani"
              {...register("itemName", { required: "Item name is required" })}
              className="input input-bordered w-full bg-white"
            />
            {errors.itemName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.itemName.message}
              </p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Item Description</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Spicy rice with chicken"
              {...register("itemDescription")}
              className="input input-bordered w-full bg-white"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Price (৳)</span>
            </label>
            <input
              type="number"
              placeholder="e.g. 350"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price cannot be negative" },
              })}
              className="input input-bordered w-full bg-white"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => reset()}
            className="btn btn-outline border-gray-400 text-gray-600"
          >
            Reset
          </button>

          <button
            type="submit"
            className="btn bg-[#BF1E2E] text-white hover:bg-red-800 border-none px-8"
          >
            Save Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default FoodMenu;
