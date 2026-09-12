import { Link } from "react-router";
import { FaMoneyCheckAlt, FaUndoAlt, FaHistory } from "react-icons/fa";
import { RiCoinsFill } from "react-icons/ri";

const Billing_and_Payments = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
          <RiCoinsFill className="text-xl text-white" />
        </div>

        <h1 className="text-lg font-bold text-rose-700">Billing & Payments</h1>
      </div>

      <p className="text-gray-500 mb-10">
        Manage invoices, payments, refunds, and transaction history.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Guest Invoices */}

        {/* Dues */}
        <Link
          to="/dashboard/billing_and_payments/dues"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaMoneyCheckAlt className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">All Dues</h2>

          <p className="text-gray-600 text-sm">
            Record guest due payments and monitor transactions.
          </p>
        </Link>

        {/* Refunds */}
        <Link
          to="/dashboard/billing_and_payments/refunds"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaUndoAlt className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">Refunds</h2>

          <p className="text-gray-600 text-sm">
            Process and track guest refunds for cancelled bookings.
          </p>
        </Link>

        {/* Payment History */}
        <Link
          to="/dashboard/billing_and_payments/payment_history"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaHistory className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Payment History
          </h2>

          <p className="text-gray-600 text-sm">
            View the complete history of invoices, payments, and refunds.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Billing_and_Payments;
