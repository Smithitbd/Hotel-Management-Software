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

  const handlePrint = () => {
    window.print();
  };

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="bg-white invoice-page">
      {/* Print styles for A4 + footer at bottom */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }
          body {
            margin: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .invoice-page {
            width: 100%;
          }
          .invoice-container {
            min-height: calc(297mm - 24mm); /* A4 height minus top+bottom margins */
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
          }
          .invoice-body {
            flex: 1 1 auto;
          }
          .invoice-footer {
            margin-top: auto;
            page-break-inside: avoid;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>

      {/* Print Button */}
      <div className="flex justify-end mb-3 print:hidden">
        <button
          onClick={handlePrint}
          className="btn btn-sm bg-rose-900 hover:bg-rose-800 text-white border-none gap-2"
        >
          <FaPrint /> Print {isHotelCopy ? "Hotel" : "Guest"} Invoice
        </button>
      </div>

      {/* ===================== INVOICE ===================== */}
      <div className="invoice-container border border-gray-400 p-4 sm:p-5 max-w-4xl mx-auto text-xs text-gray-800 leading-tight">
        {/* Everything above the thank-you / generated footer */}
        <div className="invoice-body">
          {/* Header */}
          <div className="text-center mb-3">
            <h1 className="text-xl sm:text-2xl font-bold text-rose-700 tracking-wide">
              {hotelInfo?.hotelName || "YOUR HOTEL NAME"}
            </h1>

            {/* Hotel Location */}
            {hotelInfo?.address && (
              <p className="text-[11px] text-gray-700 mt-0.5 font-medium">
                {hotelInfo.address}
              </p>
            )}

            <p className="text-[10px] italic text-gray-500 mt-0.5">
              {hotelInfo?.tagline || "A luxury hotel of your comfort"}
            </p>

            <p className="text-[10px] text-gray-600 mt-0.5">
              {hotelInfo?.email && `E-mail: ${hotelInfo.email}`}
              {hotelInfo?.website && ` | ${hotelInfo.website}`}
              {hotelInfo?.phone && ` | ${hotelInfo.phone}`}
            </p>
          </div>

          {/* Title */}
          <h2 className="text-center text-sm font-bold underline tracking-wider mb-1">
            {isHotelCopy ? "HOTEL COPY – GUEST INVOICE" : "GUEST INVOICE"}
          </h2>

          {isHotelCopy && (
            <p className="text-center text-[10px] text-rose-700 font-semibold mb-3">
              ★ HOTEL COPY – For Office Use Only ★
            </p>
          )}

          {!isHotelCopy && <div className="mb-3" />}

          {/* Guest Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5 mb-4 text-xs">
            <div className="space-y-0.5">
              <p>
                <span className="font-semibold w-28 inline-block">
                  Guest's Name
                </span>
                : <strong>{guestName?.toUpperCase()}</strong>
              </p>
              <p>
                <span className="font-semibold w-28 inline-block">Company</span>
                : {designation || "—"}
              </p>
              <p>
                <span className="font-semibold w-28 inline-block">Arrival</span>
                : {checkInDate} {checkInTime || ""}
              </p>
              <p>
                <span className="font-semibold w-28 inline-block">
                  Departure
                </span>
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

            <div className="space-y-0.5">
              <p>
                <span className="font-semibold w-32 inline-block">
                  Registration No.
                </span>
                : {_id?.toString().slice(-8).toUpperCase() || "—"}
              </p>
              <p>
                <span className="font-semibold w-32 inline-block">
                  Room No.
                </span>
                : {roomNumber}
              </p>
              <p>
                <span className="font-semibold w-32 inline-block">
                  Room Type
                </span>
                : {roomVariantName}
              </p>
              <p>
                <span className="font-semibold w-32 inline-block">
                  Rack Rate (BDT)
                </span>
                : {formatMoney(pricePerNight)}
              </p>
              <p>
                <span className="font-semibold w-32 inline-block">
                  Room Rent (BDT)
                </span>
                : {formatMoney(actualRoomCharge)}
              </p>
              <p>
                <span className="font-semibold w-32 inline-block">Contact</span>
                : {contactNumber || "—"}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto mb-3">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 px-1.5 py-1 text-left">
                    Date
                  </th>
                  <th className="border border-gray-400 px-1.5 py-1 text-left">
                    Ref No.
                  </th>
                  <th className="border border-gray-400 px-1.5 py-1 text-left">
                    Item Description
                  </th>
                  <th className="border border-gray-400 px-1.5 py-1 text-right">
                    Charge
                  </th>
                  <th className="border border-gray-400 px-1.5 py-1 text-right">
                    Service
                  </th>
                  <th className="border border-gray-400 px-1.5 py-1 text-right">
                    VAT
                  </th>
                  <th className="border border-gray-400 px-1.5 py-1 text-right">
                    Gross
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Room Rent */}
                <tr>
                  <td className="border border-gray-400 px-1.5 py-1">
                    {checkInDate}
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1">
                    {roomNumber}
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1">
                    Room Rent ({actualNights} Night{actualNights > 1 ? "s" : ""}
                    )
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1 text-right">
                    {formatMoney(actualRoomCharge)}
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1 text-right">
                    0.00
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1 text-right">
                    0.00
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1 text-right">
                    {formatMoney(actualRoomCharge)}
                  </td>
                </tr>

                {/* Restaurant Items - SHOW ALL */}
                {restaurantOrders.map((order, idx) =>
                  (order.foodItems || []).map((item, i) => (
                    <tr key={`rest-${idx}-${i}`}>
                      <td className="border border-gray-400 px-1.5 py-1">
                        {order.orderDate || actualCheckoutDate || checkOutDate}
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1">
                        RST-{idx + 1}
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1">
                        Restaurant: {item.itemName} × {item.quantity}
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1 text-right">
                        {formatMoney(item.totalPrice)}
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1 text-right">
                        0.00
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1 text-right">
                        0.00
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1 text-right">
                        {formatMoney(item.totalPrice)}
                      </td>
                    </tr>
                  )),
                )}

                {/* Laundry Items - SHOW ALL */}
                {laundryOrders.map((order, idx) =>
                  (order.clothItems || []).map((item, i) => (
                    <tr key={`lnd-${idx}-${i}`}>
                      <td className="border border-gray-400 px-1.5 py-1">
                        {order.orderDate || actualCheckoutDate || checkOutDate}
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1">
                        LND-{idx + 1}
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1">
                        Laundry ({order.laundryType}): {item.clothName} ×{" "}
                        {item.quantity}
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1 text-right">
                        {formatMoney(item.totalPrice)}
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1 text-right">
                        0.00
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1 text-right">
                        0.00
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1 text-right">
                        {formatMoney(item.totalPrice)}
                      </td>
                    </tr>
                  )),
                )}

                {/* Transport - SHOW ALL */}
                {transportOrders.map((order, idx) => (
                  <tr key={`trn-${idx}`}>
                    <td className="border border-gray-400 px-1.5 py-1">
                      {order.pickupDate || actualCheckoutDate || checkOutDate}
                    </td>
                    <td className="border border-gray-400 px-1.5 py-1">
                      TRN-{idx + 1}
                    </td>
                    <td className="border border-gray-400 px-1.5 py-1">
                      Transport: {order.vehicleType} ({order.pickupLocation} →{" "}
                      {order.destination})
                    </td>
                    <td className="border border-gray-400 px-1.5 py-1 text-right">
                      {formatMoney(order.fare)}
                    </td>
                    <td className="border border-gray-400 px-1.5 py-1 text-right">
                      0.00
                    </td>
                    <td className="border border-gray-400 px-1.5 py-1 text-right">
                      0.00
                    </td>
                    <td className="border border-gray-400 px-1.5 py-1 text-right">
                      {formatMoney(order.fare)}
                    </td>
                  </tr>
                ))}

                {/* Advance / Payment */}
                <tr>
                  <td className="border border-gray-400 px-1.5 py-1">
                    {actualCheckoutDate || checkOutDate}
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1">—</td>
                  <td className="border border-gray-400 px-1.5 py-1">
                    Payment / Advance Received
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1 text-right text-green-700">
                    ({formatMoney(advance)})
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1 text-right">
                    0.00
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1 text-right">
                    0.00
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1 text-right text-green-700">
                    ({formatMoney(advance)})
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex justify-end mb-3">
            <div className="w-60 text-xs space-y-0.5">
              <div className="flex justify-between">
                <span className="font-semibold">Total Amount : Tk.</span>
                <span>{formatMoney(totalCharges)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Adjustment : Tk.</span>
                <span>0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Total Bill : Tk.</span>
                <span>{formatMoney(totalCharges)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Payment Receive : Tk.</span>
                <span>{formatMoney(advance)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-400 pt-1 mt-1 font-bold">
                <span>{isRefund ? "Guest Refund" : "Balance"} : Tk.</span>
                <span>{formatMoney(final)}</span>
              </div>
            </div>
          </div>

          <p className="text-xs mb-3">
            <strong>Taka In Word :</strong> {amountInWords}
          </p>

          {/* PAID Stamp - only when fully paid */}
          {final === 0 && (
            <div className="text-center my-3 paid-stamp">
              <span className="inline-block border-4 border-blue-600 text-blue-600 text-2xl font-bold px-6 py-0.5 -rotate-6 tracking-widest">
                PAID
              </span>
            </div>
          )}

          {/* Signatures */}
          <div className="flex justify-between mt-8 signature-area text-xs">
            <div className="text-center w-36">
              <div className="border-t border-gray-700 pt-1">
                Authorized Signature
              </div>
            </div>
            <div className="text-center w-36">
              <div className="border-t border-gray-700 pt-1">
                Guest Signature
              </div>
            </div>
          </div>
        </div>

        {/* ===== Footer that sticks to bottom of A4 ===== */}
        <div className="invoice-footer">
          <p className="text-center font-semibold text-sm mb-2">
            Thank You For Staying With Us
          </p>

          <p className="text-[10px] text-center text-gray-600 mb-3 leading-snug">
            I agree that my liability for this bill is not waived and agree to
            be held personally liable in the event that the indicated person,
            company or govt. fails to pay for any part of the full amount to
            these charges.
          </p>

          <div className="text-center text-[10px] text-gray-500 mt-4 border-t border-gray-300 pt-2">
            Generated on {new Date().toLocaleString()} | Designed & Developed by
            SmithIT
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutInvoice;
