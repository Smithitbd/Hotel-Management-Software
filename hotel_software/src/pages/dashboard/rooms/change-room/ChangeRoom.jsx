import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../hooks/useAxios";
import Swal from "sweetalert2";
import { MdHotel, MdSwapHoriz } from "react-icons/md";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { Link } from "react-router";
import useAuth from "../../../../hooks/useAuth";
import { RiHome3Line } from "react-icons/ri";

const ChangeRoom = () => {
  const axiosInstance = useAxios();
  const { user, loading } = useAuth();
  if (loading) {
    return <span className="loading loading-spinner text-error"></span>;
  }
  const [selectedCheckInId, setSelectedCheckInId] = useState("");
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [daysStayed, setDaysStayed] = useState(0);

  // Get all active check-ins
  const { data: checkIns = [], isLoading: checkInsLoading } = useQuery({
    queryKey: ["active-checkins"],
    queryFn: async () => {
      const res = await axiosInstance.get("/check-in", {
        params: { hotelEmail: user.email },
      });
      return res.data.filter((item) => item.status !== "Checked Out");
    },
  });

  // Get available rooms
  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ["all-rooms"],
    queryFn: async () => {
      const res = await axiosInstance.get("/rooms", {
        params: { hotelEmail: user.email },
      });
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
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <div className="flex justify-between gap-3 mb-2">
          <div className="flex flex-row gap-4 items-center">
            <MdSwapHoriz className="bg-rose-900 h-10 w-10 text-white p-2 rounded-full" />

            <h1 className="text-lg font-bold text-rose-900">Change Room</h1>
          </div>

          <Link to="/dashboard/rooms">
            <button className="flex items-center justify-center w-11 h-11 border border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white rounded-lg transition-colors">
              <RiHome3Line className="text-xl" />
            </button>
          </Link>
        </div>

        <p className="text-gray-500 mt-2">
          Transfer a guest from one room to another.
        </p>
      </div>

      {/* ================================================= */}
      {/* SECTION 1 - CURRENT GUEST / OLD ROOM */}
      {/* ================================================= */}

      <div className="card shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title text-xl text-rose-900 mb-5">
            Current Stay Information
          </h2>

          {/* Select Guest */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Select Current Guest
              </span>
            </label>

            <select
              value={selectedCheckInId}
              onChange={(e) => {
                setSelectedCheckInId(e.target.value);
                setDaysStayed(0);
                setNewRoomNumber("");
              }}
              className="select select-bordered w-full bg-white"
            >
              <option value="">Select Guest / Current Room</option>

              {checkInsLoading ? (
                <option disabled>Loading...</option>
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

          {/* Current Room Details */}
          {selectedCheckIn && (
            <div className="mt-6">
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
                <h3 className="font-bold text-rose-900 mb-4">
                  Current Room Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div>
                    <p className="text-sm text-gray-500">Guest</p>
                    <p className="font-semibold">{selectedCheckIn.guestName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Current Room</p>
                    <p className="font-semibold">
                      {selectedCheckIn.roomNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Room Variant</p>
                    <p className="font-semibold">
                      {selectedCheckIn.roomVariantName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Price / Night</p>
                    <p className="font-semibold">
                      ৳{selectedCheckIn.pricePerNight}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Check-In Date</p>
                    <p className="font-semibold">
                      {selectedCheckIn.checkInDate}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Total Nights</p>
                    <p className="font-semibold">
                      {selectedCheckIn.numberOfNights}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Guest Phone</p>
                    <p className="font-semibold">
                      {selectedCheckIn.phoneNumber || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-semibold text-rose-900">
                      {selectedCheckIn.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* SECTION 2 - ROOM TRANSFER */}
      {/* ================================================= */}

      <div className="card shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl text-rose-900 mb-6">
            Room Transfer Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ================= DAYS STAYED ================= */}
            {selectedCheckIn && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Days Already Stayed
                  </span>
                </label>

                <input
                  type="number"
                  min="0"
                  value={daysStayed || calculateDaysStayed()}
                  onChange={(e) => setDaysStayed(Number(e.target.value))}
                  className="input input-bordered w-full bg-white"
                />

                <p className="text-xs text-gray-500 mt-1">
                  Auto calculated: {calculateDaysStayed()} days
                </p>
              </div>
            )}

            {/* ================= NEW ROOM ================= */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Select New Room
                </span>
              </label>

              <select
                value={newRoomNumber}
                onChange={(e) => setNewRoomNumber(e.target.value)}
                className="select select-bordered w-full bg-white"
                disabled={!selectedCheckInId}
              >
                <option value="">Select New Room</option>

                {roomsLoading ? (
                  <option disabled>Loading...</option>
                ) : (
                  rooms
                    .filter(
                      (room) => room.roomNo !== selectedCheckIn?.roomNumber,
                    )
                    .map((room) => (
                      <option key={room._id} value={room.roomNo}>
                        Room {room.roomNo} — {room.variantName} (৳{room.price}
                        /night)
                      </option>
                    ))
                )}
              </select>
            </div>
          </div>

          {/* ================================================= */}
          {/* NEW ROOM INFORMATION */}
          {/* ================================================= */}

          {selectedNewRoom && (
            <div className="mt-8 bg-rose-50 border border-rose-200 rounded-xl p-5">
              <h3 className="font-bold text-rose-900 mb-4">
                New Room Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <p className="text-sm text-gray-500">Room Number</p>
                  <p className="font-semibold">{selectedNewRoom.roomNo}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Room Variant</p>
                  <p className="font-semibold">{selectedNewRoom.variantName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Price / Night</p>
                  <p className="font-semibold">৳{selectedNewRoom.price}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-semibold text-green-700">Available</p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* TRANSFER SUMMARY */}
          {/* ================================================= */}

          {selectedCheckIn && newRoomNumber && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-rose-900 mb-4">
                Transfer Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-xl p-5">
                  <p className="text-sm text-gray-500">
                    Days Stayed in Old Room
                  </p>

                  <p className="text-2xl font-bold mt-1">
                    {daysStayed || calculateDaysStayed()} days
                  </p>
                </div>

                <div className="border rounded-xl p-5">
                  <p className="text-sm text-gray-500">
                    Cost So Far (Old Room)
                  </p>

                  <p className="text-2xl font-bold text-rose-900 mt-1">
                    ৳
                    {(daysStayed || calculateDaysStayed()) *
                      selectedCheckIn.pricePerNight}
                  </p>
                </div>

                <div className="border rounded-xl p-5">
                  <p className="text-sm text-gray-500">New Room Price</p>

                  <p className="text-2xl font-bold mt-1">
                    ৳{selectedNewRoom?.price} / night
                  </p>
                </div>

                <div className="border rounded-xl p-5">
                  <p className="text-sm text-gray-500">Remaining Nights</p>

                  <p className="text-2xl font-bold mt-1">
                    {selectedCheckIn.numberOfNights -
                      (daysStayed || calculateDaysStayed())}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* BUTTONS */}
          {/* ================================================= */}

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() => {
                setSelectedCheckInId("");
                setNewRoomNumber("");
                setDaysStayed(0);
              }}
              className="btn btn-outline"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleTransfer}
              disabled={!selectedCheckInId || !newRoomNumber}
              className="btn bg-rose-900 hover:bg-rose-900 text-white border-none"
            >
              <MdSwapHoriz className="text-xl" />
              Transfer Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeRoom;
