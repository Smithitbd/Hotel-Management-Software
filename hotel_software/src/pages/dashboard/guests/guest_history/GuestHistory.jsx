import { useState, useMemo } from "react";
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

import CheckoutInvoice from "../../../../components/CheckoutInvoice";
import Swal from "sweetalert2";
import { RiHome3Line } from "react-icons/ri";
import useUserStatus from "../../../../hooks/useUserStatus";

const GuestHistory = () => {
  const axiosInstance = useAxios();
  const { hotelEmail, statusLoading } = useUserStatus(); // ← changed
  const [selectedCheckout, setSelectedCheckout] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const imageBaseUrl = (
    import.meta.env.VITE_API_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  // Unique guests
  const { data: guests = [], isLoading } = useQuery({
    queryKey: ["unique-guests", hotelEmail], // ← changed
    queryFn: async () => {
      const res = await axiosInstance.get("/unique-guests", {
        params: { hotelEmail }, // ← changed
      });
      return res.data;
    },
    enabled: !!hotelEmail, // ← changed
  });

  // Hotel info (still needs the owner's email)
  const { data: hotelInfo } = useQuery({
    queryKey: ["hotel-info", hotelEmail], // ← changed
    queryFn: async () => {
      const res = await axiosInstance.get("/hotels/by-email", {
        params: { email: hotelEmail }, // ← changed
      });
      return res.data;
    },
    enabled: !!hotelEmail, // ← changed
  });

  // Search filter: Name, NID, Contact Number, Room
  const filteredGuests = useMemo(() => {
    if (!searchTerm.trim()) return guests;

    const term = searchTerm.toLowerCase().trim();

    return guests.filter((guest) => {
      const name = (guest.guestName || "").toLowerCase();
      const nid = (guest.nidNumber || "").toLowerCase();
      const contact = (guest.contactNumber || "").toLowerCase();
      const room = String(guest.lastRoomNumber || "").toLowerCase();

      return (
        name.includes(term) ||
        nid.includes(term) ||
        contact.includes(term) ||
        room.includes(term)
      );
    });
  }, [guests, searchTerm]);

  // ========== Load all stays of a guest and let user choose ==========
  const handlePrintInvoice = async (guest) => {
    try {
      const res = await axiosInstance.get("/check-out/guest", {
        params: {
          hotelEmail, // ← changed
          contactNumber: guest.contactNumber,
          nidNumber: guest.nidNumber || "",
        },
      });

      const guestCheckouts = res.data;

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

      // Multiple stays → let user choose
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

  // Better image URL helper
  const getImageUrl = (path) => {
    if (!path || typeof path !== "string") return null;
    const trimmed = path.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `${imageBaseUrl}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
  };

  if (statusLoading || isLoading) {
    // ← changed
    return (
      <div className="flex justify-center items-center min-h-96">
        <span className="loading loading-spinner loading-lg text-rose-900"></span>
      </div>
    );
  }

  if (!hotelEmail) {
    // ← added
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="text-amber-800">
            No hotel linked to this account. Please complete hotel registration.
          </p>
        </div>
      </div>
    );
  }

  // ========== SHOW INVOICES ==========
  if (showInvoice && selectedCheckout) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print:hidden">
          <h1 className="text-xl font-bold text-rose-900">Guest Invoices</h1>

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
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-900 flex items-center justify-center">
              <MdPeople className="text-xl text-white" />
            </div>
            <h1 className="text-lg font-bold text-rose-900">Unique Guests</h1>
          </div>
          <p className="text-gray-500">
            All unique guests who have stayed in the hotel
          </p>
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

      {/* Search + Total Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="form-control w-full max-w-md">
          <input
            type="text"
            placeholder="Search by Name, NID, Contact or Room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full bg-white focus:outline-none focus:border-rose-900"
          />
        </div>

        <span className="badge badge-lg bg-rose-100 text-rose-900 border-none">
          Total Unique Guests: {filteredGuests.length}
          {searchTerm && ` (of ${guests.length})`}
        </span>
      </div>

      {searchTerm && (
        <p className="text-sm text-gray-500 mb-4">
          Showing {filteredGuests.length} result
          {filteredGuests.length !== 1 ? "s" : ""} for "{searchTerm}"
        </p>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-rose-900 text-white">
            <tr className="text-center">
              <th>Guest</th>
              <th>Contact</th>
              <th>NID</th>
              <th>Total Stays</th>
              <th>Last Stay</th>
              <th>Last Room</th>
              <th>Total Spent</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredGuests.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-10 text-gray-500">
                  {searchTerm
                    ? "No guests found matching your search."
                    : "No guests found."}
                </td>
              </tr>
            ) : (
              filteredGuests.map((guest) => {
                const imageUrl = getImageUrl(guest.personImage);

                return (
                  <tr key={guest._id} className="hover text-center bg-white">
                    {/* Guest + Image */}
                    <td>
                      <div className="flex items-center gap-3 justify-center sm:justify-start">
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-full ring ring-rose-200 ring-offset-1">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={guest.guestName}
                                className="object-cover"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src =
                                    "https://via.placeholder.com/48?text=N/A";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-rose-100 flex items-center justify-center text-rose-900 font-bold text-lg">
                                {guest.guestName?.charAt(0)?.toUpperCase() ||
                                  "G"}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-left">
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
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <FaPhone className="text-rose-600 text-xs" />
                        {guest.contactNumber || "—"}
                      </div>
                    </td>

                    <td>
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <FaIdCard className="text-rose-600 text-xs" />
                        {guest.nidNumber || "—"}
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-ghost font-medium">
                        {guest.totalStays}{" "}
                        {guest.totalStays > 1 ? "times" : "time"}
                      </span>
                    </td>

                    <td>
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <FaCalendarAlt className="text-rose-600 text-xs" />
                        {guest.lastCheckoutDate
                          ? new Date(guest.lastCheckoutDate).toLocaleDateString(
                              "en-GB",
                            )
                          : "—"}
                      </div>
                    </td>

                    <td>
                      <div className="flex items-center justify-center gap-1 text-sm font-semibold">
                        <FaBed className="text-rose-600 text-xs" />
                        Room {guest.lastRoomNumber || "—"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {guest.lastRoomVariant || ""}
                      </div>
                    </td>

                    <td>
                      <div className="flex items-center justify-center gap-1 font-bold text-rose-900">
                        <FaMoneyBillWave className="text-xs" />৳
                        {(guest.totalSpent || 0).toLocaleString()}
                      </div>
                    </td>

                    <td>
                      <button
                        onClick={() => handlePrintInvoice(guest)}
                        className="btn btn-sm bg-rose-900 hover:bg-rose-800 text-white border-none gap-1"
                        title="Print Invoice"
                      >
                        <FaPrint /> Print
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestHistory;
