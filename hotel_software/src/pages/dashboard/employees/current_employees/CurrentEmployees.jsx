import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../hooks/useAxios";
import { Link } from "react-router";
import { FaUsers } from "react-icons/fa";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";

const CurrentEmployees = () => {
  const axiosInstance = useAxios();

  // Active employees
  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ["activeEmployees"],
    queryFn: async () => {
      const res = await axiosInstance.get("/employees/active");
      return res.data;
    },
  });

  // Salary structures
  const { data: salaryStructures = [], isLoading: salaryLoading } = useQuery({
    queryKey: ["salary-structures"],
    queryFn: async () => {
      const res = await axiosInstance.get("/salary-structures");
      return res.data;
    },
  });

  const isLoading = employeesLoading || salaryLoading;

  // Find salary structure for an employee
  const getSalary = (employeeId) => {
    return salaryStructures.find((s) => s.employeeId === employeeId);
  };

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-rose-700 flex items-center justify-center shadow-md">
              <FaUsers className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-rose-700">
                Current Employees
              </h1>
              <p className="text-sm text-gray-500">
                View and manage salary structures
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
          <h2 className="text-lg font-bold">Current Employees</h2>
          <p className="text-sm text-rose-100">
            View and manage salary structures
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-rose-700"></span>
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No active employees found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-rose-50 text-rose-800 text-sm">
                  <th className="font-semibold">Image</th>
                  <th className="font-semibold">Name</th>
                  <th className="font-semibold">Role</th>
                  <th className="font-semibold">Phone</th>
                  <th className="font-semibold text-right">Basic</th>
                  <th className="font-semibold text-right">HRA</th>
                  <th className="font-semibold text-right">Medical</th>
                  <th className="font-semibold text-right">Academic</th>
                  <th className="font-semibold text-right">Transport</th>
                  <th className="font-semibold text-right">Bonus</th>
                  <th className="font-semibold text-right">Gross</th>
                  <th className="font-semibold text-center">Status</th>
                  <th className="font-semibold text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((employee) => {
                  const salary = getSalary(employee._id);

                  return (
                    <tr
                      key={employee._id}
                      className="hover:bg-rose-50/50 border-b border-gray-100"
                    >
                      {/* Image */}
                      <td>
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12 bg-gray-200">
                            {employee.Image ? (
                              <img
                                src={`http://localhost:3000${employee.Image}`}
                                alt={employee.FullName}
                              />
                            ) : null}
                          </div>
                        </div>
                      </td>

                      <td className="font-medium">{employee.FullName}</td>
                      <td className="text-sm text-gray-600">
                        {employee.Designation || "—"}
                      </td>

                      {/* Phone */}
                      <td className="text-sm">{employee.Phone || "—"}</td>

                      <td className="text-right">
                        ৳{(salary?.basicSalary || 0).toLocaleString()}
                      </td>
                      <td className="text-right">
                        ৳{(salary?.hra || 0).toLocaleString()}
                      </td>
                      <td className="text-right">
                        ৳{(salary?.medicalAllowance || 0).toLocaleString()}
                      </td>
                      <td className="text-right">
                        ৳{(salary?.academicAllowance || 0).toLocaleString()}
                      </td>
                      <td className="text-right">
                        ৳{(salary?.transportAllowance || 0).toLocaleString()}
                      </td>
                      <td className="text-right">
                        ৳{(salary?.festivalBonus || 0).toLocaleString()}
                      </td>
                      <td className="text-right font-bold text-rose-700">
                        ৳{(salary?.grossMonthlyPay || 0).toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            employee.EmploymentStatus === "Active"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : employee.EmploymentStatus === "On Leave"
                                ? "bg-amber-100 text-amber-700 border border-amber-200"
                                : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          {employee.EmploymentStatus}
                        </span>
                      </td>

                      {/* Action */}
                      <td>
                        <div className="flex items-center justify-center gap-2">
                          {/* Edit Button */}
                          <Link
                            to={`/dashboard/employees/edit/${employee._id}`}
                          >
                            <button
                              type="button"
                              className="btn btn-sm btn-outline border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white gap-1"
                            >
                              <MdEdit />
                              Edit
                            </button>
                          </Link>

                          {/* Make Salary / No Setup */}
                          {salary ? (
                            <Link
                              to={`/dashboard/payroll/make-salary/${employee._id}`}
                            >
                              <button className="p-5   btn btn-sm bg-rose-700 text-white hover:bg-rose-800 border-none">
                                Make Salary
                              </button>
                            </Link>
                          ) : (
                            <span className="text-red-500 text-sm font-medium">
                              No Setup
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentEmployees;
