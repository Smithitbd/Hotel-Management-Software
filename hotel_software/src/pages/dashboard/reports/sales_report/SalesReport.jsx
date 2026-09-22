import { Link } from "react-router";
import { FaCar, FaUtensils, FaTshirt, FaArrowLeft } from "react-icons/fa";
import { MdAssessment } from "react-icons/md";
import { RiHome3Line } from "react-icons/ri";

const SalesReport = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-900 flex items-center justify-center">
            <MdAssessment className="text-xl text-white" />
          </div>
          <h1 className="text-lg font-bold text-rose-900">Sales Report</h1>
        </div>

        <Link to="/dashboard/reports">
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 border border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white rounded-lg transition-colors"
          >
            <RiHome3Line className="text-xl" />
          </button>
        </Link>
      </div>

      <p className="text-gray-500 mb-10">
        View and generate detailed sales reports for transportation, restaurant,
        and laundry services.
      </p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Transportation Sales - Emerald */}
        <Link
          to="/dashboard/reports/sales_report/transportation_sales"
          className="group bg-white rounded-2xl shadow-md border border-emerald-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-emerald-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mb-6 shadow-md shadow-emerald-200 group-hover:scale-110 transition-transform">
            <FaCar className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-emerald-800 mb-2">
            Transportation Sales
          </h2>
          <p className="text-gray-600 text-sm">
            Track revenue and performance from transportation services.
          </p>
        </Link>

        {/* Restaurant Sales - Orange */}
        <Link
          to="/dashboard/reports/sales_report/restaurant_sales"
          className="group bg-white rounded-2xl shadow-md border border-orange-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-orange-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mb-6 shadow-md shadow-orange-200 group-hover:scale-110 transition-transform">
            <FaUtensils className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-orange-800 mb-2">
            Restaurant Sales
          </h2>
          <p className="text-gray-600 text-sm">
            Monitor food & beverage sales and restaurant performance.
          </p>
        </Link>

        {/* Laundry Sales - Sky */}
        <Link
          to="/dashboard/reports/sales_report/laundry_sales"
          className="group bg-white rounded-2xl shadow-md border border-sky-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-sky-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center mb-6 shadow-md shadow-sky-200 group-hover:scale-110 transition-transform">
            <FaTshirt className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-sky-800 mb-2">Laundry Sales</h2>
          <p className="text-gray-600 text-sm">
            Analyze laundry service revenue and usage statistics.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default SalesReport;
