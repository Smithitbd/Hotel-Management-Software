import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { MdAssessment } from "react-icons/md";
import { Link } from "react-router";
import useAxios from "../../../../../hooks/useAxios";

const ExpenseOverview = () => {
  const axiosInstance = useAxios();

  const { register, handleSubmit, getValues } = useForm();

  // Fetch categories for the filter dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ["expense-categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/expense-categories");
      return res.data;
    },
  });

  const {
    data: expenseData = [],
    isFetching,
    refetch,
    isFetched,
  } = useQuery({
    queryKey: ["expense-overview"],
    queryFn: async () => {
      const { fromDate, toDate, categoryName } = getValues();

      const res = await axiosInstance.get("/expense-overview", {
        params: {
          fromDate,
          toDate,
          categoryName: categoryName || undefined,
        },
      });

      return res.data;
    },
    enabled: false,
  });

  const onSubmit = () => {
    refetch();
  };

  // Calculate Total Amount
  const totalAmount = expenseData.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0,
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
            <MdAssessment className="text-xl text-white" />
          </div>
          <h1 className="text-lg font-bold text-rose-700">
            Expense Overview Report
          </h1>
        </div>

        <Link
          to="/dashboard/reports" // change if needed
          className="btn btn-circle bg-rose-700 hover:bg-[#BF1E2E] text-white border-none"
        >
          <FaArrowLeft />
        </Link>
      </div>

      {/* Filter Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* From Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">From Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full bg-white"
              {...register("fromDate", { required: true })}
            />
          </div>

          {/* To Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">To Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full bg-white"
              {...register("toDate", { required: true })}
            />
          </div>

          {/* Category (Optional) */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Category</span>
            </label>
            <select
              className="select select-bordered w-full bg-white"
              {...register("categoryName")}
              defaultValue=""
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn bg-rose-700 hover:bg-[#BF1E2E] text-white border-none"
          >
            <FaSearch />
            Generate Report
          </button>
        </div>
      </form>

      {/* Results */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {/* Initial State */}
        {!isFetched && !isFetching && (
          <div className="py-16 text-center text-gray-400">
            Select filters and click <b>Generate Report</b>
          </div>
        )}

        {/* Loading */}
        {isFetching && (
          <div className="py-16 text-center">
            <span className="loading loading-spinner loading-lg text-rose-700"></span>
          </div>
        )}

        {/* Data */}
        {isFetched && !isFetching && (
          <>
            {expenseData.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                No data found
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead className="bg-rose-700 text-white">
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Expense For</th>
                        <th>Amount</th>
                        <th>Created By</th>
                        <th>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenseData.map((item, index) => (
                        <tr key={item._id}>
                          <td>{index + 1}</td>
                          <td>{item.expenseDate}</td>
                          <td>{item.categoryName}</td>
                          <td>{item.expenseFor}</td>
                          <td className="font-semibold text-rose-700">
                            ৳{Number(item.amount).toLocaleString()}
                          </td>
                          <td>{item.createdBy}</td>
                          <td className="max-w-xs truncate">
                            {item.note || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total Amount */}
                <div className="flex justify-end p-5 border-t border-gray-100 bg-gray-50">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-2xl font-bold text-rose-700">
                      ৳{totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExpenseOverview;
