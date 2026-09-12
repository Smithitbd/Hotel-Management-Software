import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { MdAssessment } from "react-icons/md";
import { Link } from "react-router";
import useAxios from "../../../../hooks/useAxios";

const SalaryReport = () => {
  const axiosInstance = useAxios();

  const { register, handleSubmit, getValues } = useForm();

  const {
    data: salaryData = [],
    isFetching,
    refetch,
    isFetched,
  } = useQuery({
    queryKey: ["salary-report"],
    queryFn: async () => {
      const { fromDate, toDate, employeeId } = getValues();

      const res = await axiosInstance.get("/salary-report", {
        params: {
          fromDate,
          toDate,
          employeeId: employeeId || undefined, // only send if has value
        },
      });

      return res.data;
    },
    enabled: false,
  });

  const onSubmit = () => {
    refetch();
  };

  // Calculate Total Paid
  const totalPaid = salaryData.reduce(
    (sum, item) => sum + (Number(item.netPay) || 0),
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
          <h1 className="text-lg font-bold text-rose-700">Salary Report</h1>
        </div>

        <Link
          to="/dashboard/reports"
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
          {/* Employee ID */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Employee ID</span>
            </label>
            <input
              type="text"
              placeholder="Optional"
              className="input input-bordered w-full bg-white"
              {...register("employeeId")}
            />
          </div>

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
        {!isFetched && !isFetching && (
          <div className="py-16 text-center text-gray-400">
            Select filters and click <b>Generate Report</b>
          </div>
        )}

        {isFetching && (
          <div className="py-16 text-center">
            <span className="loading loading-spinner loading-lg text-rose-700"></span>
          </div>
        )}

        {isFetched && !isFetching && (
          <>
            {salaryData.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                No salary data found
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead className="bg-rose-700 text-white">
                      <tr>
                        <th>#</th>
                        <th>Employee</th>
                        <th>ID</th>
                        <th>Designation</th>
                        <th>Department</th>
                        <th>Period</th>
                        <th>Gross Pay</th>
                        <th>Deductions</th>
                        <th>Net Pay</th>
                        <th>Status</th>
                        <th>Paid At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salaryData.map((item, index) => (
                        <tr key={item._id}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="font-medium">
                              {item.employeeName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.employeeDetails?.Phone ||
                                item.employeeDetails?.Email ||
                                ""}
                            </div>
                          </td>
                          <td>{item.employeeID}</td>
                          <td>{item.designation}</td>
                          <td>{item.department}</td>
                          <td>{item.periodLabel}</td>
                          <td>৳{item.grossPay?.toLocaleString()}</td>
                          <td className="text-red-600">
                            ৳{item.deductionAmount?.toLocaleString() || 0}
                          </td>
                          <td className="font-semibold text-rose-700">
                            ৳{item.netPay?.toLocaleString()}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                item.paymentStatus === "Paid"
                                  ? "badge-success"
                                  : "badge-warning"
                              }`}
                            >
                              {item.paymentStatus}
                            </span>
                          </td>
                          <td>
                            {item.paidAt
                              ? new Date(item.paidAt).toLocaleDateString()
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total Paid */}
                <div className="flex justify-end p-5 border-t border-gray-100 bg-gray-50">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Salary Paid</p>
                    <p className="text-2xl font-bold text-rose-700">
                      ৳{totalPaid.toLocaleString()}
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

export default SalaryReport;
