import { Link } from "react-router";
import { FaUsers, FaUserClock, FaUserPlus } from "react-icons/fa";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { SiStaffbase } from "react-icons/si";

const Employee = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
          <SiStaffbase className="text-xl text-white" />
        </div>

        <h1 className="text-lg font-bold text-rose-700">Employee Management</h1>
      </div>

      <p className="text-gray-500 mb-10">
        Manage all employee records from one place.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {/* Current Employees */}
        <Link
          to="/dashboard/employees/current_employees"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaUsers className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Current Employees
          </h2>

          <p className="text-gray-600 text-sm">
            View and manage all active employees working in the hotel.
          </p>
        </Link>

        {/* Past Employees */}
        <Link
          to="/dashboard/employees/past_employees"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaUserClock className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Past Employees
          </h2>

          <p className="text-gray-600 text-sm">
            Access records of former employees and their employment history.
          </p>
        </Link>

        {/* Payroll */}
        <Link
          to="/dashboard/employees/payroll"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaMoneyCheckDollar className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">Payroll</h2>

          <p className="text-gray-600 text-sm">
            Manage employee salaries, payroll records, allowances, and
            deductions.
          </p>
        </Link>

        {/* Add Employee */}
        <Link
          to="/dashboard/employees/add_employee"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaUserPlus className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">Add Employee</h2>

          <p className="text-gray-600 text-sm">
            Register a new employee, assign their department, role, and manage
            staff information.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Employee;
