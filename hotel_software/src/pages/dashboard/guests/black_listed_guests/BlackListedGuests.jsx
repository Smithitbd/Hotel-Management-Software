import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxios from "../../../../hooks/useAxios";
import { RiHome3Line } from "react-icons/ri";
import { MdBlock } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";

const BlackListedGuests = () => {
  const axiosInstance = useAxios();

  const {
    data: bannedGuests = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["banned-guests"],
    queryFn: async () => {
      const res = await axiosInstance.get("/banned-guests");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <span className="loading loading-spinner loading-lg text-rose-700"></span>
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
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <MdBlock className="text-xl text-white" />
            </div>

            <h1 className="text-lg font-bold text-rose-700">
              Blacklisted Guest/s
            </h1>
          </div>

          <p className="text-gray-500">
            Manage all guests currently added to the blacklist.
          </p>
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-rose-700 text-white">
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
            {bannedGuests.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  No blacklisted guests found.
                </td>
              </tr>
            ) : (
              bannedGuests.map((guest) => (
                <tr key={guest._id} className="hover text-center bg-white">
                  {/* Guest Name */}
                  <td>
                    <div className="font-semibold">
                      {guest.guestName || "-"}
                    </div>
                  </td>

                  {/* Guest ID / Checkin ID */}
                  <td>
                    <div className="text-xs text-gray-600">
                      {guest.checkinId || "-"}
                    </div>
                  </td>

                  {/* Designation */}
                  <td>{guest.designation || "-"}</td>

                  {/* Address */}
                  <td>{guest.guestAddress || "-"}</td>

                  {/* NID */}
                  <td>{guest.nidNumber || "-"}</td>

                  {/* Contact */}
                  <td>{guest.contactNumber || "-"}</td>

                  {/* Status */}
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
