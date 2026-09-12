import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../hooks/useAxios";
import { Link } from "react-router";
import { FaUserSlash } from "react-icons/fa";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";

const PastEmployees = () => {
  const axiosInstance = useAxios();

  const {
    data: employees = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["inactiveEmployees"],
    queryFn: async () => {
      const res = await axiosInstance.get("/employees/inactive");
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
              <FaUserSlash className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-rose-700">
                Past Employees
              </h1>
              <p className="text-sm text-gray-500">
                View resigned and terminated employees
              </p>
            </div>
          </div>
        </div>

        <Link to="/dashboard/employees">
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
            title="Back to Employees"
          >
            <IoArrowBackCircleSharp className="text-xl" />
          </button>
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Card Header */}
        <div className="bg-rose-700 text-white px-6 py-4">
          <h2 className="text-lg font-bold">Past Employees</h2>
          <p className="text-sm text-rose-100">
            Employees who have resigned or been terminated
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-rose-700"></span>
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-red-600">
            Failed to load employees: {error?.message}
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No past employees found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-rose-50 text-rose-800 text-sm">
                  <th className="font-semibold">#</th>
                  <th className="font-semibold">Image</th>
                  <th className="font-semibold">Name</th>
                  <th className="font-semibold">Employee ID</th>
                  <th className="font-semibold">Email</th>
                  <th className="font-semibold">Phone</th>
                  <th className="font-semibold">Designation</th>
                  <th className="font-semibold text-center">Status</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((employee, index) => (
                  <tr
                    key={employee._id}
                    className="hover:bg-rose-50/50 border-b border-gray-100"
                  >
                    <td className="font-medium text-gray-500">{index + 1}</td>

                    {/* Image */}
                    <td>
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12 bg-gray-200">
                          {employee.Image ? (
                            <img
                              src={`http://localhost:3000${employee.Image}`}
                              alt={employee.FullName}
                            />
                          ) : (
                            <img
                              src="https://i.ibb.co/MBtjqXQ/no-avatar.gif"
                              alt="No avatar"
                            />
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="font-medium">{employee.FullName}</td>
                    <td className="text-sm">{employee.EmployeeID || "—"}</td>
                    <td className="text-sm">{employee.Email || "—"}</td>
                    <td className="text-sm">{employee.Phone || "—"}</td>
                    <td className="text-sm text-gray-600">
                      {employee.Designation || "—"}
                    </td>

                    {/* Status */}
                    <td className="text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          employee.EmploymentStatus === "Resigned"
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : employee.EmploymentStatus === "Terminated"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {employee.EmploymentStatus}
                      </span>
                    </td>

                    {/* Action */}
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

export default PastEmployees;
