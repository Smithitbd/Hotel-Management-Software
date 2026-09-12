import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import useAxios from "../../../../../hooks/useAxios";
import { RiHome3Line } from "react-icons/ri";
import { MdManageHistory } from "react-icons/md";

const MaintenanceHistory = () => {
  const axiosInstance = useAxios();

  const {
    data: history = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["maintenance-history"],
    queryFn: async () => {
      const res = await axiosInstance.get("/maintenance-history");
      return res.data;
    },
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#BF1E2E",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await axiosInstance.delete(`/maintenance-history/${id}`);

      await Swal.fire({
        title: "Deleted!",
        text: "History has been deleted.",
        icon: "success",
        confirmButtonColor: "#BF1E2E",
      });

      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-rose-800"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
            <MdManageHistory className="text-2xl text-white" />
          </div>

          <div className="flex flex-row">
            <h1 className="text-lg font-bold text-[#BF1E2E]">
              Maintenance History
            </h1>
          </div>
        </div>

        <Link to="/dashboard/rooms">
          <button className="flex items-center justify-center w-11 h-11 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors">
            <RiHome3Line className="text-xl" />
          </button>
        </Link>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No maintenance history found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <div
              key={item._id}
              className="card bg-white shadow-md border border-gray-100 hover:shadow-xl hover:border-rose-800 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="card-body">
                {/* Status */}
                <div className="flex justify-between items-center mb-3">
                  <h2 className="card-title text-lg text-rose-800">
                    Maintenance Record
                  </h2>

                  <span className="badge bg-rose-800 text-white border-none">
                    {item.roomStatus || "Maintenance"}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  {/* Room Number */}
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Room No:</span>
                    <span className="font-medium">{item.roomNo || "-"}</span>
                  </div>

                  {/* Work Begins */}
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Work Begins:</span>
                    <span className="font-medium">
                      {item.workBegins || "-"}
                    </span>
                  </div>

                  {/* Work Ends */}
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Work Ends:</span>
                    <span className="font-medium">{item.workEnds || "-"}</span>
                  </div>

                  {/* Assigned Person */}
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Assigned Person:</span>
                    <span className="font-medium">
                      {item.assignedPerson || "-"}
                    </span>
                  </div>

                  {/* Phone */}
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-medium">
                      {item.assignedPersonNumber || "-"}
                    </span>
                  </div>

                  {/* Cost */}
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Cost:</span>
                    <span className="font-bold text-rose-800">
                      ৳{item.maintenanceCost ?? "0"}
                    </span>
                  </div>

                  {/* Correctives */}
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Correctives:</span>
                    <span className="font-medium text-right">
                      {item.correctives || "-"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="card-actions justify-end mt-5 gap-2">
                  <Link
                    to={`/dashboard/rooms/edit_maintenance_history/${item._id}`}
                  >
                    <button
                      type="button"
                      className="btn btn-sm bg-rose-700 hover:bg-rose-900 text-white border-none transition-colors duration-200"
                    >
                      <AiFillEdit className="text-lg" />
                      Edit
                    </button>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="btn btn-sm bg-rose-800 hover:bg-rose-950 text-white border-none transition-colors duration-200"
                  >
                    <AiFillDelete className="text-lg" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaintenanceHistory;
