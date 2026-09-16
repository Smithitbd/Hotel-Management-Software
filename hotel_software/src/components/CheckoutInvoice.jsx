import { FaPrint } from "react-icons/fa";

const CheckoutInvoice = ({ checkoutData, hotelInfo, variant = "guest" }) => {
  if (!checkoutData) return null;

  const {
    guestName,
    designation,
    roomNumber,
    roomVariantName,
    checkInDate,
    checkInTime,
    actualCheckoutDate,
    checkOutDate,
    actualNights,
    numberOfGuests,
    contactNumber,
    pricePerNight,
    actualRoomCharge,
    restaurantOrders = [],
    laundryOrders = [],
    transportOrders = [],
    restaurantDue = 0,
    laundryDue = 0,
    transportDue = 0,
    totalCharges,
    advancePayment = 0,
    finalAmount,
    isRefund,
    _id,
  } = checkoutData;

  const advance = Number(advancePayment) || 0;
  const final = Number(finalAmount) || 0;
  const isHotelCopy = variant === "hotel";

  // Number to words
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
    if (num < 10000000)
      return (
        numberToWords(Math.floor(num / 100000)) +
        " Lakh" +
        (num % 100000 ? " " + numberToWords(num % 100000) : "")
      );
    return num.toString();
  };

  const amountInWords = numberToWords(Math.round(final)) + " Taka Only";

  const getOrderStatus = (order) => {
    if (order.paymentStatus) return order.paymentStatus;
    if (order.foodItems?.some((item) => item.paymentStatus === "Paid")) {
      return "Paid";
    }
    return "Due";
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white">
      {/* Print Button - hidden when printing */}
      <div className="flex justify-end mb-4 print:hidden">
        <button
          onClick={handlePrint}
          className="btn bg-rose-900 hover:bg-rose-800 text-white border-none gap-2"
        >
          <FaPrint /> Print {isHotelCopy ? "Hotel" : "Guest"} Invoice
        </button>
      </div>

      {/* ===================== INVOICE ===================== */}
      <div className="border border-gray-300 p-6 sm:p-10 max-w-4xl mx-auto text-sm text-gray-800">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-rose-700 tracking-wide">
            {hotelInfo?.hotelName || "YOUR HOTEL NAME"}
          </h1>
          <p className="text-xs italic text-gray-500 mt-1">
            {hotelInfo?.tagline || "A luxury hotel of your comfort"}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {hotelInfo?.email && `E-mail: ${hotelInfo.email}`}
            {hotelInfo?.website && ` | ${hotelInfo.website}`}
            {hotelInfo?.phone && ` | ${hotelInfo.phone}`}
          </p>
        </div>

        {/* Title */}
        <h2 className="text-center text-base font-bold underline tracking-wider mb-2">
          {isHotelCopy ? "HOTEL COPY – GUEST INVOICE" : "GUEST INVOICE"}
        </h2>

        {isHotelCopy && (
          <p className="text-center text-xs text-rose-700 font-semibold mb-5">
            ★ HOTEL COPY – For Office Use Only ★
          </p>
        )}

        {!isHotelCopy && <div className="mb-5" />}

        {/* Guest Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 mb-6 text-xs sm:text-sm">
          <div className="space-y-1">
            <p>
              <span className="font-semibold w-28 inline-block">
                Guest's Name
              </span>
              : <strong>{guestName?.toUpperCase()}</strong>
            </p>
            <p>
              <span className="font-semibold w-28 inline-block">Company</span>:{" "}
              {designation || "—"}
            </p>
            <p>
              <span className="font-semibold w-28 inline-block">Arrival</span>:{" "}
              {checkInDate} {checkInTime || ""}
            </p>
            <p>
              <span className="font-semibold w-28 inline-block">Departure</span>
              : {actualCheckoutDate || checkOutDate}
            </p>
            <p>
              <span className="font-semibold w-28 inline-block">
                No. of Night
              </span>
              : {actualNights}
            </p>
            <p>
              <span className="font-semibold w-28 inline-block">
                No. of Person
              </span>
              : {numberOfGuests || 1}
            </p>
          </div>

          <div className="space-y-1">
            <p>
              <span className="font-semibold w-32 inline-block">
                Registration No.
              </span>
              : {_id?.toString().slice(-8).toUpperCase() || "—"}
            </p>
            <p>
              <span className="font-semibold w-32 inline-block">Room No.</span>:{" "}
              {roomNumber}
            </p>
            <p>
              <span className="font-semibold w-32 inline-block">Room Type</span>
              : {roomVariantName}
            </p>
            <p>
              <span className="font-semibold w-32 inline-block">
                Rack Rate (BDT)
              </span>
              : {Number(pricePerNight).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold w-32 inline-block">
                Room Rent (BDT)
              </span>
              : {Number(actualRoomCharge).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold w-32 inline-block">Contact</span>:{" "}
              {contactNumber || "—"}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs sm:text-sm mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 px-2 py-1.5 text-left">
                  Date
                </th>
                <th className="border border-gray-400 px-2 py-1.5 text-left">
                  Ref No.
                </th>
                <th className="border border-gray-400 px-2 py-1.5 text-left">
                  Item Description
                </th>
                <th className="border border-gray-400 px-2 py-1.5 text-right">
                  Charge
                </th>
                <th className="border border-gray-400 px-2 py-1.5 text-right">
                  Service
                </th>
                <th className="border border-gray-400 px-2 py-1.5 text-right">
                  VAT
                </th>
                <th className="border border-gray-400 px-2 py-1.5 text-right">
                  Gross
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Room Rent */}
              <tr>
                <td className="border border-gray-400 px-2 py-1">
                  {checkInDate}
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  {roomNumber}
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  Room Rent ({actualNights} Night{actualNights > 1 ? "s" : ""})
                </td>
                <td className="border border-gray-400 px-2 py-1 text-right">
                  {Number(actualRoomCharge).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="border border-gray-400 px-2 py-1 text-right">
                  0.00
                </td>
                <td className="border border-gray-400 px-2 py-1 text-right">
                  0.00
                </td>
                <td className="border border-gray-400 px-2 py-1 text-right">
                  {Number(actualRoomCharge).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
              </tr>

              {/* Restaurant Items */}
              {restaurantOrders.map((order, idx) => {
                if (getOrderStatus(order) === "Paid") return null;
                return (order.foodItems || []).map((item, i) => (
                  <tr key={`rest-${idx}-${i}`}>
                    <td className="border border-gray-400 px-2 py-1">
                      {order.orderDate || actualCheckoutDate || checkOutDate}
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      RST-{idx + 1}
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      Restaurant: {item.itemName} × {item.quantity}
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-right">
                      {Number(item.totalPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-right">
                      0.00
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-right">
                      0.00
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-right">
                      {Number(item.totalPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ));
              })}

              {/* Laundry Items */}
              {laundryOrders.map((order, idx) => {
                if (getOrderStatus(order) === "Paid") return null;
                return (order.clothItems || []).map((item, i) => (
                  <tr key={`lnd-${idx}-${i}`}>
                    <td className="border border-gray-400 px-2 py-1">
                      {order.orderDate || actualCheckoutDate || checkOutDate}
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      LND-{idx + 1}
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      Laundry ({order.laundryType}): {item.clothName} ×{" "}
                      {item.quantity}
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-right">
                      {Number(item.totalPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-right">
                      0.00
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-right">
                      0.00
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-right">
                      {Number(item.totalPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ));
              })}

              {/* Transport */}
              {transportOrders.map((order, idx) => {
                if (getOrderStatus(order) === "Paid") return null;
                return (
                  <tr key={`trn-${idx}`}>
                    <td className="border border-gray-400 px-2 py-1">
                      {order.pickupDate || actualCheckoutDate || checkOutDate}
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      TRN-{idx + 1}
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      Transport: {order.vehicleType} ({order.pickupLocation} →{" "}
                      {order.destination})
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-right">
                      {Number(order.fare).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-right">
                      0.00
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-right">
                      0.00
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-right">
                      {Number(order.fare).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                );
              })}

              {/* Advance / Payment */}
              <tr>
                <td className="border border-gray-400 px-2 py-1">
                  {actualCheckoutDate || checkOutDate}
                </td>
                <td className="border border-gray-400 px-2 py-1">—</td>
                <td className="border border-gray-400 px-2 py-1">
                  Payment / Advance Received
                </td>
                <td className="border border-gray-400 px-2 py-1 text-right text-green-700">
                  (
                  {advance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                  )
                </td>
                <td className="border border-gray-400 px-2 py-1 text-right">
                  0.00
                </td>
                <td className="border border-gray-400 px-2 py-1 text-right">
                  0.00
                </td>
                <td className="border border-gray-400 px-2 py-1 text-right text-green-700">
                  (
                  {advance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                  )
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end mb-4">
          <div className="w-64 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="font-semibold">Total Amount : Tk.</span>
              <span>
                {Number(totalCharges).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Adjustment : Tk.</span>
              <span>0.00</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Total Bill : Tk.</span>
              <span>
                {Number(totalCharges).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Payment Receive : Tk.</span>
              <span>
                {advance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-400 pt-1 mt-1 font-bold">
              <span>{isRefund ? "Guest Refund" : "Balance"} : Tk.</span>
              <span>
                {final.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm mb-6">
          <strong>Taka In Word :</strong> {amountInWords}
        </p>

        <p className="text-center font-semibold text-base mb-3">
          Thank You For Staying With Us
        </p>

        <p className="text-xs text-center text-gray-600 mb-6 leading-relaxed">
          I agree that my liability for this bill is not waived and agree to be
          held personally liable in the event that the indicated person, company
          or govt. fails to pay for any part of the full amount to these
          charges.
        </p>

        {/* PAID Stamp */}
        {(final === 0 || !isRefund) && (
          <div className="text-center my-6">
            <span className="inline-block border-4 border-blue-600 text-blue-600 text-3xl font-bold px-8 py-1 -rotate-6 tracking-widest">
              PAID
            </span>
          </div>
        )}

        {/* Signatures */}
        <div className="flex justify-between mt-16 text-sm">
          <div className="text-center w-40">
            <div className="border-t border-gray-700 pt-1">
              Authorized Signature
            </div>
          </div>
          <div className="text-center w-40">
            <div className="border-t border-gray-700 pt-1">Guest Signature</div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 mt-10 border-t border-gray-300 pt-3">
          Generated on {new Date().toLocaleString()} | Page 1 of 1
          {isHotelCopy && " | Hotel Copy"}
        </div>
      </div>
    </div>
  );
};

export default CheckoutInvoice;
