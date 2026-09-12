import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  MdRestaurantMenu,
  MdPrint,
  MdArrowBack,
  MdReceiptLong,
} from "react-icons/md";
import useAxios from "../../../../../hooks/useAxios";

const RestaurantInvoice = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();

  const { data: order, isLoading } = useQuery({
    queryKey: ["restaurant-order", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/restaurant-orders/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-rose-700"></span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <MdReceiptLong className="text-6xl text-gray-300 mb-4" />
        <p className="text-lg font-semibold text-gray-600">Order not found</p>
      </div>
    );
  }

  /*
   * ============================================================
   * REUSABLE INVOICE CONTENT
   * ============================================================
   *
   * We render this component twice:
   *
   * 1. Top half of A4
   * 2. Bottom half of A4
   *
   * Both copies use exactly the same order data.
   */
  const InvoiceContent = () => {
    return (
      <div className="invoice-print-content bg-white overflow-hidden">
        {/* Rose top border */}
        <div className="h-2 bg-rose-700"></div>

        <div className="p-8">
          {/* ================= HEADER ================= */}
          <div className="flex justify-between items-start pb-6 border-b border-gray-200 no-break">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
                  <MdRestaurantMenu className="text-2xl text-rose-700" />
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold text-gray-800 tracking-wide">
                    HOTEL NAME
                  </h2>

                  <p className="text-sm text-gray-500">Restaurant & Dining</p>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-3">
                Premium dining experience
              </p>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-3">
                Restaurant Invoice
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-semibold text-gray-700">
                    Invoice No:
                  </span>{" "}
                  INV-R-{order._id?.slice(-6).toUpperCase()}
                </p>

                <p>
                  <span className="font-semibold text-gray-700">Date:</span>{" "}
                  {order.orderDate || "—"}
                </p>

                <p>
                  <span className="font-semibold text-gray-700">Time:</span>{" "}
                  {order.orderTime || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* ================= GUEST INFO ================= */}
          <div className="py-6 no-break">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Guest Information
            </h3>

            <div className="grid grid-cols-4 gap-3">
              {/* Guest Name */}
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                <p className="text-xs text-gray-400 mb-1">Guest Name</p>

                <p className="font-semibold text-gray-800 text-sm">
                  {order.guestName || "—"}
                </p>
              </div>

              {/* Room Number */}
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                <p className="text-xs text-gray-400 mb-1">Room Number</p>

                <p className="font-semibold text-gray-800 text-sm">
                  {order.roomNumber ? `Room ${order.roomNumber}` : "Walk-in"}
                </p>
              </div>

              {/* Waiter */}
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                <p className="text-xs text-gray-400 mb-1">Waiter</p>

                <p className="font-semibold text-gray-800 text-sm">
                  {order.assignedWaiter || "—"}
                </p>
              </div>

              {/* Payment Method */}
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                <p className="text-xs text-gray-400 mb-1">Payment Method</p>

                <p className="font-semibold text-gray-800 text-sm">
                  {order.paymentMethod || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* ================= ITEMS ================= */}
          <div className="no-break">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Order Summary
              </h3>

              <span className="text-xs text-gray-400">
                {order.foodItems?.length || 0} item
                {order.foodItems?.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                    <th className="text-left font-semibold px-4 py-3">Item</th>

                    <th className="text-center font-semibold px-2 py-3">Qty</th>

                    <th className="text-right font-semibold px-4 py-3">
                      Price
                    </th>

                    <th className="text-right font-semibold px-4 py-3">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {order.foodItems?.map((item, index) => (
                    <tr key={index} className="border-t border-gray-100">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>

                          <span className="font-medium text-gray-800 text-sm">
                            {item.itemName}
                          </span>
                        </div>
                      </td>

                      <td className="text-center px-2 py-3">
                        <span className="inline-flex min-w-7 justify-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                          {item.quantity}
                        </span>
                      </td>

                      <td className="text-right px-4 py-3 text-gray-600 text-sm">
                        ৳{Number(item.price || 0).toLocaleString()}
                      </td>

                      <td className="text-right px-4 py-3 font-semibold text-gray-800 text-sm">
                        ৳
                        {(
                          Number(item.quantity || 0) * Number(item.price || 0)
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ================= TOTAL ================= */}
          <div className="flex justify-end mt-5 no-break">
            <div className="w-80">
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-500">Payment Status</span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      order.paymentStatus === "Paid"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {order.paymentStatus || "Pending"}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3 flex justify-between items-end">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      Total Amount
                    </p>

                    <p className="text-xs text-gray-500 mt-1">Amount payable</p>
                  </div>

                  <span className="text-2xl font-extrabold text-rose-700">
                    ৳{Number(order.totalAmount || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= FOOTER ================= */}
          <div className="mt-7 pt-5 border-t border-gray-200 text-center no-break">
            <p className="font-semibold text-gray-700 text-sm">
              Thank you for dining with us!
            </p>

            <p className="text-xs text-gray-400 mt-1">
              We hope to serve you again soon.
            </p>

            <p className="text-[10px] text-gray-300 mt-3">
              This is a computer-generated invoice and does not require a
              signature.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* =====================================================
          PRINT CSS
      ====================================================== */}
      <style>
        {`
          @page {
            size: A4 portrait;
            margin: 0;
          }

          @media print {

            /* Hide everything first */
            body * {
              visibility: hidden !important;
            }

            html,
            body {
              width: 210mm !important;
              height: 297mm !important;

              margin: 0 !important;
              padding: 0 !important;

              overflow: hidden !important;

              background: white !important;
            }

            /* Show only our print area */
            .invoice-print-area,
            .invoice-print-area * {
              visibility: visible !important;
            }

            /*
             * Full A4 page
             *
             * 210mm x 297mm
             */
            .invoice-print-area {
              position: fixed !important;

              top: 0 !important;
              left: 0 !important;

              width: 210mm !important;
              height: 297mm !important;

              margin: 0 !important;
              padding: 0 !important;

              overflow: hidden !important;

              background: white !important;
            }

            /*
             * Each invoice occupies half
             * of the A4 page.
             *
             * A4 height = 297mm
             * Half = 148.5mm
             */
            .invoice-copy {
              position: relative !important;

              width: 210mm !important;
              height: 148.5mm !important;

              box-sizing: border-box !important;

              overflow: hidden !important;

              background: white !important;

              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            /*
             * Small dotted cutting line
             * between the two invoices.
             */
            .invoice-copy:first-child {
              border-bottom: 1px dashed #999 !important;
            }

            /*
             * The original invoice is too tall
             * for half of an A4 page.
             *
             * Scale it down to fit.
             */
            .invoice-print-content {
              width: 100% !important;
              height: 100% !important;

              transform: scale(0.72) !important;
              transform-origin: top left !important;

              /*
               * Because scale is 0.72,
               * increase width so the original
               * content still uses the available
               * horizontal space.
               */
              width: 138.88% !important;

              box-shadow: none !important;
              border: none !important;
              border-radius: 0 !important;

              margin: 0 !important;
            }

            /* Hide buttons */
            .print-hidden {
              display: none !important;
            }

            /*
             * Prevent table content from
             * creating another page.
             */
            table,
            tbody,
            tr {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            .no-break {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
          }
        `}
      </style>

      {/* =====================================================
          NORMAL PAGE
      ====================================================== */}
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* ================= NORMAL HEADER ================= */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print-hidden">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-rose-700 flex items-center justify-center shadow-md">
                <MdRestaurantMenu className="text-2xl text-white" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Restaurant Invoice
                </h1>

                <p className="text-sm text-gray-500">
                  Order #{order._id?.slice(-6).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Back Button */}
              <Link to="/dashboard/services/restaurant_orders/restaurant_orders_history">
                <button
                  type="button"
                  className="h-10 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all flex items-center gap-2"
                >
                  <MdArrowBack />
                  <span>Back</span>
                </button>
              </Link>

              {/* Print Button */}
              <button
                onClick={() => window.print()}
                type="button"
                className="h-10 px-4 rounded-lg bg-rose-700 text-white hover:bg-rose-800 shadow-sm transition-all flex items-center gap-2"
              >
                <MdPrint className="text-lg" />
                Print Invoice
              </button>
            </div>
          </div>

          {/* =====================================================
              INVOICE PRINT AREA

              TWO COPIES WILL BE PRINTED ON ONE A4 PAGE
          ====================================================== */}
          <div className="invoice-print-area">
            {/* =================================================
                COPY 1
            ================================================== */}
            <div className="invoice-copy">
              <InvoiceContent />
            </div>

            {/* =================================================
                COPY 2
            ================================================== */}
            <div className="invoice-copy">
              <InvoiceContent />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantInvoice;
