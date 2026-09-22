import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaPhone,
  FaIdCard,
  FaCalendarAlt,
  FaBed,
  FaMoneyBillWave,
  FaArrowLeft,
  FaPrint,
} from "react-icons/fa";
import { MdPeople } from "react-icons/md";
import useAxios from "../../../../hooks/useAxios";
import { Link } from "react-router";
import useAuth from "../../../../hooks/useAuth";
import CheckoutInvoice from "../../../../components/CheckoutInvoice";
import Swal from "sweetalert2";
import { RiHome3Line } from "react-icons/ri";

const GuestHistory = () => {
  const axiosInstance = useAxios();
  const { user, loading } = useAuth();
  const [selectedCheckout, setSelectedCheckout] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  if (loading) {
    return <span className="loading loading-spinner text-error"></span>;
  }

  // Unique guests
  const { data: guests = [], isLoading } = useQuery({
    queryKey: ["unique-guests", user?.email],
    queryFn: async () => {
      const res = await axiosInstance.get("/unique-guests", {
        params: { hotelEmail: user?.email },
      });
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Hotel info
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

  // ========== Load all stays of a guest and let user choose ==========
  const handlePrintInvoice = async (guest) => {
    try {
      // Use the new clean endpoint
      const res = await axiosInstance.get("/check-out/guest", {
        params: {
          hotelEmail: user?.email,
          contactNumber: guest.contactNumber,
          nidNumber: guest.nidNumber || "",
        },
      });

      const guestCheckouts = res.data; // already sorted newest first

      if (guestCheckouts.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Invoice Found",
          text: "No full checkout record found for this guest",
        });
        return;
      }

      // If only 1 stay → print directly
      if (guestCheckouts.length === 1) {
        setSelectedCheckout(guestCheckouts[0]);
        setShowInvoice(true);
        return;
      }

      // Multiple stays → let user choose which one
      const options = {};
      guestCheckouts.forEach((checkout, index) => {
        const date =
          checkout.actualCheckoutDate ||
          checkout.checkOutDate ||
          "Unknown Date";
        const room = checkout.roomNumber || "—";
        const amount = Number(
          checkout.finalAmount || checkout.totalCharges || 0,
        ).toLocaleString();

        options[index] = `${date}  |  Room ${room}  |  ৳${amount}`;
      });

      const { value: selectedIndex } = await Swal.fire({
        title: `${guest.guestName} - Select Stay`,
        text: "This guest stayed multiple times. Choose which invoice to print:",
        input: "select",
        inputOptions: options,
        inputPlaceholder: "Select a stay",
        showCancelButton: true,
        confirmButtonText: "Print This Invoice",
        confirmButtonColor: "#be123c",
        cancelButtonColor: "#6b7280",
      });

      if (selectedIndex !== undefined && selectedIndex !== null) {
        setSelectedCheckout(guestCheckouts[Number(selectedIndex)]);
        setShowInvoice(true);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not load invoice data",
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

  // ========== SHOW BOTH INVOICES ==========
  if (showInvoice && selectedCheckout) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print:hidden">
          <h1 className="text-xl font-bold text-rose-900">Guest Invoices</h1>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => window.print()}
              className="btn bg-rose-900 hover:bg-rose-800 text-white border-none gap-2"
            >
              <FaPrint /> Print Both Invoices
            </button>

            <button
              onClick={() => {
                setShowInvoice(false);
                setSelectedCheckout(null);
              }}
              className="btn btn-outline border-rose-900 text-rose-900 gap-2"
            >
              <FaArrowLeft /> Back to Guest List
            </button>
          </div>
        </div>

        <div className="print-area">
          <CheckoutInvoice
            checkoutData={selectedCheckout}
            hotelInfo={hotelInfo}
            variant="guest"
          />
          <CheckoutInvoice
            checkoutData={selectedCheckout}
            hotelInfo={hotelInfo}
            variant="hotel"
          />
        </div>
      </div>
    );
  }

  // ========== GUEST LIST ==========
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-900 flex items-center justify-center">
            <MdPeople className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-rose-900">Unique Guests</h1>
            <p className="text-sm text-gray-500">
              All unique guests who have stayed in the hotel
            </p>
          </div>
        </div>

        <Link to="/dashboard/guests">
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 border border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white rounded-lg transition-colors"
          >
            <RiHome3Line className="text-xl" />
          </button>
        </Link>
      </div>

      <div className="mb-6">
        <span className="badge badge-lg bg-rose-100 text-rose-900 border-none">
          Total Unique Guests: {guests.length}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-rose-50 text-rose-900">
              <tr>
                <th className="font-semibold">Guest</th>
                <th className="font-semibold">Contact</th>
                <th className="font-semibold">NID</th>
                <th className="font-semibold">Total Stays</th>
                <th className="font-semibold">Last Stay</th>
                <th className="font-semibold">Last Room</th>
                <th className="font-semibold">Total Spent</th>
                <th className="font-semibold text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {guests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-16 text-gray-400">
                    No guests found
                  </td>
                </tr>
              ) : (
                guests.map((guest) => (
                  <tr key={guest._id} className="hover:bg-gray-50">
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
                              <div className="w-full h-full bg-rose-100 flex items-center justify-center text-rose-900 font-bold text-lg">
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

                    <td>
                      <div className="flex items-center gap-1 text-sm">
                        <FaPhone className="text-rose-600 text-xs" />
                        {guest.contactNumber || "—"}
                      </div>
                    </td>

                    <td>
                      <div className="flex items-center gap-1 text-sm">
                        <FaIdCard className="text-rose-600 text-xs" />
                        {guest.nidNumber || "—"}
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-ghost font-sm w-26 ">
                        {guest.totalStays}{" "}
                        {guest.totalStays > 1 ? "times" : "time"}
                      </span>
                    </td>

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

                    <td>
                      <div className="flex items-center gap-1 text-sm">
                        <FaBed className="text-rose-600 text-xs" />
                        {guest.lastRoomNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        {guest.lastRoomVariant}
                      </div>
                    </td>

                    <td>
                      <div className="flex items-center gap-1 font-bold text-rose-900">
                        <FaMoneyBillWave className="text-xs" />৳
                        {(guest.totalSpent || 0).toLocaleString()}
                      </div>
                    </td>

                    <td className="text-center">
                      <button
                        onClick={() => handlePrintInvoice(guest)}
                        className="btn btn-sm bg-rose-900 hover:bg-rose-800 text-white border-none gap-1"
                        title="Print Invoice"
                      >
                        <FaPrint /> Print
                      </button>
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
