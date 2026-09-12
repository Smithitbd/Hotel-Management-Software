import { useQuery } from "@tanstack/react-query";
import { MdLocalLaundryService, MdWorkHistory } from "react-icons/md";
import { RiHome3Line } from "react-icons/ri";
import { Link } from "react-router";
import useAxios from "../../../../hooks/useAxios";

const LaundryServiceHistory = () => {
  const axiosInstance = useAxios();

  const {
    data: laundryOrders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["laundry-service-history"],
    queryFn: async () => {
      const res = await axiosInstance.get("/laundry-service");
      return res.data;
    },
  });

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-rose-700 flex items-center justify-center shadow-md">
              <MdWorkHistory className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-rose-700">
                Laundry Service History
              </h1>
              <p className="text-sm text-gray-500">
                View all previous laundry service requests.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/dashboard/services/laundry_service">
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
              title="New Laundry Request"
            >
              <MdLocalLaundryService className="text-xl" />
            </button>
          </Link>

          <Link to="/dashboard/services">
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
              title="Back to Services"
            >
              <RiHome3Line className="text-xl" />
            </button>
          </Link>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-rose-700"></span>
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-red-500 font-medium">
            Failed to load laundry history. Please try again.
          </div>
        ) : laundryOrders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No laundry service requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              {/* head */}
              <thead>
                <tr className="bg-rose-50 text-rose-800 text-sm">
                  <th className="font-semibold py-4">#</th>
                  <th className="font-semibold">Room</th>
                  <th className="font-semibold">Guest Name</th>
                  <th className="font-semibold">Laundry Type</th>
                  <th className="font-semibold">Pickup</th>
                  <th className="font-semibold">Delivery</th>
                  <th className="font-semibold">Staff</th>
                  <th className="font-semibold">Items</th>
                  <th className="font-semibold text-right">Total Cost</th>
                  <th className="font-semibold text-center">Payment</th>
                </tr>
              </thead>

              <tbody>
                {laundryOrders.map((order, index) => (
                  <tr
                    key={order._id}
                    className="hover:bg-rose-50/50 border-b border-gray-100"
                  >
                    <td className="font-medium text-gray-500">{index + 1}</td>

                    <td>
                      <span className="font-semibold text-gray-800">
                        Room {order.roomNumber}
                      </span>
                    </td>

                    <td className="font-medium">{order.guestName || "—"}</td>

                    <td>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700 border border-rose-200">
                        {order.laundryType}
                      </span>
                    </td>

                    <td className="text-sm text-gray-600">
                      {order.pickupDate || "—"}
                    </td>

                    <td className="text-sm text-gray-600">
                      {order.deliveryDate || "—"}
                    </td>

                    <td className="text-sm">{order.assignedStaff || "—"}</td>

                    {/* Items - Cleaner look */}
                    <td>
                      <div className="space-y-1">
                        {order.clothItems?.map((item, i) => (
                          <div
                            key={i}
                            className="text-sm text-gray-700 flex items-center gap-1"
                          >
                            <span className="font-medium">
                              {item.clothName}
                            </span>
                            <span className="text-gray-400">×</span>
                            <span className="text-gray-600">
                              {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total Cost */}
                    <td className="text-right">
                      <span className="font-bold text-rose-700 text-base">
                        ৳{Number(order.totalCost || 0).toLocaleString()}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          order.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-amber-100 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaundryServiceHistory;
