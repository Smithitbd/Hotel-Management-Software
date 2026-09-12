import { useState } from "react";
import { Link } from "react-router";
import {
  FaListAlt,
  FaChartPie,
  FaPlusCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { MdAssessment } from "react-icons/md";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2"; // optional (for success message)
import useAxios from "../../../../hooks/useAxios";

const ExpenseReport = () => {
  const axiosInstance = useAxios();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("/expense-categories", {
        categoryName: data.categoryName,
      });

      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Category Added!",
          text: "Expense category has been added successfully.",
          timer: 1500,
          showConfirmButton: false,
        });

        reset();
        setIsModalOpen(false);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
            <MdAssessment className="text-xl text-white" />
          </div>
          <h1 className="text-lg font-bold text-rose-700">Expense Report</h1>
        </div>

        <Link
          to="/dashboard/reports"
          className="btn btn-circle bg-rose-700 hover:bg-[#BF1E2E] text-white border-none"
          title="Back"
        >
          <FaArrowLeft />
        </Link>
      </div>

      <p className="text-gray-500 mb-10">
        Manage and view expense entries, total expenses, and expense categories.
      </p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Entry Report */}
        <Link
          to="/dashboard/reports/expenses/entry-report"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaListAlt className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>
          <h2 className="text-lg font-bold text-rose-700 mb-3">Entry Report</h2>
          <p className="text-gray-600 text-sm">
            View detailed list of all expense entries with date and category.
          </p>
        </Link>

        {/* Expense Overview */}
        <Link
          to="/dashboard/reports/expenses/expense_overview"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaChartPie className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>
          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Expense Overview
          </h2>
          <p className="text-gray-600 text-sm">
            See total expenses summary by category and date range.
          </p>
        </Link>

        {/* Add Expense Category */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E] cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaPlusCircle className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>
          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Add Expense Category
          </h2>
          <p className="text-gray-600 text-sm">
            Create and manage expense categories for better tracking.
          </p>
        </div>
      </div>

      {/* ====================== DaisyUI Modal ====================== */}
      <dialog className={`modal ${isModalOpen ? "modal-open " : ""}`}>
        <div className="modal-box bg-white">
          <h3 className="font-bold text-lg text-rose-700 mb-4">Add Category</h3>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-medium">Category Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter category name"
                className="input input-bordered w-full bg-white"
                {...register("categoryName", { required: true })}
              />
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setIsModalOpen(false);
                  reset();
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-rose-700 hover:bg-[#BF1E2E] text-white border-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>

        {/* Click outside to close */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsModalOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default ExpenseReport;
