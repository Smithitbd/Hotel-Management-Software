import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxios from "../../../../hooks/useAxios";
import { RiHome3Line } from "react-icons/ri";
import { MdBlock } from "react-icons/md";
import { useState, useMemo } from "react";
import useUserStatus from "../../../../hooks/useUserStatus";

const BlackListedGuests = () => {
  const axiosInstance = useAxios();
  const { hotelEmail, statusLoading } = useUserStatus(); // ← changed
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: bannedGuests = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["banned-guests", hotelEmail], // ← changed
    queryFn: async () => {
      const res = await axiosInstance.get("/banned-guests", {
        params: { hotelEmail }, // ← changed
      });
      return res.data;
    },
    enabled: !!hotelEmail, // ← changed
  });

  // Search filter: Name, NID, Contact Number, Address, Designation
  const filteredGuests = useMemo(() => {
    if (!searchTerm.trim()) return bannedGuests;

    const term = searchTerm.toLowerCase().trim();

    return bannedGuests.filter((guest) => {
      const name = (guest.guestName || "").toLowerCase();
      const nid = (guest.nidNumber || "").toLowerCase();
      const contact = (guest.contactNumber || "").toLowerCase();
      const address = (guest.guestAddress || "").toLowerCase();
      const designation = (guest.designation || "").toLowerCase();
      const id = String(guest.checkinId || "").toLowerCase();

      return (
        name.includes(term) ||
        nid.includes(term) ||
        contact.includes(term) ||
        address.includes(term) ||
        designation.includes(term) ||
        id.includes(term)
      );
    });
  }, [bannedGuests, searchTerm]);

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
        <p>Failed to load blacklisted guests.</p>
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
              <MdBlock className="text-xl text-white" />
            </div>
            <h1 className="text-lg font-bold text-rose-900">
              Blacklisted Guest/s
            </h1>
          </div>
          <p className="text-gray-500">
            Manage all guests currently added to the blacklist.
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
            placeholder="Search by Name, NID, Contact, Address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full bg-white focus:outline-none focus:border-rose-900"
          />
        </div>

        <span className="badge badge-lg bg-rose-100 text-rose-900 border-none">
          Total Blacklisted: {filteredGuests.length}
          {searchTerm && ` (of ${bannedGuests.length})`}
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
              <th>Guest Name</th>
              <th>Guest ID</th>
              <th>Designation</th>
              <th>Address</th>
              <th>NID Number</th>
              <th>Contact Number</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredGuests.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  {searchTerm
                    ? "No blacklisted guests found matching your search."
                    : "No blacklisted guests found."}
                </td>
              </tr>
            ) : (
              filteredGuests.map((guest) => (
                <tr key={guest._id} className="hover text-center bg-white">
                  <td>
                    <div className="font-semibold">
                      {guest.guestName || "-"}
                    </div>
                  </td>

                  <td>
                    <div className="text-xs text-gray-600 break-all max-w-[140px]">
                      {guest.checkinId || "-"}
                    </div>
                  </td>

                  <td>{guest.designation || "-"}</td>

                  <td>{guest.guestAddress || "-"}</td>

                  <td>{guest.nidNumber || "-"}</td>

                  <td>{guest.contactNumber || "-"}</td>

                  <td>
                    <span className="px-4 py-2 rounded-full bg-black text-white text-sm font-semibold">
                      Blacklisted
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlackListedGuests;
