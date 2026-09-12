import { useQuery } from "@tanstack/react-query";
import {
  FaPhone,
  FaIdCard,
  FaCalendarAlt,
  FaBed,
  FaMoneyBillWave,
  FaArrowLeft,
} from "react-icons/fa";
import { MdPeople } from "react-icons/md";
import useAxios from "../../../../hooks/useAxios";
import { Link } from "react-router";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const GuestHistory = () => {
  const axiosInstance = useAxios();

  const { data: guests = [], isLoading } = useQuery({
    queryKey: ["unique-guests"],
    queryFn: async () => {
      const res = await axiosInstance.get("/unique-guests");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-rose-700"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* ====================== HEADER ====================== */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
            <MdPeople className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-rose-700">Unique Guests</h1>
            <p className="text-sm text-gray-500">
              All unique guests who have stayed in the hotel
            </p>
          </div>
        </div>

        {/* Back Button */}
        <Link
          to="/dashboard/guests"
          className="btn btn-circle bg-rose-700 hover:bg-[#BF1E2E] text-white border-none"
          title="Back"
        >
          <FaArrowLeft />
        </Link>
      </div>

      {/* Total count */}
      <div className="mb-6">
        <span className="badge badge-lg bg-rose-100 text-rose-700 border-none">
          Total Unique Guests: {guests.length}
        </span>
      </div>

      {/* ====================== TABLE ====================== */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-rose-50 text-rose-800">
              <tr>
                <th className="font-semibold">Guest</th>
                <th className="font-semibold">Contact</th>
                <th className="font-semibold">NID</th>
                <th className="font-semibold">Total Stays</th>
                <th className="font-semibold">Last Stay</th>
                <th className="font-semibold">Last Room</th>
                <th className="font-semibold">Total Spent</th>
              </tr>
            </thead>

            <tbody>
              {guests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-16 text-gray-400">
                    No guests found
                  </td>
                </tr>
              ) : (
                guests.map((guest) => (
                  <tr key={guest._id} className="hover:bg-gray-50">
                    {/* Guest + Image */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-full ring ring-rose-200 ring-offset-1">
                            {guest.personImage ? (
                              <img
                                src={`${
                                  import.meta.env.VITE_API_URL ||
                                  "http://localhost:3000"
                                }${guest.personImage}`}
                                alt={guest.guestName}
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold text-lg">
                                {guest.guestName?.charAt(0)?.toUpperCase()}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">
                            {guest.guestName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {guest.designation || "Guest"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td>
                      <div className="flex items-center gap-1 text-sm">
                        <FaPhone className="text-rose-600 text-xs" />
                        {guest.contactNumber || "—"}
                      </div>
                    </td>

                    {/* NID */}
                    <td>
                      <div className="flex items-center gap-1 text-sm">
                        <FaIdCard className="text-rose-600 text-xs" />
                        {guest.nidNumber || "—"}
                      </div>
                    </td>

                    {/* Total Stays */}
                    <td>
                      <span className="badge badge-ghost font-medium">
                        {guest.totalStays}{" "}
                        {guest.totalStays > 1 ? "times" : "time"}
                      </span>
                    </td>

                    {/* Last Checkout Date */}
                    <td>
                      <div className="flex items-center gap-1 text-sm">
                        <FaCalendarAlt className="text-rose-600 text-xs" />
                        {guest.lastCheckoutDate
                          ? new Date(guest.lastCheckoutDate).toLocaleDateString(
                              "en-GB",
                            )
                          : "—"}
                      </div>
                    </td>

                    {/* Last Room */}
                    <td>
                      <div className="flex items-center gap-1 text-sm">
                        <FaBed className="text-rose-600 text-xs" />
                        {guest.lastRoomNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        {guest.lastRoomVariant}
                      </div>
                    </td>

                    {/* Total Spent */}
                    <td>
                      <div className="flex items-center gap-1 font-bold text-rose-700">
                        <FaMoneyBillWave className="text-xs" />৳
                        {(guest.totalSpent || 0).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GuestHistory;
