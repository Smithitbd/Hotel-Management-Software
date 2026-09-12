import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxios from "../../../../hooks/useAxios";
import { FaHotel, FaArrowLeft } from "react-icons/fa";
import { MdDelete, MdCheckCircle } from "react-icons/md";
import Swal from "sweetalert2";

const Hotels = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  const [loadingId, setLoadingId] = useState(null);

  // Fetch all hotels
  const { data: hotels = [], isLoading } = useQuery({
    queryKey: ["hotels"],
    queryFn: async () => {
      const res = await axiosInstance.get("/hotels");
      return res.data;
    },
  });

  // ====================== APPROVE HOTEL ======================
  const handleApprove = async (hotel) => {
    const result = await Swal.fire({
      title: "Approve this hotel?",
      text: `Do you want to approve "${hotel.hotelName}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#be123c",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Approve",
    });

    if (!result.isConfirmed) return;

    try {
      setLoadingId(hotel._id);

      await axiosInstance.patch(`/hotels/${hotel._id}`, {
        status: "Approved",
      });

      await queryClient.invalidateQueries({ queryKey: ["hotels"] });

      Swal.fire({
        title: "Approved!",
        text: `"${hotel.hotelName}" has been approved successfully.`,
        icon: "success",
        confirmButtonColor: "#be123c",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to approve hotel",
        icon: "error",
        confirmButtonColor: "#be123c",
      });
    } finally {
      setLoadingId(null);
    }
  };

  // ====================== CHANGE STATUS ======================
  const handleStatusChange = async (id, newStatus, hotelName) => {
    const result = await Swal.fire({
      title: "Change Status?",
      text: `Do you want to change the status of "${hotelName}" to "${newStatus}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#be123c",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Change",
    });

    if (!result.isConfirmed) return;

    try {
      setLoadingId(id);

      await axiosInstance.patch(`/hotels/${id}`, { status: newStatus });
      await queryClient.invalidateQueries({ queryKey: ["hotels"] });

      Swal.fire({
        title: "Updated!",
        text: `Status changed to ${newStatus}`,
        icon: "success",
        confirmButtonColor: "#be123c",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update status",
        icon: "error",
        confirmButtonColor: "#be123c",
      });
    } finally {
      setLoadingId(null);
    }
  };

  // ====================== DELETE HOTEL ======================
  const handleDelete = async (hotel) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `This will permanently delete "${hotel.hotelName}"!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#be123c",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
    });

    if (!result.isConfirmed) return;

    try {
      setLoadingId(hotel._id);

      await axiosInstance.delete(`/hotels/${hotel._id}`);
      await queryClient.invalidateQueries({ queryKey: ["hotels"] });

      Swal.fire({
        title: "Deleted!",
        text: "Hotel has been deleted.",
        icon: "success",
        confirmButtonColor: "#be123c",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete hotel",
        icon: "error",
        confirmButtonColor: "#be123c",
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-rose-700 flex items-center justify-center shadow-md">
              <FaHotel className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-rose-700">Hotels</h1>
              <p className="text-sm text-gray-500">
                Manage registered hotels & properties
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <Link
          to="/dashboard/settings"
          className="btn btn-circle bg-rose-700 hover:bg-[#BF1E2E] text-white border-none"
        >
          <FaArrowLeft />
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-rose-700 text-white px-6 py-4">
          <h2 className="text-lg font-bold">All Hotels</h2>
          <p className="text-sm text-rose-100">
            View, approve, change status or delete hotels
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-rose-700"></span>
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No hotels found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-rose-50 text-rose-800 text-sm">
                  <th className="font-semibold">Logo</th>
                  <th className="font-semibold">Hotel Name</th>
                  <th className="font-semibold">Type</th>
                  <th className="font-semibold">Owner</th>
                  <th className="font-semibold">Email</th>
                  <th className="font-semibold">Phone</th>
                  <th className="font-semibold text-center">Status</th>
                  <th className="font-semibold text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {hotels.map((hotel) => {
                  const isProcessing = loadingId === hotel._id;

                  return (
                    <tr
                      key={hotel._id}
                      className="hover:bg-rose-50/50 border-b border-gray-100"
                    >
                      {/* Logo */}
                      <td>
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12 bg-gray-200">
                            {hotel.logo ? (
                              <img
                                src={`${
                                  import.meta.env.VITE_API_URL ||
                                  "http://localhost:3000"
                                }${hotel.logo}`}
                                alt={hotel.hotelName}
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No Logo
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="font-medium">{hotel.hotelName}</td>
                      <td className="text-sm text-gray-600">
                        {hotel.propertyType || "—"}
                      </td>
                      <td className="text-sm">{hotel.ownerName || "—"}</td>
                      <td className="text-sm">{hotel.email || "—"}</td>
                      <td className="text-sm">{hotel.phone || "—"}</td>

                      {/* Status Dropdown */}
                      <td className="text-center">
                        <select
                          value={hotel.status || "Pending"}
                          disabled={isProcessing}
                          onChange={(e) => {
                            if (e.target.value !== hotel.status) {
                              handleStatusChange(
                                hotel._id,
                                e.target.value,
                                hotel.hotelName,
                              );
                            }
                          }}
                          className="select select-bordered select-sm font-semibold bg-white m-6"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Due">Due</option>
                          <option value="Approved">Approved</option>
                        </select>
                      </td>

                      {/* Action Buttons */}
                      <td>
                        <div className="flex items-center justify-center gap-2">
                          {hotel.status !== "Approved" && (
                            <button
                              onClick={() => handleApprove(hotel)}
                              disabled={isProcessing}
                              className="btn btn-sm bg-green-600 text-white hover:bg-green-700 border-none gap-1"
                            >
                              {isProcessing ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : (
                                <MdCheckCircle />
                              )}
                              Approve
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(hotel)}
                            disabled={isProcessing}
                            className="btn btn-sm btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white gap-1"
                          >
                            {isProcessing ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              <MdDelete />
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;
