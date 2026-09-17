import { Link } from "react-router";
import { FaChartLine, FaBed, FaMoneyCheckAlt, FaReceipt } from "react-icons/fa";
import { MdAssessment } from "react-icons/md";
import PageHeader from "../../../components/PageHeader";

const Reports = () => {
  return (
    <div className="p-6">
      {/* ===== Page Header ===== */}
      <PageHeader
        title="Reports"
        subtitle="View and generate detailed reports for sales, rooms, salaries, expenses, and services."
        icon={<MdAssessment className="text-xl text-white" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
        {/* Sales Report - Rose */}
        <Link
          to="/dashboard/reports/sales_report"
          className="group bg-white rounded-2xl shadow-md border border-rose-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-rose-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center mb-6 shadow-md shadow-rose-200 group-hover:scale-110 transition-transform">
            <FaChartLine className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-rose-800 mb-2">Sales Report</h2>
          <p className="text-gray-600 text-sm">
            Track revenue, bookings, and overall sales performance.
          </p>
        </Link>

        {/* Room Report - Violet */}
        <Link
          to="/dashboard/reports/room_report"
          className="group bg-white rounded-2xl shadow-md border border-violet-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-violet-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center mb-6 shadow-md shadow-violet-200 group-hover:scale-110 transition-transform">
            <FaBed className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-violet-800 mb-2">
            Room Report
          </h2>
          <p className="text-gray-600 text-sm">
            Monitor room occupancy, availability, and booking statistics.
          </p>
        </Link>

        {/* Salary Report - Emerald */}
        <Link
          to="/dashboard/reports/salary_report"
          className="group bg-white rounded-2xl shadow-md border border-emerald-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-emerald-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mb-6 shadow-md shadow-emerald-200 group-hover:scale-110 transition-transform">
            <FaMoneyCheckAlt className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-emerald-800 mb-2">
            Salary Report
          </h2>
          <p className="text-gray-600 text-sm">
            View employee salary payments, history, and payroll summary.
          </p>
        </Link>

        {/* Expense Report - Amber */}
        <Link
          to="/dashboard/reports/expense_report"
          className="group bg-white rounded-2xl shadow-md border border-amber-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-amber-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center mb-6 shadow-md shadow-amber-200 group-hover:scale-110 transition-transform">
            <FaReceipt className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-amber-800 mb-2">
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
