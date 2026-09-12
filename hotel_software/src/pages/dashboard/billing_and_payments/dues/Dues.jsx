import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { MdPayments, MdSearch } from "react-icons/md";
import { RiHome3Line } from "react-icons/ri";
import { Link } from "react-router";
import useAxios from "../../../../hooks/useAxios";

const AllGuestDues = () => {
  const axiosInstance = useAxios();

  const { register, watch } = useForm({
    defaultValues: {
      searchRoom: "",
    },
  });

  const searchRoom = watch("searchRoom");

  const { data: duesList = [], isLoading } = useQuery({
    queryKey: ["all-dues"],
    queryFn: async () => {
      const res = await axiosInstance.get("/check-in/all-dues");
      return res.data;
    },
  });

  // Filter by room number
  const filteredDues = searchRoom?.trim()
    ? duesList.filter((item) =>
        String(item.roomNumber)
          .toLowerCase()
          .includes(searchRoom.trim().toLowerCase()),
      )
    : duesList;

  const grandTotal = filteredDues.reduce(
    (sum, item) => sum + (item.totalDue || 0),
    0,
  );

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <MdPayments className="text-xl text-white" />
            </div>
            <h1 className="text-lg font-bold text-rose-700">
              Services Total Dues
            </h1>
          </div>
          <p className="text-gray-500 ml-12">
            View all due amounts from check-in. Search by room number.
          </p>
        </div>

        <Link to="/dashboard/billing_and_payments">
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
          >
            <RiHome3Line className="text-xl" />
          </button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white shadow-lg rounded-2xl p-5 mb-6">
        <div className="relative max-w-sm">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search by room number..."
            {...register("searchRoom")}
            className="input input-bordered w-full pl-10 bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-rose-700 text-white">
              <tr>
                <th className="text-white">#</th>
                <th className="text-white">Room</th>
                <th className="text-white">Guest Name</th>
                <th className="text-white">Contact</th>
                <th className="text-white">Check-In</th>
                <th className="text-white">Check-Out</th>
                <th className="text-white text-right">Room Due</th>
                <th className="text-white text-right">Restaurant</th>
                <th className="text-white text-right">Laundry</th>
                <th className="text-white text-right">Transport</th>
                <th className="text-white text-right">Total Due</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="11" className="text-center py-10 text-gray-500">
                    Loading dues...
                  </td>
                </tr>
              ) : filteredDues.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-10 text-gray-500">
                    {searchRoom
                      ? `No dues found for room "${searchRoom}"`
                      : "No dues found"}
                  </td>
                </tr>
              ) : (
                filteredDues.map((item, index) => (
                  <tr key={item._id} className="hover:bg-rose-50">
                    <td>{index + 1}</td>
                    <td className="font-semibold text-rose-700">
                      {item.roomNumber}
                    </td>
                    <td>{item.guestName}</td>
                    <td>{item.contactNumber}</td>
                    <td>{item.checkInDate}</td>
                    <td>{item.checkOutDate}</td>
                    <td className="text-right">
                      ৳{(item.roomDue || 0).toLocaleString()}
                    </td>
                    <td className="text-right">
                      ৳{(item.restaurantDue || 0).toLocaleString()}
                    </td>
                    <td className="text-right">
                      ৳{(item.laundryDue || 0).toLocaleString()}
                    </td>
                    <td className="text-right">
                      ৳{(item.transportDue || 0).toLocaleString()}
                    </td>
                    <td className="text-right font-bold text-rose-700">
                      ৳{(item.totalDue || 0).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {filteredDues.length > 0 && (
              <tfoot>
                <tr className="bg-rose-50 font-bold">
                  <td colSpan="6" className="text-right pr-4">
                    Grand Total
                  </td>
                  <td className="text-right">
                    ৳
                    {filteredDues
                      .reduce((s, i) => s + (i.roomDue || 0), 0)
                      .toLocaleString()}
                  </td>
                  <td className="text-right">
                    ৳
                    {filteredDues
                      .reduce((s, i) => s + (i.restaurantDue || 0), 0)
                      .toLocaleString()}
                  </td>
                  <td className="text-right">
                    ৳
                    {filteredDues
                      .reduce((s, i) => s + (i.laundryDue || 0), 0)
                      .toLocaleString()}
                  </td>
                  <td className="text-right">
                    ৳
                    {filteredDues
                      .reduce((s, i) => s + (i.transportDue || 0), 0)
                      .toLocaleString()}
                  </td>
                  <td className="text-right text-rose-700 text-lg">
                    ৳{grandTotal.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllGuestDues;
