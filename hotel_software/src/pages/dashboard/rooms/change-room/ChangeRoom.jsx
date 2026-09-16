import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../hooks/useAxios";
import Swal from "sweetalert2";
import { MdMeetingRoom, MdSwapHoriz } from "react-icons/md";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { Link } from "react-router";

const ChangeRoom = () => {
  const axiosInstance = useAxios();

  const [selectedCheckInId, setSelectedCheckInId] = useState("");
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [daysStayed, setDaysStayed] = useState(0);

  // Get all active check-ins
  const { data: checkIns = [], isLoading: checkInsLoading } = useQuery({
    queryKey: ["active-checkins"],
    queryFn: async () => {
      const res = await axiosInstance.get("/check-in");
      return res.data.filter((item) => item.status !== "Checked Out");
    },
  });

  // Get available rooms
  const { data: rooms = [] } = useQuery({
    queryKey: ["all-rooms"],
    queryFn: async () => {
      const res = await axiosInstance.get("/rooms");
      return res.data.filter((room) => room.roomStatus === "Available");
    },
  });

  const selectedCheckIn = checkIns.find((c) => c._id === selectedCheckInId);
  const selectedNewRoom = rooms.find((r) => r.roomNo === newRoomNumber);

  // Calculate days stayed so far
  const calculateDaysStayed = () => {
    if (!selectedCheckIn) return 0;
    const checkInDate = new Date(selectedCheckIn.checkInDate);
    const today = new Date();
    const diffTime = today - checkInDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleTransfer = async () => {
    if (!selectedCheckInId || !newRoomNumber) {
      return Swal.fire(
        "Error",
        "Please select both old and new room",
        "warning",
      );
    }

    const stayed = daysStayed || calculateDaysStayed();
    const remainingNights = selectedCheckIn.numberOfNights - stayed;

    const confirm = await Swal.fire({
      title: "Confirm Room Transfer?",
      html: `
        <div class="text-left text-sm">
          <p><b>From:</b> Room ${selectedCheckIn.roomNumber} (${selectedCheckIn.roomVariantName})</p>
          <p><b>To:</b> Room ${newRoomNumber} (${selectedNewRoom?.variantName})</p>
          <p><b>Days Stayed:</b> ${stayed} days</p>
          <p><b>Cost so far:</b> ৳${stayed * selectedCheckIn.pricePerNight}</p>
          <p><b>Remaining Nights:</b> ${remainingNights}</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#BF1E2E",
      confirmButtonText: "Yes, Transfer",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosInstance.post("/change-room", {
        checkInId: selectedCheckInId,
        newRoomNumber,
        newRoomVariantId: selectedNewRoom?.variantId || selectedNewRoom?._id,
        newRoomVariantName: selectedNewRoom?.variantName,
        newPricePerNight: selectedNewRoom?.price,
        daysStayed: stayed,
        remainingNights,
      });

      if (res.data.success) {
        await Swal.fire({
          title: "Success!",
          text: "Room transferred successfully",
          icon: "success",
          confirmButtonColor: "#BF1E2E",
        });

        // Reset form
        setSelectedCheckInId("");
        setNewRoomNumber("");
        setDaysStayed(0);
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Failed to transfer room",
        "error",
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-900 flex items-center justify-center">
              <MdSwapHoriz className="text-xl text-white" />
            </div>
            <h1 className="text-lg font-bold text-rose-900">Change Room</h1>
          </div>
          <p className="text-gray-500 ml-12">
            Transfer a guest from one room to another.
          </p>
        </div>

        <Link to="/dashboard/check_in_out">
          <button className="flex items-center justify-center w-9 h-9 border border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white rounded-lg transition-colors">
            <IoArrowBackCircleSharp className="text-3xl" />
          </button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Select Current Guest / Old Room */}
        <div>
          <label className="label">
            <span className="label-text font-medium">
              Select Current Guest (Old Room)
            </span>
          </label>
          <select
            value={selectedCheckInId}
            onChange={(e) => {
              setSelectedCheckInId(e.target.value);
              setDaysStayed(0);
            }}
            className="select select-bordered w-full bg-white"
          >
            <option value="">Select Guest / Room</option>
            {checkInsLoading ? (
              <option>Loading...</option>
            ) : (
              checkIns.map((checkIn) => (
                <option key={checkIn._id} value={checkIn._id}>
                  Room {checkIn.roomNumber} — {checkIn.guestName} (
                  {checkIn.roomVariantName})
                </option>
              ))
            )}
          </select>
        </div>

        {/* Show Old Room Info */}
        {selectedCheckIn && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
            <h3 className="font-bold text-rose-900 mb-3">Current Stay Info</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Guest</p>
                <p className="font-medium">{selectedCheckIn.guestName}</p>
              </div>
              <div>
                <p className="text-gray-500">Current Room</p>
                <p className="font-medium">
                  {selectedCheckIn.roomNumber} (
                  {selectedCheckIn.roomVariantName})
                </p>
              </div>
              <div>
                <p className="text-gray-500">Price / Night</p>
                <p className="font-medium">৳{selectedCheckIn.pricePerNight}</p>
              </div>
              <div>
                <p className="text-gray-500">Check-In Date</p>
                <p className="font-medium">{selectedCheckIn.checkInDate}</p>
              </div>
            </div>
          </div>
        )}

        {/* Days Stayed */}
        {selectedCheckIn && (
          <div>
            <label className="label">
              <span className="label-text font-medium">
                Days Already Stayed (Old Room)
              </span>
            </label>
            <input
              type="number"
              min="0"
              value={daysStayed || calculateDaysStayed()}
              onChange={(e) => setDaysStayed(Number(e.target.value))}
              className="input input-bordered w-full max-w-xs bg-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              Auto calculated: {calculateDaysStayed()} days (you can edit)
            </p>
          </div>
        )}

        {/* Select New Room */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Select New Room</span>
          </label>
          <select
            value={newRoomNumber}
            onChange={(e) => setNewRoomNumber(e.target.value)}
            className="select select-bordered w-full bg-white"
            disabled={!selectedCheckInId}
          >
            <option value="">Select New Room</option>
            {rooms
              .filter((r) => r.roomNo !== selectedCheckIn?.roomNumber)
              .map((room) => (
                <option key={room._id} value={room.roomNo}>
                  Room {room.roomNo} — {room.variantName} (৳{room.price}/night)
                </option>
              ))}
          </select>
        </div>

        {/* Cost Summary */}
        {selectedCheckIn && newRoomNumber && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-700 mb-3">Transfer Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Days Stayed in Old Room:</span>
                <span className="font-medium">
                  {daysStayed || calculateDaysStayed()} days
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cost so far (Old Room):</span>
                <span className="font-medium text-rose-900">
                  ৳
                  {(daysStayed || calculateDaysStayed()) *
                    selectedCheckIn.pricePerNight}
                </span>
              </div>
              <div className="flex justify-between">
                <span>New Room Price:</span>
                <span className="font-medium">
                  ৳{selectedNewRoom?.price} / night
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleTransfer}
            disabled={!selectedCheckInId || !newRoomNumber}
            className="btn bg-[#BF1E2E] text-white hover:bg-red-800 border-none px-8"
          >
            <MdSwapHoriz className="text-xl" />
            Transfer Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeRoom;
