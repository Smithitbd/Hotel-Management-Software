import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FaPrint } from "react-icons/fa";
import useAxios from "../../../../../hooks/useAxios";
import useAuth from "../../../../../hooks/useAuth";

const RestaurantInvoice = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();
  const { user } = useAuth();

  // Fetch order
  const { data: orderData, isLoading: orderLoading } = useQuery({
    queryKey: ["restaurant-order", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/restaurant-orders/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Fetch hotel info
  const { data: hotelInfo, isLoading: hotelLoading } = useQuery({
    queryKey: ["hotel-info", orderData?.hotelEmail || user?.email],
    queryFn: async () => {
      const res = await axiosInstance.get("/hotels/by-email", {
        params: { email: orderData?.hotelEmail || user?.email },
      });
      return res.data;
    },
    enabled: !!(orderData?.hotelEmail || user?.email),
  });

  if (orderLoading || hotelLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-rose-900"></span>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="text-center py-20 text-red-500 font-medium">
        Order not found
      </div>
    );
  }

  const {
    _id,
    guestName,
    roomNumber,
    orderDate,
    orderTime,
    assignedWaiter,
    paymentMethod,
    paymentStatus,
    foodItems = [],
    totalAmount,
    specialInstruction,
    checkInInfo,
  } = orderData;

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const numberToWords = (num) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if (num === 0) return "Zero";
    if (num < 20) return ones[num];
    if (num < 100)
      return (
        tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "")
      );
    if (num < 1000)
      return (
        ones[Math.floor(num / 100)] +
        " Hundred" +
        (num % 100 ? " " + numberToWords(num % 100) : "")
      );
    if (num < 100000)
      return (
        numberToWords(Math.floor(num / 1000)) +
        " Thousand" +
        (num % 1000 ? " " + numberToWords(num % 1000) : "")
      );
    return num.toString();
  };

  const amountInWords = numberToWords(Math.round(totalAmount)) + " Taka Only";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-6">
      {/* Print Button */}
      <div className="flex justify-end mb-3 print:hidden">
        <button
          onClick={handlePrint}
          className="btn btn-sm bg-rose-900 hover:bg-rose-800 text-white border-none gap-2"
        >
          <FaPrint /> Print Bill
        </button>
      </div>

      {/* ========== 80mm Thermal Receipt ========== */}
      <div
        className="invoice-container mx-auto bg-white text-black"
        style={{
          width: "80mm",
          maxWidth: "80mm",
          padding: "4mm",
          fontSize: "11px",
          lineHeight: "1.3",
          fontFamily: "monospace, 'Courier New', Courier",
        }}
      >
        {/* Header */}
        <div className="text-center mb-2">
          <h1
            className="font-bold"
            style={{ fontSize: "14px", letterSpacing: "0.5px" }}
          >
            {hotelInfo?.hotelName || "YOUR HOTEL NAME"}
          </h1>

          {hotelInfo?.address && (
            <p style={{ fontSize: "9px", marginTop: "1px" }}>
              {hotelInfo.address}
            </p>
          )}

          <p style={{ fontSize: "9px", marginTop: "1px" }}>
            {hotelInfo?.phone && `Tel: ${hotelInfo.phone}`}
            {hotelInfo?.email && ` | ${hotelInfo.email}`}
          </p>
        </div>

        <div
          style={{
            borderTop: "1px dashed #000",
            borderBottom: "1px dashed #000",
            padding: "3px 0",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "12px",
            marginBottom: "6px",
          }}
        >
          RESTAURANT BILL
        </div>

        {/* Order Info */}
        <div style={{ marginBottom: "6px", fontSize: "10px" }}>
          <div className="flex justify-between">
            <span>Bill No:</span>
            <span>{_id?.toString().slice(-8).toUpperCase() || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>
              {orderDate} {orderTime || ""}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Room:</span>
            <span>{roomNumber || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span>Guest:</span>
            <span>{guestName || checkInInfo?.guestName || "—"}</span>
          </div>
          {assignedWaiter && (
            <div className="flex justify-between">
              <span>Waiter:</span>
              <span>{assignedWaiter}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Payment:</span>
            <span>
              {paymentMethod} ({paymentStatus})
            </span>
          </div>
        </div>

        <div style={{ borderTop: "1px dashed #000", margin: "4px 0" }} />

        {/* Items Header */}
        <div
          className="flex justify-between font-bold"
          style={{ fontSize: "10px", marginBottom: "3px" }}
        >
          <span style={{ width: "45%" }}>Item</span>
          <span style={{ width: "15%", textAlign: "center" }}>Qty</span>
          <span style={{ width: "20%", textAlign: "right" }}>Rate</span>
          <span style={{ width: "20%", textAlign: "right" }}>Amt</span>
        </div>

        <div style={{ borderTop: "1px dashed #000", margin: "2px 0 4px 0" }} />

        {/* Food Items */}
        {foodItems.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between"
            style={{ fontSize: "10px", marginBottom: "2px" }}
          >
            <span style={{ width: "45%" }}>{item.itemName}</span>
            <span style={{ width: "15%", textAlign: "center" }}>
              {item.quantity}
            </span>
            <span style={{ width: "20%", textAlign: "right" }}>
              {formatMoney(item.price)}
            </span>
            <span style={{ width: "20%", textAlign: "right" }}>
              {formatMoney(item.quantity * item.price)}
            </span>
          </div>
        ))}

        <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

        {/* Total */}
        <div
          className="flex justify-between font-bold"
          style={{ fontSize: "12px", marginBottom: "4px" }}
        >
          <span>TOTAL</span>
          <span>Tk. {formatMoney(totalAmount)}</span>
        </div>

        <p style={{ fontSize: "9px", marginBottom: "6px" }}>
          <strong>In Words:</strong> {amountInWords}
        </p>

        {specialInstruction && (
          <p style={{ fontSize: "9px", marginBottom: "6px" }}>
            <strong>Note:</strong> {specialInstruction}
          </p>
        )}

        {/* PAID Stamp */}
        {paymentStatus === "Paid" && (
          <div className="text-center my-2">
            <span
              style={{
                display: "inline-block",
                border: "2px solid #000",
                padding: "2px 12px",
                fontWeight: "bold",
                fontSize: "14px",
                transform: "rotate(-8deg)",
                letterSpacing: "2px",
              }}
            >
              PAID
            </span>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            borderTop: "1px dashed #000",
            marginTop: "8px",
            paddingTop: "4px",
            textAlign: "center",
            fontSize: "9px",
          }}
        >
          <p>Thank You!</p>
          <p style={{ marginTop: "2px" }}>{new Date().toLocaleString()}</p>
          <p
            style={{
              marginTop: "6px",
              fontSize: "8px",
              fontWeight: "bold",
              letterSpacing: "0.3px",
            }}
          >
            Created & Developed by Smith IT
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          .invoice-container, .invoice-container * {
            visibility: visible;
          }
          .invoice-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm !important;
            max-width: 80mm !important;
            padding: 4mm !important;
            margin: 0 !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RestaurantInvoice;
