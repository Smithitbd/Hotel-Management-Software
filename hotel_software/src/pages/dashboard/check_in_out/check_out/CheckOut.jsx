import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxios from "../../../../hooks/useAxios";
import { MdCheckCircleOutline } from "react-icons/md";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const CheckOut = () => {
  const axiosInstance = useAxios();

  const {
    data: checkIns = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["check-ins-for-checkout"],
    queryFn: async () => {
      const res = await axiosInstance.get("/check-in");
      // Only show guests who are still checked-in (not already checked-out)
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
              <MdCheckCircleOutline className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-rose-700">
                Guest Checkout
              </h1>
              <p className="text-sm text-gray-500">
                Select a guest to complete checkout process
              </p>
            </div>
          </div>
        </div>

        <Link to="/dashboard/check_in_out">
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
            title="Back to Dashboard"
          >
            <IoArrowBackCircleSharp className="text-2xl" />
          </button>
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-rose-700 text-white px-6 py-4">
          <h2 className="text-lg font-bold">Currently Checked-In Guests</h2>
          <p className="text-sm text-rose-100">
            Click Checkout to review bill and complete the process
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-rose-700"></span>
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-red-500 font-medium">
            Failed to load check-in data. Please try again.
          </div>
        ) : checkIns.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No guests currently checked-in.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-rose-50 text-rose-800 text-sm">
                  <th className="font-semibold py-4">#</th>
                  <th className="font-semibold">Guest Name</th>
                  <th className="font-semibold">Room</th>
                  <th className="font-semibold">Check-In</th>
                  <th className="font-semibold">Check-Out</th>
                  <th className="font-semibold">Nights</th>
                  <th className="font-semibold text-right">Room Total</th>
                  <th className="font-semibold text-right">Advance</th>
                  <th className="font-semibold text-right">Due</th>
                  <th className="font-semibold text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {checkIns.map((guest, index) => (
                  <tr
                    key={guest._id}
                    className="hover:bg-rose-50/50 border-b border-gray-100"
                  >
                    <td className="font-medium text-gray-500">{index + 1}</td>

                    <td className="font-medium">{guest.guestName}</td>

                    <td>
                      <span className="font-semibold">
                        {guest.roomVariantName}
                      </span>
                      <br />
                      <span className="text-xs text-gray-500">
                        Room {guest.roomNumber}
                      </span>
                    </td>

                    <td className="text-sm">
                      {guest.checkInDate}
                      <br />
                      <span className="text-xs text-gray-500">
                        {guest.checkInTime}
                      </span>
                    </td>

                    <td className="text-sm">{guest.checkOutDate}</td>

                    <td className="text-sm text-center">
                      {guest.numberOfNights}
                    </td>

                    <td className="text-right font-medium">
                      ৳{Number(guest.totalAmount || 0).toLocaleString()}
                    </td>

                    <td className="text-right text-green-600 font-medium">
                      ৳{Number(guest.advancePayment || 0).toLocaleString()}
                    </td>

                    <td className="text-right font-bold text-rose-700">
                      ৳{Number(guest.dueAmount || 0).toLocaleString()}
                    </td>

                    {/* Action - Checkout Button */}
                    <td className="text-center">
                      <Link
                        to={`/dashboard/check_in_out/check_out/${guest._id}`}
                      >
                        <button className="btn btn-sm bg-rose-700 hover:bg-rose-800 text-white border-none gap-1">
                          <MdCheckCircleOutline />
                          Checkout
                        </button>
                      </Link>
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

export default CheckOut;
