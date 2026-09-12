import { useQuery } from "@tanstack/react-query";
import { MdEdit, MdRestaurantMenu, MdWorkHistory } from "react-icons/md";
import { RiHome3Line } from "react-icons/ri";
import { Link } from "react-router";
import useAxios from "../../../../hooks/useAxios";
import { FaFileInvoiceDollar } from "react-icons/fa";

const RestaurantOrdersHistory = () => {
  const axiosInstance = useAxios();

  const {
    data: restaurantOrders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["restaurant-orders-history"],
    queryFn: async () => {
      const res = await axiosInstance.get("/restaurant-orders");
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
                Restaurant Orders History
              </h1>
              <p className="text-sm text-gray-500">
                View all previous restaurant food orders.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/dashboard/services/restaurant_orders">
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
              title="New Restaurant Order"
            >
              <MdRestaurantMenu className="text-xl" />
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
            Failed to load restaurant orders. Please try again.
          </div>
        ) : restaurantOrders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No restaurant orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-rose-50 text-rose-800 text-sm">
                  <th className="font-semibold py-4">#</th>
                  <th className="font-semibold">Room</th>
                  <th className="font-semibold">Guest Name</th>
                  <th className="font-semibold">Date & Time</th>
                  <th className="font-semibold">Waiter</th>
                  <th className="font-semibold">Items</th>
                  <th className="font-semibold">Payment Method</th>
                  <th className="font-semibold text-right">Total</th>
                  <th className="font-semibold text-center">Status</th>
                  <th className="font-semibold text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {restaurantOrders.map((order, index) => (
                  <tr
                    key={order._id}
                    className="hover:bg-rose-50/50 border-b border-gray-100"
                  >
                    <td className="font-medium text-gray-500">{index + 1}</td>

                    <td>
                      <span className="font-semibold text-gray-800">
                        {order.roomNumber ? `Room ${order.roomNumber}` : "—"}
                      </span>
                    </td>

                    <td className="font-medium">{order.guestName || "—"}</td>

                    <td className="text-sm text-gray-600">
                      <div>{order.orderDate || "—"}</div>
                      <div className="text-xs text-gray-400">
                        {order.orderTime || ""}
                      </div>
                    </td>

                    <td className="text-sm">{order.assignedWaiter || "—"}</td>

                    {/* Food Items */}
                    <td>
                      <div className="space-y-1">
                        {order.foodItems?.map((item, i) => (
                          <div
                            key={i}
                            className="text-sm text-gray-700 flex items-center gap-1"
                          >
                            <span className="font-medium">{item.itemName}</span>
                            <span className="text-gray-400">×</span>
                            <span className="text-gray-600">
                              {item.quantity}
                            </span>
                          </div>
                        )) || "—"}
                      </div>
                    </td>

                    <td className="text-sm">{order.paymentMethod || "—"}</td>

                    <td className="text-right">
                      <span className="font-bold text-rose-700 text-base">
                        ৳{Number(order.totalAmount || 0).toLocaleString()}
                      </span>
                    </td>

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

                    {/* ===== Fixed Action Buttons ===== */}
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        {/* Invoice Button */}
                        <Link
                          to={`/dashboard/services/restaurant_orders/invoice/${order._id}`}
                        >
                          <button
                            type="button"
                            className="btn btn-sm btn-outline border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white gap-1"
                            title="Generate Invoice"
                          >
                            <FaFileInvoiceDollar />
                            Invoice
                          </button>
                        </Link>

                        {/* Update Order Button */}
                        <Link
                          to={`/dashboard/services/restaurant_orders/edit_restaurant_history/${order._id}`}
                        >
                          <button
                            type="button"
                            className="btn btn-sm bg-[#BF1E2E] text-white hover:bg-red-800 border-none gap-1"
                          >
                            <MdEdit />
                            Update
                          </button>
                        </Link>
                      </div>
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

export default RestaurantOrdersHistory;
