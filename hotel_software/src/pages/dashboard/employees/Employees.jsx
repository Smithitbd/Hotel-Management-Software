import { Link } from "react-router";
import { FaUsers, FaUserClock, FaUserPlus } from "react-icons/fa";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { SiStaffbase } from "react-icons/si";
import PageHeader from "../../../components/PageHeader"; // adjust path if needed

const Employee = () => {
  return (
    <div className="mx-auto p-4 sm:p-6 max-w-6xl">
      {/* ===== Page Header (Title + Logout) ===== */}
      <PageHeader
        title="Employee Management"
        subtitle="Manage all employee records from one place."
        icon={<SiStaffbase className="text-xl text-white" />}
      />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8 mt-2">
        {/* Current Employees */}
        <Link
          to="/dashboard/employees/current_employees"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-rose-900"
        >
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-rose-900">
            <FaUsers className="text-2xl text-rose-900 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-900 mb-3">
            Current Employees
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            View and manage all active employees working in the hotel.
          </p>
        </Link>

        {/* Past Employees */}
        <Link
          to="/dashboard/employees/past_employees"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-rose-900"
        >
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-rose-900">
            <FaUserClock className="text-2xl text-rose-900 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-900 mb-3">
            Past Employees
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            Access records of former employees and their employment history.
          </p>
        </Link>

        {/* Payroll */}
        <Link
          to="/dashboard/employees/payroll"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-rose-900"
        >
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-rose-900">
            <FaMoneyCheckDollar className="text-2xl text-rose-900 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-900 mb-3">Payroll</h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            Manage employee salaries, payroll records, allowances, and
            deductions.
          </p>
        </Link>

        {/* Add Employee */}
        <Link
          to="/dashboard/employees/add_employee"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-rose-900"
        >
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-rose-900">
            <FaUserPlus className="text-2xl text-rose-900 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-900 mb-3">Add Employee</h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            Register a new employee, assign their department, role, and manage
            staff information.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Employee;
