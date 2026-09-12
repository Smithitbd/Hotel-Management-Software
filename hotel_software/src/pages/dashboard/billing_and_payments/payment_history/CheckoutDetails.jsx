import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import {
  FaBed,
  FaUtensils,
  FaTshirt,
  FaShuttleVan,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaArrowLeft,
} from "react-icons/fa";
import { MdCheckCircleOutline } from "react-icons/md";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import useAxios from "../../../../hooks/useAxios";

const CheckoutDetails = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();

  const {
    data: guest,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["checkout-details", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/check-out/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-rose-700"></span>
      </div>
    );
  }

  if (isError || !guest) {
    return (
      <div className="text-center py-32">
        <p className="text-red-500 font-medium text-lg">
          Failed to load checkout data
        </p>
        <Link
          to="/dashboard/check_in_out/checkout-list"
          className="btn btn-sm mt-4 bg-rose-700 text-white"
        >
          Go Back
        </Link>
      </div>
    );
  }

  // Calculations
  const restaurantTotal = (guest.restaurantOrders || []).reduce(
    (sum, order) => sum + (Number(order.totalAmount) || 0),
    0,
  );
  const laundryTotal = (guest.laundryOrders || []).reduce(
    (sum, order) => sum + (Number(order.totalCost) || 0),
    0,
  );
  const transportTotal = (guest.transportOrders || []).reduce(
    (sum, order) => sum + (Number(order.fare) || 0),
    0,
  );

  const roomCharge =
    Number(guest.actualRoomCharge) || Number(guest.totalAmount) || 0;
  const totalCharges =
    Number(guest.totalCharges) ||
    roomCharge + restaurantTotal + laundryTotal + transportTotal;
  const advance = Number(guest.advancePayment) || 0;
  const finalAmount =
    Number(guest.finalAmount) || Math.abs(totalCharges - advance);
  const isRefund = guest.isRefund || totalCharges - advance < 0;

  return (
    <div className="mx-auto p-6 max-w-6xl">
      {/* ====================== HEADER ====================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-rose-700 flex items-center justify-center shadow-lg">
            <MdCheckCircleOutline className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-rose-700">
              Checkout Details
            </h1>
            <p className="text-sm text-gray-500">
              Full bill & stay information
            </p>
          </div>
        </div>

        {/* Back Button */}
        <Link
          to="/dashboard/billing_and_payments/payment_history"
          className="btn btn-circle bg-rose-700 hover:bg-[#BF1E2E] text-white border-none"
          title="Back"
        >
          <FaArrowLeft />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ====================== LEFT CONTENT ====================== */}
        <div className="lg:col-span-2 space-y-6">
          {/* ---------- Guest Profile Card ---------- */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-700 to-rose-600 p-6 text-white">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full border-4 border-white/30 overflow-hidden bg-white/20 flex-shrink-0">
                  {guest.personImage ? (
                    <img
                      src={`${
                        import.meta.env.VITE_API_URL || "http://localhost:3000"
                      }${guest.personImage}`}
                      alt={guest.guestName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold">
                      {guest.guestName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-bold">{guest.guestName}</h2>
                  <p className="text-rose-100 text-sm mt-1">
                    {guest.designation || "Guest"} • Room {guest.roomNumber}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-rose-100">
                    <span className="flex items-center gap-1">
                      <FaPhone className="text-xs" /> {guest.contactNumber}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaIdCard className="text-xs" /> {guest.nidNumber || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-rose-600 mt-1" />
                <div>
                  <p className="text-gray-500">Address</p>
                  <p className="font-medium">{guest.guestAddress || "—"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaBed className="text-rose-600 mt-1" />
                <div>
                  <p className="text-gray-500">Room</p>
                  <p className="font-medium">
                    {guest.roomVariantName} (Room {guest.roomNumber})
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaCalendarAlt className="text-rose-600 mt-1" />
                <div>
                  <p className="text-gray-500">Check-In</p>
                  <p className="font-medium">
                    {guest.checkInDate} at {guest.checkInTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaCalendarAlt className="text-rose-600 mt-1" />
                <div>
                  <p className="text-gray-500">Actual Check-Out</p>
                  <p className="font-medium">
                    {guest.actualCheckoutDate || guest.checkOutDate}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-gray-500">Actual Nights</p>
                <p className="font-medium">
                  {guest.actualNights || guest.numberOfNights} nights
                </p>
              </div>

              <div>
                <p className="text-gray-500">Price per Night</p>
                <p className="font-medium">
                  ৳{Number(guest.pricePerNight || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* ---------- Restaurant Orders ---------- */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
                  <FaUtensils className="text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Restaurant Orders
                </h3>
              </div>
              <span className="text-lg font-bold text-rose-700">
                ৳{restaurantTotal.toLocaleString()}
              </span>
            </div>

            {guest.restaurantOrders?.length > 0 ? (
              <div className="space-y-4">
                {guest.restaurantOrders.map((order, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-100 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-500">
                        Order #{idx + 1}
                      </span>
                      <span className="badge badge-sm badge-success">Paid</span>
                    </div>

                    {order.foodItems?.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-sm py-1.5 border-b border-dashed border-gray-100 last:border-0"
                      >
                        <span>
                          {item.itemName}{" "}
                          <span className="text-gray-400">
                            × {item.quantity}
                          </span>
                        </span>
                        <span className="font-medium">৳{item.totalPrice}</span>
                      </div>
                    ))}

                    <div className="flex justify-between font-semibold mt-3 pt-2">
                      <span>Order Total</span>
                      <span className="text-green-600">
                        ৳{order.totalAmount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-6">
                No restaurant orders
              </p>
            )}
          </div>

          {/* ---------- Laundry Orders ---------- */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaTshirt className="text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Laundry Orders
                </h3>
              </div>
              <span className="text-lg font-bold text-rose-700">
                ৳{laundryTotal.toLocaleString()}
              </span>
            </div>

            {guest.laundryOrders?.length > 0 ? (
              <div className="space-y-4">
                {guest.laundryOrders.map((order, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-100 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">
                          {order.laundryType}
                        </span>
                        <span className="text-gray-400 mx-2">•</span>
                        <span className="text-gray-500">
                          {order.assignedStaff || "Unassigned"}
                        </span>
                      </div>
                      <span className="badge badge-sm badge-success">Paid</span>
                    </div>

                    {order.clothItems?.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-sm py-1.5 border-b border-dashed border-gray-100 last:border-0"
                      >
                        <span>
                          {item.clothName}{" "}
                          <span className="text-gray-400">
                            × {item.quantity}
                          </span>
                        </span>
                        <span className="font-medium">৳{item.totalPrice}</span>
                      </div>
                    ))}

                    <div className="flex justify-between font-semibold mt-3 pt-2">
                      <span>Order Total</span>
                      <span className="text-green-600">৳{order.totalCost}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-6">
                No laundry orders
              </p>
            )}
          </div>

          {/* ---------- Transport Orders ---------- */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                  <FaShuttleVan className="text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Transport Orders
                </h3>
              </div>
              <span className="text-lg font-bold text-rose-700">
                ৳{transportTotal.toLocaleString()}
              </span>
            </div>

            {guest.transportOrders?.length > 0 ? (
              <div className="space-y-4">
                {guest.transportOrders.map((order, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-100 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        {order.vehicleType} • {order.driverNumber}
                      </span>
                      <span className="badge badge-sm badge-success">Paid</span>
                    </div>

                    <div className="text-sm space-y-1 text-gray-600">
                      <p>
                        <span className="text-gray-400">From:</span>{" "}
                        {order.pickupLocation}
                      </p>
                      <p>
                        <span className="text-gray-400">To:</span>{" "}
                        {order.destination}
                      </p>
                      <p>
                        <span className="text-gray-400">Date:</span>{" "}
                        {order.pickupDate} at {order.pickupTime}
                      </p>
                    </div>

                    <div className="flex justify-between font-semibold mt-3 pt-2 border-t">
                      <span>Fare</span>
                      <span className="text-green-600">৳{order.fare}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-6">
                No transport orders
              </p>
            )}
          </div>
        </div>

        {/* ====================== RIGHT SIDE - BILL SUMMARY ====================== */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-6 overflow-hidden">
            <div className="bg-rose-700 text-white px-6 py-4">
              <h3 className="text-lg font-bold">Final Bill Summary</h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Room Charge ({guest.actualNights || guest.numberOfNights}{" "}
                  nights)
                </span>
                <span className="font-medium">
                  ৳{roomCharge.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Restaurant</span>
                <span className="font-medium">
                  ৳{restaurantTotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Laundry</span>
                <span className="font-medium">
                  ৳{laundryTotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transport</span>
                <span className="font-medium">
                  ৳{transportTotal.toLocaleString()}
                </span>
              </div>

              <div className="border-t border-dashed border-gray-200 my-2"></div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Charges</span>
                <span className="font-medium">
                  ৳{totalCharges.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm text-green-600">
                <span>Advance Paid</span>
                <span className="font-medium">৳{advance.toLocaleString()}</span>
              </div>

              <div className="border-t border-dashed border-gray-200 my-2"></div>

              <div
                className={`rounded-xl p-4 ${
                  isRefund ? "bg-green-50" : "bg-rose-50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`font-bold ${
                      isRefund ? "text-green-800" : "text-rose-800"
                    }`}
                  >
                    {isRefund ? "Refund Amount" : "Final Paid"}
                  </span>
                  <span
                    className={`text-2xl font-bold ${
                      isRefund ? "text-green-700" : "text-rose-700"
                    }`}
                  >
                    ৳{finalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="text-center text-xs text-gray-400 mt-4">
                Checked out on{" "}
                {guest.checkedOutAt
                  ? new Date(guest.checkedOutAt).toLocaleString("en-GB")
                  : "—"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDetails;
