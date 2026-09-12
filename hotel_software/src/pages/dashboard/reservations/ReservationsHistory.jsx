import { useQuery } from "@tanstack/react-query";
import { MdWorkHistory, MdDelete } from "react-icons/md";
import { Link } from "react-router";
import useAxios from "../../../hooks/useAxios";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import Swal from "sweetalert2";

const ReservationsHistory = () => {
  const axiosInstance = useAxios();
  const {
    data: reservations = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["reservations-history"],
    queryFn: async () => {
      const res = await axiosInstance.get("/reservations");
      return res.data;
    },
  });

  const handleDelete = async (id, guestName) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete reservation of "${guestName}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#BF1E2E",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.delete(`/reservations/${id}`);
      refetch();

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Reservation has been deleted.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not delete reservation. Please try again.",
      });
    }
  };

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
                Reservations History
              </h1>
              <p className="text-sm text-gray-500">
                View all previous room reservations.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/dashboard/reservations">
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
              title="Back to Reservations"
            >
              <IoArrowBackCircleSharp className="text-xl" />
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
            Failed to load reservations. Please try again.
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No reservations found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-rose-50 text-rose-800 text-sm">
                  <th className="font-semibold py-4">#</th>
                  <th className="font-semibold">Guest Name</th>
                  <th className="font-semibold">Contact</th>
                  <th className="font-semibold">Room</th>
                  <th className="font-semibold">Room No</th>
                  <th className="font-semibold">Arrival</th>
                  <th className="font-semibold">Departure</th>
                  <th className="font-semibold text-right">Price</th>
                  <th className="font-semibold text-center">Status</th>
                  <th className="font-semibold">Booked At</th>
                  <th className="font-semibold text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {reservations.map((reservation, index) => (
                  <tr
                    key={reservation._id}
                    className="hover:bg-rose-50/50 border-b border-gray-100"
                  >
                    <td className="font-medium text-gray-500">{index + 1}</td>

                    <td className="font-medium">
                      {reservation.guestName || "—"}
                    </td>

                    <td className="text-sm">
                      {reservation.contactNumber || "—"}
                    </td>

                    <td>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">
                          {reservation.room?.variantName || "—"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {reservation.room?.baseRoomType} •{" "}
                          {reservation.room?.bedType}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="font-medium">
                        {reservation.room?.roomNo || "—"}
                      </span>
                    </td>

                    <td className="text-sm text-gray-600">
                      {reservation.arrivingDate
                        ? new Date(reservation.arrivingDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "—"}
                    </td>

                    <td className="text-sm text-gray-600">
                      {reservation.departureDate
                        ? new Date(
                            reservation.departureDate,
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    <td className="text-right">
                      <span className="font-bold text-rose-700 text-base">
                        ৳{Number(reservation.room?.price || 0).toLocaleString()}
                      </span>
                    </td>

                    <td className="text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          reservation.status === "Reserved"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : reservation.status === "Cancelled"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : reservation.status === "Checked-In"
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : "bg-amber-100 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {reservation.status || "—"}
                      </span>
                    </td>

                    <td className="text-sm text-gray-600 whitespace-nowrap">
                      {reservation.createdAt
                        ? new Date(reservation.createdAt).toLocaleString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )
                        : "—"}
                    </td>

                    {/* Action Column */}
                    <td>
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          className="btn btn-sm bg-[#BF1E2E] text-white hover:bg-red-800 border-none gap-1"
                          title="Delete Reservation"
                          onClick={() =>
                            handleDelete(reservation._id, reservation.guestName)
                          }
                        >
                          <MdDelete />
                          Delete
                        </button>
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

export default ReservationsHistory;
