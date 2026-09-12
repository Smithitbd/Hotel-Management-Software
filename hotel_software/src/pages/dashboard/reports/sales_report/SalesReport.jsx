import { Link } from "react-router";
import { FaCar, FaUtensils, FaTshirt, FaArrowLeft } from "react-icons/fa";
import { MdAssessment } from "react-icons/md";

const SalesReport = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {/* Left side - Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
            <MdAssessment className="text-xl text-white" />
          </div>
          <h1 className="text-lg font-bold text-rose-700">Sales Report</h1>
        </div>

        {/* Right side - Back Icon Button */}
        <Link
          to="/dashboard/reports"
          className="w-9 h-9 flex items-center justify-center bg-rose-700 text-white rounded-lg hover:bg-[#BF1E2E] transition-all duration-300 shadow-md"
          title="Back"
        >
          <FaArrowLeft className="text-lg" />
        </Link>
      </div>

      <p className="text-gray-500 mb-10">
        View and generate detailed sales reports for transportation, restaurant,
        and laundry services.
      </p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Transportation Sales */}
        <Link
          to="/dashboard/reports/sales_report/transportation_sales"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaCar className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Transportation Sales
          </h2>

          <p className="text-gray-600 text-sm">
            Track revenue and performance from transportation services.
          </p>
        </Link>

        {/* Restaurant Sales */}
        <Link
          to="/dashboard/reports/sales_report/restaurant_sales"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaUtensils className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Restaurant Sales
          </h2>

          <p className="text-gray-600 text-sm">
            Monitor food & beverage sales and restaurant performance.
          </p>
        </Link>

        {/* Laundry Sales */}
        <Link
          to="/dashboard/reports/sales_report/laundry_sales"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaTshirt className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Laundry Sales
          </h2>

          <p className="text-gray-600 text-sm">
            Analyze laundry service revenue and usage statistics.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default SalesReport;
