import { Link } from "react-router";
import { FaUsers, FaUserClock, FaUserPlus } from "react-icons/fa";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { SiStaffbase } from "react-icons/si";
import PageHeader from "../../../components/PageHeader";

const Employee = () => {
  return (
    <div className="mx-auto p-4 sm:p-6 max-w-6xl">
      {/* ===== Page Header ===== */}
      <PageHeader
        title="Employee Management"
        subtitle="Manage all employee records from one place."
        icon={<SiStaffbase className="text-xl text-white" />}
      />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8 mt-2">
        {/* Current Employees - Violet */}
        <Link
          to="/dashboard/employees/current_employees"
          className="group bg-white rounded-2xl shadow-md border border-violet-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-violet-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center mb-6 shadow-md shadow-violet-200 group-hover:scale-110 transition-transform">
            <FaUsers className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-violet-800 mb-2">
            Current Employees
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            View and manage all active employees working in the hotel.
          </p>
        </Link>

        {/* Past Employees - Slate */}
        <Link
          to="/dashboard/employees/past_employees"
          className="group bg-white rounded-2xl shadow-md border border-slate-200 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-slate-400"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center mb-6 shadow-md shadow-slate-200 group-hover:scale-110 transition-transform">
            <FaUserClock className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">
            Past Employees
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Access records of former employees and their employment history.
          </p>
        </Link>

        {/* Payroll - Emerald */}
        <Link
          to="/dashboard/employees/payroll"
          className="group bg-white rounded-2xl shadow-md border border-emerald-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-emerald-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mb-6 shadow-md shadow-emerald-200 group-hover:scale-110 transition-transform">
            <FaMoneyCheckDollar className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-emerald-800 mb-2">Payroll</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Manage employee salaries, payroll records, allowances, and
            deductions.
          </p>
        </Link>

        {/* Add Employee - Sky */}
        <Link
          to="/dashboard/employees/add_employee"
          className="group bg-white rounded-2xl shadow-md border border-sky-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-sky-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center mb-6 shadow-md shadow-sky-200 group-hover:scale-110 transition-transform">
            <FaUserPlus className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-sky-800 mb-2">Add Employee</h2>
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
