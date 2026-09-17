import { Link } from "react-router";
import { FaMoneyCheckAlt, FaUndoAlt, FaHistory } from "react-icons/fa";
import { RiCoinsFill } from "react-icons/ri";
import PageHeader from "../../../components/PageHeader";

const Billing_and_Payments = () => {
  return (
    <div className="mx-auto p-4 sm:p-6 max-w-6xl">
      {/* ===== Page Header ===== */}
      <PageHeader
        title="Billing & Payments"
        subtitle="Manage invoices, payments, refunds, and transaction history."
        icon={<RiCoinsFill className="text-xl text-white" />}
      />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 mt-2">
        {/* All Dues - Rose */}
        <Link
          to="/dashboard/billing_and_payments/dues"
          className="group bg-white rounded-2xl shadow-md border border-rose-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-rose-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center mb-6 shadow-md shadow-rose-200 group-hover:scale-110 transition-transform">
            <FaMoneyCheckAlt className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-rose-800 mb-2">All Dues</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Record guest due payments and monitor transactions.
          </p>
        </Link>

        {/* Refunds - Amber */}
        <Link
          to="/dashboard/billing_and_payments/refunds"
          className="group bg-white rounded-2xl shadow-md border border-amber-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-amber-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center mb-6 shadow-md shadow-amber-200 group-hover:scale-110 transition-transform">
            <FaUndoAlt className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-amber-800 mb-2">Refunds</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Process and track guest refunds for cancelled bookings.
          </p>
        </Link>

        {/* Payment History - Sky */}
        <Link
          to="/dashboard/billing_and_payments/payment_history"
          className="group bg-white rounded-2xl shadow-md border border-sky-100 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-sky-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center mb-6 shadow-md shadow-sky-200 group-hover:scale-110 transition-transform">
            <FaHistory className="text-2xl text-white" />
          </div>
          <h2 className="text-lg font-bold text-sky-800 mb-2">
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
