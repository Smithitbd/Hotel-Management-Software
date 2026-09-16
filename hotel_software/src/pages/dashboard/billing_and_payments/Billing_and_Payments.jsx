import { Link } from "react-router";
import { FaMoneyCheckAlt, FaUndoAlt, FaHistory } from "react-icons/fa";
import { RiCoinsFill } from "react-icons/ri";
import PageHeader from "../../../components/PageHeader"; // adjust path if needed

const Billing_and_Payments = () => {
  return (
    <div className="mx-auto p-4 sm:p-6 max-w-6xl">
      {/* ===== Page Header (Title + Logout) ===== */}
      <PageHeader
        title="Billing & Payments"
        subtitle="Manage invoices, payments, refunds, and transaction history."
        icon={<RiCoinsFill className="text-xl text-white" />}
      />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 mt-2">
        {/* All Dues */}
        <Link
          to="/dashboard/billing_and_payments/dues"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-rose-900"
        >
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-rose-900">
            <FaMoneyCheckAlt className="text-2xl text-rose-900 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-900 mb-3">All Dues</h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            Record guest due payments and monitor transactions.
          </p>
        </Link>

        {/* Refunds */}
        <Link
          to="/dashboard/billing_and_payments/refunds"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-rose-900"
        >
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-rose-900">
            <FaUndoAlt className="text-2xl text-rose-900 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-900 mb-3">Refunds</h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            Process and track guest refunds for cancelled bookings.
          </p>
        </Link>

        {/* Payment History */}
        <Link
          to="/dashboard/billing_and_payments/payment_history"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-rose-900"
        >
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-rose-900">
            <FaHistory className="text-2xl text-rose-900 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-900 mb-3">
            Payment History
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            View the complete history of invoices, payments, and refunds.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Billing_and_Payments;
