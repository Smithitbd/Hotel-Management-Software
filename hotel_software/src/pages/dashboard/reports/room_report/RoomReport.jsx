import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { MdAssessment } from "react-icons/md";
import { Link } from "react-router";
import useAxios from "../../../../hooks/useAxios";

const RoomReport = () => {
  const axiosInstance = useAxios();

  const { register, handleSubmit, getValues } = useForm();

  const {
    data: salesData = [],
    isFetching,
    refetch,
    isFetched,
  } = useQuery({
    queryKey: ["room-sales"],
    queryFn: async () => {
      const { fromDate, toDate, roomNumber } = getValues();

      const res = await axiosInstance.get("/room-sales", {
        params: {
          fromDate,
          toDate,
          roomNumber: roomNumber || undefined,
        },
      });

      return res.data;
    },
    enabled: false,
  });

  const onSubmit = () => {
    refetch();
  };

  // Calculate Total Earned (Room Charge)
  const totalEarned = salesData.reduce((sum, item) => {
    return (
      sum +
      (Number(item.actualRoomCharge) ||
        Number(item.totalAmount) ||
        Number(item.totalCharges) ||
        0)
    );
  }, 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
            <MdAssessment className="text-xl text-white" />
          </div>
          <h1 className="text-lg font-bold text-rose-700">Room Sales Report</h1>
        </div>

        <Link
          to="/dashboard/reports/sales_report"
          className="btn btn-circle bg-rose-700 hover:bg-[#BF1E2E] text-white border-none"
        >
          <FaArrowLeft />
        </Link>
      </div>

      {/* Filter Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Room Number (Optional) */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Room Number</span>
            </label>
            <input
              type="text"
              placeholder="Optional"
              className="input input-bordered w-full bg-white"
              {...register("roomNumber")}
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

      {/* Results */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {/* Initial State */}
        {!isFetched && !isFetching && (
          <div className="py-16 text-center text-gray-400">
            Select filters and click <b>Generate Report</b>
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
            {salesData.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                No data found
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead className="bg-rose-700 text-white">
                      <tr>
                        <th>#</th>
                        <th>Guest</th>
                        <th>Room</th>
                        <th>Variant</th>
                        <th>Check-In</th>
                        <th>Check-Out</th>
                        <th>Nights</th>
                        <th>Price/Night</th>
                        <th>Room Charge</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.map((item, index) => (
                        <tr key={item._id}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="font-medium">{item.guestName}</div>
                            <div className="text-xs text-gray-500">
                              {item.contactNumber}
                            </div>
                          </td>
                          <td className="font-medium">{item.roomNumber}</td>
                          <td>{item.roomVariantName || "—"}</td>
                          <td>{item.checkInDate}</td>
                          <td>
                            {item.actualCheckoutDate || item.checkOutDate}
                          </td>
                          <td>
                            {item.actualNights || item.numberOfNights || "—"}
                          </td>
                          <td>
                            ৳{Number(item.pricePerNight || 0).toLocaleString()}
                          </td>
                          <td className="font-semibold text-rose-700">
                            ৳
                            {(
                              Number(item.actualRoomCharge) ||
                              Number(item.totalAmount) ||
                              0
                            ).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total Earned */}
                <div className="flex justify-end p-5 border-t border-gray-100 bg-gray-50">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Room Revenue</p>
                    <p className="text-2xl font-bold text-rose-700">
                      ৳{totalEarned.toLocaleString()}
                    </p>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RoomReport;
