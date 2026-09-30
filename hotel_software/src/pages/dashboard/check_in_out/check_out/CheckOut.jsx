import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxios from "../../../../hooks/useAxios";
import { MdCheckCircleOutline } from "react-icons/md";
import useUserStatus from "../../../../hooks/useUserStatus";
import { RiHome3Line } from "react-icons/ri";
import { useState } from "react";

const CheckOut = () => {
  const axiosInstance = useAxios();
  const { hotelEmail, statusLoading } = useUserStatus();
  const [searchTerm, setSearchTerm] = useState("");

  const getImageUrl = (path) => {
    if (!path || typeof path !== "string") return null;
    const trimmed = path.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    const base = (
      import.meta.env.VITE_API_URL || "http://localhost:3000"
    ).replace(/\/$/, "");
    return `${base}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
  };

  const {
    data: checkIns = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["check-ins-for-checkout", hotelEmail],
    queryFn: async () => {
      const res = await axiosInstance.get("/check-in", {
        params: { hotelEmail },
      });
      return res.data;
    },
    enabled: !!hotelEmail,
  });

  const term = searchTerm.toLowerCase().trim();
  const filteredGuests = !term
    ? checkIns
    : checkIns.filter((guest) => {
        const name = (guest.guestName || "").toLowerCase();
        const nid = (guest.nidNumber || "").toLowerCase();
        const contact = (guest.contactNumber || "").toLowerCase();
        const room = String(guest.roomNumber || "").toLowerCase();
        return (
          name.includes(term) ||
          nid.includes(term) ||
          contact.includes(term) ||
          room.includes(term)
        );
      });

  const formatDiscount = (guest) => {
    if (!guest.discountValue || guest.discountValue <= 0) {
      return { type: "-", value: "-" };
    }
    if (guest.discountType === "percentage") {
      return { type: "Percentage", value: `${guest.discountValue}%` };
    }
    return {
      type: "Amount",
      value: `৳${Number(guest.discountValue).toLocaleString()}`,
    };
  };

  if (statusLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <span className="loading loading-spinner loading-lg text-rose-900"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-8">
      <div className="flex flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-900 flex items-center justify-center">
              <MdCheckCircleOutline className="text-xl text-white" />
            </div>
            <h1 className="text-lg font-bold text-rose-900">Guest Checkout</h1>
          </div>
          <p className="text-gray-500">
            Select a guest to complete the checkout process
          </p>
        </div>

        <Link to="/dashboard/check_in_out">
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 border border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white rounded-lg transition-colors"
          >
            <RiHome3Line className="text-xl" />
          </button>
        </Link>
      </div>

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
          Currently Checked-In: {filteredGuests.length}
          {searchTerm && ` (of ${checkIns.length})`}
        </span>
      </div>

      {searchTerm && (
        <p className="text-sm text-gray-500 mb-4">
          Showing {filteredGuests.length} result
          {filteredGuests.length !== 1 ? "s" : ""} for "{searchTerm}"
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-rose-900 text-white">
            <tr className="text-center">
              <th>Image</th>
              <th>Guest Name</th>
              <th>NID</th>
              <th>Contact</th>
              <th>Room</th>
              <th>Variant</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Nights</th>
              <th>Guests</th>
              <th>Discount Type</th>
              <th>Discount Value</th>
              <th>Subtotal</th>
              <th>Total</th>
              <th>Advance</th>
              <th>Due</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {isError ? (
              <tr>
                <td colSpan="17" className="text-center py-10 text-red-500">
                  Failed to load check-in data. Please try again.
                </td>
              </tr>
            ) : filteredGuests.length === 0 ? (
              <tr>
                <td colSpan="17" className="text-center py-10 text-gray-500">
                  {searchTerm
                    ? "No guests found matching your search."
                    : "No guests currently checked-in."}
                </td>
              </tr>
            ) : (
              filteredGuests.map((guest) => {
                const discount = formatDiscount(guest);
                const imageUrl = getImageUrl(guest.personImage);

                return (
                  <tr key={guest._id} className="hover text-center bg-white">
                    <td>
                      <div className="flex justify-center">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={guest.guestName}
                            className="w-12 h-12 rounded-full object-cover border border-gray-200"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.style.display = "none";
                              const fallback =
                                e.currentTarget.nextElementSibling;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs"
                          style={{ display: imageUrl ? "none" : "flex" }}
                        >
                          N/A
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="font-semibold">{guest.guestName}</div>
                      <div className="text-xs text-gray-500">
                        {guest.designation || "-"}
                      </div>
                    </td>

                    <td>{guest.nidNumber || "-"}</td>
                    <td>{guest.contactNumber || "-"}</td>
                    <td className="font-semibold">Room {guest.roomNumber}</td>
                    <td>{guest.roomVariantName || "-"}</td>

                    <td>
                      <div>
                        {guest.checkInDate
                          ? new Date(guest.checkInDate).toLocaleDateString()
                          : "-"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {guest.checkInTime || ""}
                      </div>
                    </td>

                    <td>
                      {guest.checkOutDate
                        ? new Date(guest.checkOutDate).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>{guest.numberOfNights || 0}</td>
                    <td>{guest.numberOfGuests || 1}</td>
                    <td className="font-medium text-sm">{discount.type}</td>
                    <td className="font-medium text-green-700">
                      {discount.value}
                    </td>

                    <td className="font-medium">
                      ৳
                      {Number(
                        guest.subtotal || guest.totalAmount || 0,
                      ).toLocaleString()}
                    </td>

                    <td className="font-medium">
                      ৳{Number(guest.totalAmount || 0).toLocaleString()}
                    </td>

                    <td className="text-green-600 font-medium">
                      ৳{Number(guest.advancePayment || 0).toLocaleString()}
                    </td>

                    <td className="text-orange-600 font-bold">
                      ৳{Number(guest.dueAmount || 0).toLocaleString()}
                    </td>

                    <td>
                      <Link
                        to={`/dashboard/check_in_out/check_out/${guest._id}`}
                      >
                        <button className="btn btn-sm bg-rose-900 hover:bg-rose-800 text-white border-none gap-1">
                          <MdCheckCircleOutline />
                          Checkout
                        </button>
                      </Link>
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

export default CheckOut;
