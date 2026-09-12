import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { FaEye, FaPhone, FaIdCard, FaCalendarAlt } from "react-icons/fa";
import { MdCheckCircleOutline } from "react-icons/md";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import useAxios from "../../../../hooks/useAxios";

const PaymentHistory = () => {
  const axiosInstance = useAxios();

  const { data: checkouts = [], isLoading } = useQuery({
    queryKey: ["checkout-list"],
    queryFn: async () => {
      const res = await axiosInstance.get("/check-out");
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

  return (
    <div className="p-6">
      {/* ====================== HEADER ====================== */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
            <MdCheckCircleOutline className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-rose-700">Checkout List</h1>
            <p className="text-sm text-gray-500">
              All checked-out guests history
            </p>
          </div>
        </div>

        <Link to="/dashboard/billing_and_payments">
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
            title="Back"
          >
            <IoArrowBackCircleSharp className="text-2xl" />
          </button>
        </Link>
      </div>

      {/* ====================== TABLE ====================== */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* head */}
            <thead className="bg-rose-50 text-rose-800">
              <tr>
                <th className="font-semibold">Guest</th>
                <th className="font-semibold">Contact</th>
                <th className="font-semibold">Room</th>
                <th className="font-semibold">Stay Period</th>
                <th className="font-semibold">Nights</th>
                <th className="font-semibold">Total Amount</th>
                <th className="font-semibold">Checkout Date</th>
                <th className="font-semibold text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {checkouts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-16 text-gray-400">
                    No checkout records found
                  </td>
                </tr>
              ) : (
                checkouts.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    {/* Guest + Image */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-full ring ring-rose-200 ring-offset-1">
                            {item.personImage ? (
                              <img
                                src={`${
                                  import.meta.env.VITE_API_URL ||
                                  "http://localhost:3000"
                                }${item.personImage}`}
                                alt={item.guestName}
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold text-lg">
                                {item.guestName?.charAt(0)?.toUpperCase()}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">
                            {item.guestName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.designation || "Guest"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td>
                      <div className="flex items-center gap-1 text-sm">
                        <FaPhone className="text-rose-600 text-xs" />
                        {item.contactNumber || "—"}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <FaIdCard className="text-xs" />
                        {item.nidNumber || "—"}
                      </div>
                    </td>

                    {/* Room */}
                    <td>
                      <div className="font-medium">{item.roomNumber}</div>
                      <div className="text-xs text-gray-500">
                        {item.roomVariantName}
                      </div>
                    </td>

                    {/* Stay Period */}
                    <td>
                      <div className="text-sm">
                        <span className="text-gray-500">In:</span>{" "}
                        {item.checkInDate}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Out:</span>{" "}
                        {item.actualCheckoutDate || item.checkOutDate}
                      </div>
                    </td>

                    {/* Nights */}
                    <td>
                      <span className="font-medium">
                        {item.actualNights || item.numberOfNights} nights
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td>
                      <div className="font-bold text-rose-700">
                        ৳
                        {(
                          item.totalCharges ||
                          item.actualRoomCharge ||
                          item.totalAmount ||
                          0
                        ).toLocaleString()}
                      </div>
                      {item.isRefund && (
                        <div className="text-xs text-green-600">Refunded</div>
                      )}
                    </td>

                    {/* Checkout Date */}
                    <td>
                      <div className="flex items-center gap-1 text-sm">
                        <FaCalendarAlt className="text-rose-600 text-xs" />
                        {item.checkedOutAt
                          ? new Date(item.checkedOutAt).toLocaleDateString(
                              "en-GB",
                            )
                          : "—"}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="text-center">
                      <Link
                        to={`/dashboard/billing_and_payments/checkout_details/${item._id}`}
                        className="btn btn-sm btn-ghost text-rose-700 hover:bg-rose-50"
                        title="View Details"
                      >
                        <FaEye />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
