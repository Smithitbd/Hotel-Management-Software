import { Link } from "react-router";
import { FaMoneyCheckAlt, FaHistory } from "react-icons/fa";
import { RiHome3Line } from "react-icons/ri";

const Payroll = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <FaMoneyCheckAlt className="text-xl text-white" />
            </div>
            <h1 className="text-lg font-bold text-rose-700">
              Payroll Management
            </h1>
          </div>
          <p className="text-gray-500 ml-12">
            Manage employee salaries, bonuses, and deductions by month.
          </p>
        </div>

        <Link to="/dashboard/employees">
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
          >
            <RiHome3Line className="text-xl" />
          </button>
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Assign New Salary Structure */}
        <Link
          to="/dashboard/employees/payroll/assign-new-salary-structure"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaMoneyCheckAlt className="text-3xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-xl font-bold text-[#BF1E2E] mb-3">
            Assign New Salary Structure
          </h2>

          <p className="text-gray-600 text-sm">
            Create and assign salary structure for employees including basic
            salary, bonuses, and deductions.
          </p>
        </Link>

        {/* Payroll History */}
        <Link
          to="/dashboard/employees/payroll/payroll-history"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaHistory className="text-3xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-xl font-bold text-[#BF1E2E] mb-3">
            Payroll History
          </h2>

          <p className="text-gray-600 text-sm">
            Browse historical payroll records by selecting any previous month
            and year. Review past salaries, bonuses, and deductions.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Payroll;
