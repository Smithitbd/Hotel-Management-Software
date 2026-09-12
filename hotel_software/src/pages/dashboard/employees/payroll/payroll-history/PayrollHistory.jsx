import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { RiHome3Line } from "react-icons/ri";
import { FaHistory } from "react-icons/fa";
import useAxios from "../../../../../hooks/useAxios";

const PayrollHistory = () => {
  const axiosInstance = useAxios();

  const {
    data: payrolls = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["payroll-history"],
    queryFn: async () => {
      const res = await axiosInstance.get("/payrolls");
      return res.data;
    },
  });

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-rose-700 flex items-center justify-center shadow-md">
              <FaHistory className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-rose-700">
                Payroll History
              </h1>
              <p className="text-sm text-gray-500">
                View all generated salaries and payment status
              </p>
            </div>
          </div>
        </div>

        <Link to="/dashboard/employees">
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
            title="Back to Payroll"
          >
            <RiHome3Line className="text-xl" />
          </button>
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Card Header */}
        <div className="bg-rose-700 text-white px-6 py-4">
          <h2 className="text-lg font-bold">Payroll History</h2>
          <p className="text-sm text-rose-100">
            View all generated salaries and payment status
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-rose-700"></span>
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-red-500 font-medium">
            Failed to load payroll history. Please try again.
          </div>
        ) : payrolls.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No payroll records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-rose-50 text-rose-800 text-sm">
                  <th className="font-semibold">#</th>
                  <th className="font-semibold">Staff</th>
                  <th className="font-semibold">Role</th>
                  <th className="font-semibold text-right">Gross</th>
                  <th className="font-semibold text-right">Festival</th>
                  <th className="font-semibold text-right">Ded %</th>
                  <th className="font-semibold text-right">Abs Cut</th>
                  <th className="font-semibold text-right">Net</th>
                  <th className="font-semibold">Period</th>
                  <th className="font-semibold text-center">Status</th>
                </tr>
              </thead>

              <tbody>
                {payrolls.map((payroll, index) => (
                  <tr
                    key={payroll._id}
                    className="hover:bg-rose-50/50 border-b border-gray-100"
                  >
                    <td className="font-medium text-gray-500">{index + 1}</td>

                    <td>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {payroll.employeeName || "—"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {payroll.employeeID || ""}
                        </span>
                      </div>
                    </td>

                    <td className="text-sm text-gray-600">
                      {payroll.designation || "—"}
                    </td>

                    <td className="text-right font-medium">
                      ৳{Number(payroll.grossPay || 0).toLocaleString()}
                    </td>

                    <td className="text-right">
                      ৳{Number(payroll.festivalBonus || 0).toLocaleString()}
                    </td>

                    <td className="text-right">
                      {payroll.deductionPercent || 0}%
                    </td>

                    <td className="text-right text-red-600">
                      ৳{Number(payroll.absentCut || 0).toLocaleString()}
                    </td>

                    <td className="text-right font-bold text-green-600">
                      ৳{Number(payroll.netPay || 0).toLocaleString()}
                    </td>

                    <td className="text-sm whitespace-nowrap">
                      {payroll.periodLabel || "—"}
                    </td>

                    <td className="text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          payroll.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-amber-100 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {payroll.paymentStatus || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollHistory;
