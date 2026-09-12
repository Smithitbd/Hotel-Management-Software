import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { MdAttachMoney, MdWorkHistory } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../../../../hooks/useAxios";
import { FaArrowLeft } from "react-icons/fa";

const EntryReport = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch expense categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["expense-categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/expense-categories");
      return res.data;
    },
  });

  const onSubmit = async (data) => {
    try {
      const expenseData = {
        ...data,
        amount: Number(data.amount),
      };

      const res = await axiosInstance.post("/expense-entries", expenseData);

      if (res.data.insertedId) {
        await Swal.fire({
          title: "Success!",
          text: "Expense entry added successfully.",
          icon: "success",
          confirmButtonColor: "#BF1E2E",
        });
        reset();
        // Optional: navigate("/dashboard/expenses");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to add expense entry",
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
              <MdAttachMoney className="text-xl text-white" />
            </div>
            <h1 className="text-lg font-bold text-rose-700">Add Expense</h1>
          </div>
          <p className="text-gray-500 ml-12">Create a new expense entry.</p>
        </div>

        <div className="flex flex-row gap-3">
          {/* Back Button */}
          <Link
            to="/dashboard/reports/expense_report"
            className="btn btn-circle bg-rose-700 hover:bg-[#BF1E2E] text-white border-none"
          >
            <FaArrowLeft />
          </Link>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-2xl p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Expense Date */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Expense Date</span>
            </label>
            <input
              type="date"
              {...register("expenseDate", {
                required: "Expense date is required",
              })}
              className="input input-bordered w-full bg-white"
            />
            {errors.expenseDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.expenseDate.message}
              </p>
            )}
          </div>

          {/* Category Name */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Category Name</span>
            </label>
            <select
              {...register("categoryName", {
                required: "Category is required",
              })}
              className="select select-bordered w-full bg-white"
              defaultValue=""
              disabled={categoriesLoading}
            >
              <option value="" disabled>
                {categoriesLoading
                  ? "Loading categories..."
                  : "Select category"}
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </select>
            {errors.categoryName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.categoryName.message}
              </p>
            )}
          </div>

          {/* Expense For */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Expense For</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Electricity bill, Staff salary..."
              {...register("expenseFor", {
                required: "Expense for is required",
              })}
              className="input input-bordered w-full bg-white"
            />
            {errors.expenseFor && (
              <p className="text-red-500 text-sm mt-1">
                {errors.expenseFor.message}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Amount (৳)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 0, message: "Amount cannot be negative" },
              })}
              className="input input-bordered w-full bg-white"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Created By */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Created By</span>
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              {...register("createdBy", {
                required: "Created by is required",
              })}
              className="input input-bordered w-full bg-white"
            />
            {errors.createdBy && (
              <p className="text-red-500 text-sm mt-1">
                {errors.createdBy.message}
              </p>
            )}
          </div>
        </div>

        {/* Note */}
        <div className="mt-6">
          <label className="label">
            <span className="label-text font-medium">Note</span>
          </label>
          <textarea
            rows="4"
            placeholder="Additional notes (optional)..."
            {...register("note")}
            className="textarea textarea-bordered w-full bg-white"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => reset()}
            className="btn btn-outline border-[#BF1E2E] text-[#BF1E2E] hover:bg-[#BF1E2E] hover:text-white"
          >
            Reset
          </button>

          <button
            type="submit"
            className="btn bg-[#BF1E2E] text-white hover:bg-red-800 border-none px-8"
          >
            Submit Expense
          </button>
        </div>
      </form>
    </div>
  );
};

export default EntryReport;
