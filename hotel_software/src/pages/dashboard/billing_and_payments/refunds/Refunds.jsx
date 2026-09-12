import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import {
  FaSearch,
  FaPhone,
  FaIdCard,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaArrowLeft,
} from "react-icons/fa";
import { MdMoneyOff } from "react-icons/md";
import useAxios from "../../../../hooks/useAxios";

const Refunds = () => {
  const axiosInstance = useAxios();

  const { register, handleSubmit, getValues } = useForm();

  const {
    data: refunds = [],
    isFetching,
    refetch,
    isFetched,
  } = useQuery({
    queryKey: ["refunded-checkouts"],
    queryFn: async () => {
      const { fromDate, toDate, contactNumber } = getValues();

      const res = await axiosInstance.get("/refunded-checkouts", {
        params: {
          fromDate,
          toDate,
          contactNumber: contactNumber || undefined,
        },
      });

      return res.data;
    },
    enabled: false,
  });

  const onSubmit = () => {
    refetch();
  };

  // Total Refunded Amount
  const totalRefunded = refunds.reduce(
    (sum, item) => sum + (Number(item.finalAmount) || 0),
    0,
  );

  return (
    <div className="p-6">
      {/* ====================== HEADER ====================== */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
            <MdMoneyOff className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-rose-700">
              Refunded Checkouts
            </h1>
            <p className="text-sm text-gray-500">Guests who received refund</p>
          </div>
        </div>

        <Link
          to="/dashboard/billing_and_payments"
          className="btn btn-circle bg-rose-700 hover:bg-[#BF1E2E] text-white border-none"
        >
          <FaArrowLeft />
        </Link>
      </div>

      {/* ====================== FILTER FORM ====================== */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Contact Number (Optional) */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Contact Number</span>
            </label>
            <input
              type="text"
              placeholder="Optional"
              className="input input-bordered w-full bg-white"
              {...register("contactNumber")}
            />
          </div>

          {/* From Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">From Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full bg-white"
              {...register("fromDate", { required: true })}
            />
          </div>

          {/* To Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">To Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full bg-white"
              {...register("toDate", { required: true })}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn bg-rose-700 hover:bg-[#BF1E2E] text-white border-none"
          >
            <FaSearch />
            Generate Report
          </button>
        </div>
      </form>

      {/* ====================== RESULTS ====================== */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {/* Initial State */}
        {!isFetched && !isFetching && (
          <div className="py-16 text-center text-gray-400">
            Select date range and click <b>Generate Report</b>
          </div>
        )}

        {/* Loading */}
        {isFetching && (
          <div className="py-16 text-center">
            <span className="loading loading-spinner loading-lg text-rose-700"></span>
          </div>
        )}

        {/* Data */}
        {isFetched && !isFetching && (
          <>
            {refunds.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                No refunded records found
              </div>
            ) : (
              <>
                {/* Total Refunded Summary */}
                <div className="p-5 border-b border-gray-100 bg-green-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-700">
                    <FaMoneyBillWave />
                    <span className="font-medium">
                      Total Refunded: ৳{totalRefunded.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-sm text-green-600">
                    {refunds.length} record{refunds.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead className="bg-rose-700 text-white">
                      <tr>
                        <th>#</th>
                        <th>Guest</th>
                        <th>Contact</th>
                        <th>Room</th>
                        <th>Stay Period</th>
                        <th>Nights</th>
                        <th>Room Charge</th>
                        <th>Advance</th>
                        <th>Refund Amount</th>
                        <th>Checkout Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {refunds.map((item, index) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td>{index + 1}</td>

                          {/* Guest + Image */}
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="avatar">
                                <div className="w-10 h-10 rounded-full ring ring-rose-200">
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
                                    <div className="w-full h-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold">
                                      {item.guestName?.charAt(0)?.toUpperCase()}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="font-medium">
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
                              {item.contactNumber}
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
                            {item.actualNights || item.numberOfNights} nights
                          </td>

                          {/* Room Charge */}
                          <td>
                            ৳
                            {(
                              item.actualRoomCharge ||
                              item.totalAmount ||
                              0
                            ).toLocaleString()}
                          </td>

                          {/* Advance */}
                          <td className="text-green-600 font-medium">
                            ৳{(item.advancePayment || 0).toLocaleString()}
                          </td>

                          {/* Refund Amount */}
                          <td>
                            <span className="font-bold text-green-700">
                              ৳{(item.finalAmount || 0).toLocaleString()}
                            </span>
                          </td>

                          {/* Checkout Date */}
                          <td>
                            <div className="flex items-center gap-1 text-sm">
                              <FaCalendarAlt className="text-rose-600 text-xs" />
                              {item.checkedOutAt
                                ? new Date(
                                    item.checkedOutAt,
                                  ).toLocaleDateString("en-GB")
                                : "—"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Refunds;
