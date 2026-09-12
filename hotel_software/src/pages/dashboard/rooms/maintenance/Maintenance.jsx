import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../hooks/useAxios";
import { Link } from "react-router";
import { RiHome3Line } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";
import { FaHistory } from "react-icons/fa";
import { LuNetwork } from "react-icons/lu";

const Maintenance = () => {
  const axiosInstance = useAxios();

  const {
    data: rooms = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["rooms-maintenance"],
    queryFn: async () => {
      const res = await axiosInstance.get("/rooms/maintenance");
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
        <p>Failed to load rooms.</p>
        <p className="text-sm">{error?.message}</p>
        <button onClick={() => refetch()} className="btn btn-sm mt-3">
          Retry
        </button>
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
              <LuNetwork className="text-xl text-white" />
            </div>

            <div className="flex flex-row">
              <h1 className="text-lg font-bold text-rose-700">
                Maintain Rooms
              </h1>
            </div>
          </div>

          <p className="text-gray-500">List of under maintenance room/s</p>
        </div>

        <div className="flex flex-row gap-3">
          <Link to="/dashboard/rooms/maintenance_history">
            <button className="flex items-center justify-center w-11 h-11 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors">
              <FaHistory className="text-xl" />
            </button>
          </Link>
          <Link to="/dashboard/rooms">
            <button className="flex items-center justify-center w-11 h-11 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors">
              <RiHome3Line className="text-xl" />
            </button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-rose-700 text-white">
            <tr className="text-center">
              <th>#</th>
              <th>Image</th>
              <th>Room No</th>
              <th>Variant Name</th>
              <th>Type</th>
              <th>Max Occupancy</th>
              <th>Assigned Person</th>
              <th>Phone</th>
              <th>Cost</th>
              <th>Correctives</th>
              <th>Work Begins</th>
              <th>Work Ends</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan="14" className="text-center py-10 text-gray-500">
                  No rooms under maintenance.
                </td>
              </tr>
            ) : (
              rooms.map((room, index) => (
                <tr key={room._id} className="hover text-center bg-white">
                  <td>{index + 1}</td>

                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src={
                            room.image
                              ? `${axiosInstance.defaults.baseURL}${room.image}`
                              : "https://via.placeholder.com/150?text=No+Image"
                          }
                          alt={room.variantName}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="font-semibold">{room.roomNo}</td>
                  <td>{room.variantName}</td>
                  <td>{room.baseRoomType}</td>
                  <td>{room.maxOccupancy || "-"}</td>
                  <td>{room.assignedPerson || "-"}</td>
                  <td>{room.assignedPersonNumber || "-"}</td>
                  <td className="font-medium">৳{room.maintenanceCost || 0}</td>
                  <td>{room.correctives || "-"}</td>
                  <td>
                    {room.workBegins
                      ? new Date(room.workBegins).toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    {room.workEnds
                      ? new Date(room.workEnds).toLocaleString()
                      : "-"}
                  </td>

                  <td>
                    <span className="badge bg-rose-800 text-white w-28 h-11">
                      {room.roomStatus}
                    </span>
                  </td>

                  <td>
                    <div className="flex justify-center">
                      <Link
                        to={`/dashboard/rooms/edit_maintenance/${room._id}`}
                      >
                        <button className="btn btn-sm bg-rose-800 text-white border-none">
                          <AiFillEdit className="text-lg" />
                        </button>
                      </Link>
                    </div>
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

export default Maintenance;
