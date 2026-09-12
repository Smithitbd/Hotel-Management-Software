import { Link } from "react-router";
import {
  FaChartLine,
  FaBed,
  FaMoneyCheckAlt,
  FaReceipt,
  FaConciergeBell,
} from "react-icons/fa";
import { MdAssessment } from "react-icons/md";

const Reports = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
          <MdAssessment className="text-xl text-white" />
        </div>

        <h1 className="text-lg font-bold text-rose-700">Reports</h1>
      </div>

      <p className="text-gray-500 mb-10">
        View and generate detailed reports for sales, rooms, salaries, expenses,
        and services.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Sales Report */}
        <Link
          to="/dashboard/reports/sales_report"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaChartLine className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">Sales Report</h2>

          <p className="text-gray-600 text-sm">
            Track revenue, bookings, and overall sales performance.
          </p>
        </Link>

        {/* Room Report */}
        <Link
          to="/dashboard/reports/room_report"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaBed className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">Room Report</h2>

          <p className="text-gray-600 text-sm">
            Monitor room occupancy, availability, and booking statistics.
          </p>
        </Link>

        {/* Salary Report */}
        <Link
          to="/dashboard/reports/salary_report"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaMoneyCheckAlt className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Salary Report
          </h2>

          <p className="text-gray-600 text-sm">
            View employee salary payments, history, and payroll summary.
          </p>
        </Link>

        {/* Expense Report */}
        <Link
          to="/dashboard/reports/expense_report"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaReceipt className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Expense Report
          </h2>

          <p className="text-gray-600 text-sm">
            Track hotel expenses, categories, and spending analysis.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Reports;
