import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import { useForm } from "react-hook-form";
import {
  FaBed,
  FaUtensils,
  FaTshirt,
  FaShuttleVan,
  FaMoneyBillWave,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaArrowLeft,
  FaPrint,
} from "react-icons/fa";
import { MdCheckCircleOutline } from "react-icons/md";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import Swal from "sweetalert2";
import useAxios from "../../../../../hooks/useAxios";
import useAuth from "../../../../../hooks/useAuth";
import CheckoutInvoice from "../../../../../components/CheckoutInvoice";

const MainCheckout = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();
  const { user, loading } = useAuth();
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);

  if (loading) {
    return <span className="loading loading-spinner text-error"></span>;
  }

  const {
    data: guest,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["check-in-details", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/check-in/${id}`, {
        params: { hotelEmail: user?.email },
      });
      return res.data;
    },
    enabled: !!id && !!user?.email,
  });

  // Get Hotel Info
  const { data: hotelInfo } = useQuery({
    queryKey: ["hotel-info", user?.email],
    queryFn: async () => {
      const res = await axiosInstance.get("/hotels/by-email", {
        params: { email: user?.email },
      });
      return res.data;
    },
    enabled: !!user?.email,
  });

  // ====================== FORM FOR ACTUAL CHECKOUT DATE ======================
  const { register, watch } = useForm({
    defaultValues: {
      actualCheckoutDate: "",
    },
  });

  const actualCheckoutDate = watch("actualCheckoutDate");

  // ====================== HELPER: Get order payment status ======================
  const getOrderStatus = (order) => {
    if (order.paymentStatus) return order.paymentStatus;
    if (order.foodItems?.some((item) => item.paymentStatus === "Paid")) {
      return "Paid";
    }
    return "Due";
  };

  // ====================== CALCULATIONS ======================
  const previousRoomsCharge = (guest?.roomChangeHistory || []).reduce(
    (sum, item) => sum + (Number(item.charge) || 0),
    0,
  );

  const alreadyChargedNights = (guest?.roomChangeHistory || []).reduce(
    (sum, item) => sum + (Number(item.daysStayed) || 0),
    0,
  );

  let actualNights = Number(guest?.numberOfNights) || 0;
  let currentRoomNights = actualNights;
  let currentRoomCharge = Number(guest?.totalAmount) || 0;

  if (guest && actualCheckoutDate && guest.checkInDate) {
    const inDate = new Date(guest.checkInDate);
    const outDate = new Date(actualCheckoutDate);
    const diffTime = outDate - inDate;
    const totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    actualNights = totalNights > 0 ? totalNights : 1;

    currentRoomNights = Math.max(actualNights - alreadyChargedNights, 0);
    currentRoomCharge = currentRoomNights * Number(guest.pricePerNight || 0);
  }

  const actualRoomCharge = previousRoomsCharge + currentRoomCharge;
  const advance = Number(guest?.advancePayment) || 0;

  const restaurantDue = (guest?.restaurantOrders || [])
    .filter((order) => getOrderStatus(order) !== "Paid")
    .reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

  const laundryDue = (guest?.laundryOrders || [])
    .filter((order) => getOrderStatus(order) !== "Paid")
    .reduce((sum, order) => sum + (Number(order.totalCost) || 0), 0);

  const transportDue = (guest?.transportOrders || [])
    .filter((order) => getOrderStatus(order) !== "Paid")
    .reduce((sum, order) => sum + (Number(order.fare) || 0), 0);

  const totalCharges =
    actualRoomCharge + restaurantDue + laundryDue + transportDue;

  const balance = totalCharges - advance;
  const hotelEmail = user?.email;
  const isRefund = balance < 0;
  const finalAmount = Math.abs(balance);

  const isEarlyCheckout = actualNights < Number(guest?.numberOfNights || 0);

  // ====================== CHECKOUT HANDLER ======================
  const handleCheckout = async () => {
    const result = await Swal.fire({
      title: "Confirm Checkout?",
      html: `
      <div class="text-left space-y-1 text-sm">
          <p>Actual Nights: <b>${actualNights}</b></p>
          <p>Previous Rooms Charge: <b>৳${previousRoomsCharge.toLocaleString()}</b></p>
          <p>Current Room Charge: <b>৳${currentRoomCharge.toLocaleString()}</b></p>
          <p>Total Room Charge: <b>৳${actualRoomCharge.toLocaleString()}</b></p>
          <p>Restaurant Due: <b>৳${restaurantDue.toLocaleString()}</b></p>
          <p>Laundry Due: <b>৳${laundryDue.toLocaleString()}</b></p>
          <p>Transport Due: <b>৳${transportDue.toLocaleString()}</b></p>
          <p>Total Charges: <b>৳${totalCharges.toLocaleString()}</b></p>
          <p>Advance Paid: <b>৳${advance.toLocaleString()}</b></p>
          <hr class="my-2"/>
          <p class="text-lg">
          ${isRefund ? "Refund Amount" : "Total Due"}: 
          <b class="${isRefund ? "text-green-600" : "text-rose-900"}">
              ৳${finalAmount.toLocaleString()}
          </b>
          </p>
      </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#be123c",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Complete Checkout",
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: "Processing Checkout...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const payload = {
        actualCheckoutDate: actualCheckoutDate || guest.checkOutDate,
        actualNights,
        actualRoomCharge,
        restaurantDue,
        laundryDue,
        transportDue,
        totalCharges,
        advancePayment: advance,
        finalAmount,
        isRefund,
        hotelEmail,
      };

      const res = await axiosInstance.post(`/check-out/${id}`, payload);

      if (res.data.success) {
        // Prepare full data for invoice
        setCheckoutData({
          ...guest,
          ...payload,
          _id: res.data.checkoutId || guest._id,
          checkedOutAt: new Date(),
        });

        setIsCheckedOut(true);

        await Swal.fire({
          icon: "success",
          title: "Checkout Successful!",
          text: "Guest has been checked out. You can now print the invoices.",
          confirmButtonColor: "#be123c",
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      Swal.fire({
        icon: "error",
        title: "Checkout Failed",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-rose-900"></span>
      </div>
    );
  }

  if (isError || !guest) {
    return (
      <div className="text-center py-32">
        <p className="text-red-500 font-medium text-lg">
          Failed to load guest data
        </p>
        <Link
          to="/dashboard/check_in_out/check_out"
          className="btn btn-circle bg-rose-900 hover:bg-[#BF1E2E] text-white border-none mt-4"
          title="Back"
        >
          <FaArrowLeft />
        </Link>
      </div>
    );
  }

  // ========== SHOW INVOICE AFTER CHECKOUT ==========
  // Inside MainCheckout.jsx – the isCheckedOut block

  if (isCheckedOut && checkoutData) {
    return (
      <div className="mx-auto p-4 sm:p-6 max-w-7xl">
        {/* Header - hidden when printing */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print:hidden">
          <h1 className="text-xl font-bold text-rose-900">Checkout Invoices</h1>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => window.print()}
              className="btn bg-rose-900 hover:bg-rose-800 text-white border-none gap-2"
            >
              <FaPrint /> Print Both Invoices
            </button>

            <Link to="/dashboard/check_in_out/check_out">
              <button className="btn btn-outline border-rose-900 text-rose-900 gap-2">
                <FaArrowLeft /> Back to Checkout List
              </button>
            </Link>
          </div>
        </div>

        {/* ===== PRINTABLE AREA ===== */}
        <div className="print-area">
          <CheckoutInvoice
            checkoutData={checkoutData}
            hotelInfo={hotelInfo}
            variant="guest"
          />

          <CheckoutInvoice
            checkoutData={checkoutData}
            hotelInfo={hotelInfo}
            variant="hotel"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 max-w-6xl">
      {/* ====================== HEADER ====================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-rose-900 flex items-center justify-center shadow-lg">
            <MdCheckCircleOutline className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-rose-900">Guest Checkout</h1>
            <p className="text-sm text-gray-500">
              Review full bill & complete checkout
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isCheckedOut && (
            <button
              onClick={handleCheckout}
              className="btn bg-rose-900 hover:bg-rose-900 text-white border-none gap-2 shadow-md"
            >
              <FaMoneyBillWave />
              Complete Checkout
            </button>
          )}

          <Link to="/dashboard/check_in_out/check_out">
            <button
              type="button"
              className="flex items-center justify-center w-9 h-9 border border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white rounded-lg transition-colors"
              title="Back"
            >
              <IoArrowBackCircleSharp className="text-2xl" />
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ====================== LEFT CONTENT ====================== */}
        <div className="lg:col-span-2 space-y-6">
          {/* ---------- Guest Profile Card ---------- */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-900 to-rose-600 p-6 text-white">
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
                  <p className="text-gray-500">Current Room</p>
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
                  <p className="text-gray-500">Planned Check-Out</p>
                  <p className="font-medium">{guest.checkOutDate}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-500">Planned Nights</p>
                <p className="font-medium">{guest.numberOfNights} nights</p>
              </div>

              <div>
                <p className="text-gray-500">Price per Night (Current)</p>
                <p className="font-medium">
                  ৳{Number(guest.pricePerNight).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* ---------- EARLY CHECKOUT SECTION ---------- */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-amber-800 mb-4">
              Actual Checkout Date
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="label">
                  <span className="label-text font-medium">Checkout Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full bg-white"
                  min={guest.checkInDate}
                  defaultValue={guest.checkOutDate}
                  disabled={isCheckedOut}
                  {...register("actualCheckoutDate")}
                />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Total Actual Nights
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {actualNights}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Total Room Charge</p>
                <p className="text-2xl font-bold text-rose-900">
                  ৳{actualRoomCharge.toLocaleString()}
                </p>
              </div>
            </div>

            {isEarlyCheckout && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                Early checkout detected.
              </div>
            )}
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
              <span className="text-lg font-bold text-rose-900">
                Due: ৳{restaurantDue.toLocaleString()}
              </span>
            </div>

            {guest.restaurantOrders?.length > 0 ? (
              <div className="space-y-4">
                {guest.restaurantOrders.map((order, idx) => {
                  const status = getOrderStatus(order);
                  return (
                    <div
                      key={idx}
                      className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-500">
                          Order #{idx + 1}
                        </span>
                        <span
                          className={`badge badge-sm ${
                            status === "Paid"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {status}
                        </span>
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
                          <span className="font-medium">
                            ৳{item.totalPrice}
                          </span>
                        </div>
                      ))}

                      <div className="flex justify-between font-semibold mt-3 pt-2">
                        <span>Order Total</span>
                        <span
                          className={
                            status === "Paid"
                              ? "text-green-600"
                              : "text-rose-900"
                          }
                        >
                          ৳{order.totalAmount}
                          {status === "Paid" && " (Paid)"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-6">
                No restaurant orders found
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
              <span className="text-lg font-bold text-rose-900">
                Due: ৳{laundryDue.toLocaleString()}
              </span>
            </div>

            {guest.laundryOrders?.length > 0 ? (
              <div className="space-y-4">
                {guest.laundryOrders.map((order, idx) => {
                  const status = getOrderStatus(order);
                  return (
                    <div
                      key={idx}
                      className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition"
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
                        <span
                          className={`badge badge-sm ${
                            status === "Paid"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {status}
                        </span>
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
                          <span className="font-medium">
                            ৳{item.totalPrice}
                          </span>
                        </div>
                      ))}

                      <div className="flex justify-between font-semibold mt-3 pt-2">
                        <span>Order Total</span>
                        <span
                          className={
                            status === "Paid"
                              ? "text-green-600"
                              : "text-rose-900"
                          }
                        >
                          ৳{order.totalCost}
                          {status === "Paid" && " (Paid)"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-6">
                No laundry orders found
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
              <span className="text-lg font-bold text-rose-900">
                Due: ৳{transportDue.toLocaleString()}
              </span>
            </div>

            {guest.transportOrders?.length > 0 ? (
              <div className="space-y-4">
                {guest.transportOrders.map((order, idx) => {
                  const status = getOrderStatus(order);
                  return (
                    <div
                      key={idx}
                      className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          {order.vehicleType} • {order.driverNumber}
                        </span>
                        <span
                          className={`badge badge-sm ${
                            status === "Paid"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {status}
                        </span>
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
                        <span
                          className={
                            status === "Paid"
                              ? "text-green-600"
                              : "text-rose-900"
                          }
                        >
                          ৳{order.fare}
                          {status === "Paid" && " (Paid)"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-6">
                No transport orders found
              </p>
            )}
          </div>
        </div>

        {/* ====================== RIGHT SIDE - BILL SUMMARY ====================== */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-6 overflow-hidden">
            <div className="bg-rose-900 text-white px-6 py-4">
              <h3 className="text-lg font-bold">Bill Summary</h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Room Charge Breakdown
                </p>

                {(guest?.roomChangeHistory || []).map((history, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm text-gray-600 mb-1.5"
                  >
                    <span>
                      Room {history.fromRoom} ({history.fromVariant}) ×{" "}
                      {history.daysStayed}n
                    </span>
                    <span>৳{Number(history.charge).toLocaleString()}</span>
                  </div>
                ))}

                <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                  <span>
                    Room {guest.roomNumber} ({guest.roomVariantName}) ×{" "}
                    {currentRoomNights}n
                  </span>
                  <span>৳{currentRoomCharge.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm font-semibold mt-3 pt-2 border-t border-dashed border-gray-200">
                  <span>Total Room Charge</span>
                  <span className="text-rose-900">
                    ৳{actualRoomCharge.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-200 my-2"></div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Restaurant Due</span>
                <span className="font-medium">
                  ৳{restaurantDue.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Laundry Due</span>
                <span className="font-medium">
                  ৳{laundryDue.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transport Due</span>
                <span className="font-medium">
                  ৳{transportDue.toLocaleString()}
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
                      isRefund ? "text-green-800" : "text-rose-900"
                    }`}
                  >
                    {isRefund ? "Refund Amount" : "Total Due"}
                  </span>
                  <span
                    className={`text-2xl font-bold ${
                      isRefund ? "text-green-700" : "text-rose-900"
                    }`}
                  >
                    ৳{finalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                {!isCheckedOut && (
                  <button
                    onClick={handleCheckout}
                    className="btn bg-rose-900 hover:bg-rose-900 text-white border-none w-full gap-2"
                  >
                    <FaMoneyBillWave />
                    Complete Checkout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCheckout;
