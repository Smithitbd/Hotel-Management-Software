import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxios from "../../../../hooks/useAxios";
import { MdOutlinePlaylistAddCheckCircle } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { RiHome3Line } from "react-icons/ri";
import { useState, useMemo } from "react";
import useUserStatus from "../../../../hooks/useUserStatus";

const PresentGuestList = () => {
  const axiosInstance = useAxios();
  const { hotelEmail, statusLoading } = useUserStatus();
  const [searchTerm, setSearchTerm] = useState("");

  const imageBaseUrl = (
    import.meta.env.VITE_API_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  const {
    data: checkIns = [],
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["check-ins", hotelEmail], // ← changed
    queryFn: async () => {
      const res = await axiosInstance.get("/check-in", {
        params: { hotelEmail }, // ← changed
      });
      return res.data;
    },
    enabled: !!hotelEmail, // ← changed
  });

  // Search filter: Name, NID, Contact Number, Room Number
  const filteredGuests = useMemo(() => {
    if (!searchTerm.trim()) return checkIns;

    const term = searchTerm.toLowerCase().trim();

    return checkIns.filter((guest) => {
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
  }, [checkIns, searchTerm]);

  const Guest_Status_Change = async (checkInId, status, checkIn) => {
    if (status === "Normal") {
      const res = await axiosInstance.delete(`/banned-guests/${checkInId}`);

      if (res.data.deletedCount > 0 || res.data.success) {
        Swal.fire({
          title: "Guest Status Updated!",
          text: "Guest has been removed from the banned guest list.",
          icon: "success",
          confirmButtonColor: "#BF1E2E",
        });
      }
      refetch();
    } else {
      const bannedGuest = {
        hotelEmail: checkIn.hotelEmail,
        checkinId: checkIn._id,
        designation: checkIn.designation,
        guestName: checkIn.guestName,
        guestAddress: checkIn.guestAddress,
        nidNumber: checkIn.nidNumber,
        contactNumber: checkIn.contactNumber,
      };

      const checkNid = await axiosInstance.get(
        `/banned-guests/check/${checkIn.nidNumber}`,
      );

      if (checkNid.data.exists) {
        Swal.fire({
          title: "Already Blacklisted!",
          text: `${checkIn.guestName} is already in the blacklisted guest list.`,
          icon: "warning",
          confirmButtonColor: "#BF1E2E",
        });
        return;
      }

      const res = await axiosInstance.post("/banned-guests", bannedGuest);

      if (res.data.insertedId || res.data.result?.insertedId) {
        Swal.fire({
          title: "Guest Banned!",
          text: `${checkIn.guestName} has been added to the banned guest list.`,
          icon: "success",
          confirmButtonColor: "#BF1E2E",
        });
      }
      refetch();
    }
  };

  const formatDiscount = (guest) => {
    if (!guest.discountValue || guest.discountValue <= 0) {
      return { type: "-", value: "-" };
    }

    if (guest.discountType === "percentage") {
      return {
        type: "Percentage",
        value: `${guest.discountValue}%`,
      };
    }

    return {
      type: "Amount",
      value: `৳${Number(guest.discountValue).toLocaleString()}`,
    };
  };

  // Better image URL helper (same as CheckOut page)
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

  if (isError) {
    return (
      <div className="text-center text-error py-10">
        <p>Failed to load guests.</p>
        <p className="text-sm">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-900 flex items-center justify-center">
              <MdOutlinePlaylistAddCheckCircle className="text-xl text-white" />
            </div>
            <h1 className="text-lg font-bold text-rose-900">
              Present Guest/s List
            </h1>
          </div>
          <p className="text-gray-500">
            Manage all currently checked-in guests.
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

      {/* Search Bar */}
      <div className="mb-6">
        <div className="form-control w-full max-w-md">
          <input
            type="text"
            placeholder="Search by Name, NID, Contact or Room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full bg-white focus:outline-none focus:border-rose-900"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-500 mt-2">
            Showing {filteredGuests.length} result
            {filteredGuests.length !== 1 ? "s" : ""} for "{searchTerm}"
          </p>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-rose-900 text-white">
            <tr className="text-center">
              <th>Image</th>
              <th>Guest Name</th>
              <th>NID Number</th>
              <th>Contact</th>
              <th>Room</th>
              <th>Variant</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Nights</th>
              <th>Guests</th>
              <th>Discount Type</th>
              <th>Discount Value</th>
              <th>Total</th>
              <th>Advance</th>
              <th>Due</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredGuests.length === 0 ? (
              <tr>
                <td colSpan="17" className="text-center py-10 text-gray-500">
                  {searchTerm
                    ? "No guests found matching your search."
                    : "No check-in records found."}
                </td>
              </tr>
            ) : (
              filteredGuests.map((checkIn) => {
                const discount = formatDiscount(checkIn);
                const imageUrl = getImageUrl(checkIn.personImage);

                return (
                  <tr key={checkIn._id} className="hover text-center bg-white">
                    {/* Guest Image */}
                    <td>
                      <div className="flex justify-center">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={checkIn.guestName}
                            className="w-12 h-12 rounded-full object-cover border border-gray-200"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                "https://via.placeholder.com/48?text=N/A";
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                            N/A
                          </div>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="font-semibold">{checkIn.guestName}</div>
                      <div className="text-xs text-gray-500">
                        {checkIn.designation || "-"}
                      </div>
                    </td>

                    <td>{checkIn.nidNumber || "-"}</td>
                    <td>{checkIn.contactNumber || "-"}</td>
                    <td className="font-semibold">Room {checkIn.roomNumber}</td>
                    <td>{checkIn.roomVariantName || "-"}</td>

                    <td>
                      <div>
                        {checkIn.checkInDate
                          ? new Date(checkIn.checkInDate).toLocaleDateString()
                          : "-"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {checkIn.checkInTime || ""}
                      </div>
                    </td>

                    <td>
                      {checkIn.checkOutDate
                        ? new Date(checkIn.checkOutDate).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>{checkIn.numberOfNights || 0}</td>
                    <td>{checkIn.numberOfGuests || 1}</td>
                    <td className="font-medium text-sm">{discount.type}</td>
                    <td className="font-medium text-green-700">
                      {discount.value}
                    </td>

                    <td className="font-medium">
                      ৳{Number(checkIn.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="text-green-600 font-medium">
                      ৳{Number(checkIn.advancePayment || 0).toLocaleString()}
                    </td>
                    <td className="text-orange-600 font-medium">
                      ৳{Number(checkIn.dueAmount || 0).toLocaleString()}
                    </td>

                    <td className="p-3">
                      <select
                        defaultValue={checkIn.status}
                        onChange={(e) =>
                          Guest_Status_Change(
                            checkIn._id,
                            e.target.value,
                            checkIn,
                          )
                        }
                        className={`select select-sm w-32 font-semibold text-white border-none outline-none ${
                          checkIn.status === "Ban"
                            ? "bg-black hover:bg-gray-900"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                      >
                        <option value="Normal" className="bg-white text-black">
                          Normal
                        </option>
                        <option value="Ban" className="bg-white text-black">
                          Ban
                        </option>
                      </select>
                    </td>

                    <td>
                      <Link
                        to={`/dashboard/guests/edit_guest_info/${checkIn._id}`}
                      >
                        <button className="btn btn-accent text-xl text-white m-2 rounded-2xl">
                          <FaUserEdit />
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

export default PresentGuestList;
