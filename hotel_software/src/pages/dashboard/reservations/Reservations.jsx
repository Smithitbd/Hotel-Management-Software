import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { LuBookImage } from "react-icons/lu";
import { MdWorkHistory } from "react-icons/md";
import { Link } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../../hooks/useAxios";

const Reservations = () => {
  const axiosInstance = useAxios();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      month: new Date().toISOString().slice(0, 7),
      guestName: "",
      contactNumber: "",
      arrivingDate: "",
      departureDate: "",
    },
  });

  const selectedMonth = watch("month");
  const guestName = watch("guestName");
  const contactNumber = watch("contactNumber");
  const arrivingDate = watch("arrivingDate");
  const departureDate = watch("departureDate");

  const [year, month] = (selectedMonth || "").split("-").map(Number);
  const daysInMonth = year && month ? new Date(year, month, 0).getDate() : 0;

  const isInRange = (day) => {
    if (!arrivingDate || !departureDate) return false;
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;
    return dateStr >= arrivingDate && dateStr < departureDate;
  };

  const {
    data: availability,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["available-rooms", arrivingDate, departureDate],
    queryFn: async () => {
      const res = await axiosInstance.get("/rooms/available", {
        params: {
          arriving: arrivingDate,
          departure: departureDate,
        },
      });
      return res.data;
    },
    enabled: false,
  });

  const onFindRooms = () => {
    if (!arrivingDate || !departureDate) return;

    if (departureDate <= arrivingDate) {
      Swal.fire({
        title: "Invalid dates",
        text: "Departure date must be after arriving date.",
        icon: "warning",
        confirmButtonColor: "#BF1E2E",
      });
      return;
    }

    refetch();
  };

  const handleReserve = async (room, variant) => {
    if (!guestName || !contactNumber || !arrivingDate || !departureDate) {
      Swal.fire({
        title: "Missing info",
        text: "Please fill guest name, contact, and dates first.",
        icon: "warning",
        confirmButtonColor: "#BF1E2E",
      });
      return;
    }

    const reservationData = {
      guestName,
      contactNumber,
      arrivingDate,
      departureDate,
      room: {
        _id: room._id,
        variantId: room.variantId || "",
        variantName: room.variantName || variant.variantName || "",
        baseRoomType: room.baseRoomType || variant.baseRoomType || "",
        price: room.price ?? variant.price ?? 0,
        maxOccupancy: room.maxOccupancy ?? variant.maxOccupancy ?? 0,
        bedType: room.bedType || variant.bedType || "",
        amenities: room.amenities || variant.amenities || "",
        description: room.description || "",
        image: room.image || variant.image || "",
        roomStatus: room.roomStatus || "Available",
        roomNo: room.roomNo,
        assignedPerson: room.assignedPerson || "",
        assignedPersonNumber: room.assignedPersonNumber || "",
        maintenanceCost: room.maintenanceCost ?? null,
        correctives: room.correctives || "",
        workBegins: room.workBegins || "",
        workEnds: room.workEnds || "",
      },
      status: "Reserved",
    };

    const res = await axiosInstance.post("/reservations", reservationData);

    if (res.data.insertedId) {
      Swal.fire({
        title: "Success!",
        text: `Room ${room.roomNo} reserved for ${guestName}.`,
        icon: "success",
        confirmButtonColor: "#BF1E2E",
      });
      refetch();
    }
  };

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <LuBookImage className="text-xl text-white" />
            </div>
            <h1 className="text-lg font-bold text-rose-700">Reservations</h1>
          </div>
          <p className="text-gray-500 ml-12">
            Enter guest details and dates to find available rooms.
          </p>
        </div>

        {/* History button */}
        <div className="flex flex-row gap-3">
          <Link to="/dashboard/reservations/reservation_history">
            <button
              type="button"
              className="flex items-center justify-center w-9 h-9 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
            >
              <MdWorkHistory className="text-xl" />
            </button>
          </Link>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onFindRooms)}
        className="bg-white shadow-lg rounded-2xl p-8 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">
              <span className="label-text font-medium">Guest Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter guest name"
              {...register("guestName", { required: "Name is required" })}
              className="input input-bordered w-full bg-white"
            />
            {errors.guestName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.guestName.message}
              </p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Contact Number</span>
            </label>
            <input
              type="tel"
              placeholder="Enter contact number"
              {...register("contactNumber", {
                required: "Contact number is required",
              })}
              className="input input-bordered w-full bg-white"
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contactNumber.message}
              </p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Month</span>
            </label>
            <input
              type="month"
              {...register("month")}
              className="input input-bordered w-full bg-white"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Arriving Date</span>
            </label>
            <input
              type="date"
              {...register("arrivingDate", {
                required: "Arriving date is required",
              })}
              className="input input-bordered w-full bg-white"
            />
            {errors.arrivingDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.arrivingDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Departure Date</span>
            </label>
            <input
              type="date"
              {...register("departureDate", {
                required: "Departure date is required",
              })}
              className="input input-bordered w-full bg-white"
            />
            {errors.departureDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.departureDate.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="reset"
            className="btn btn-outline border-[#BF1E2E] text-[#BF1E2E] hover:bg-[#BF1E2E] hover:text-white"
          >
            Reset
          </button>
          <button
            type="submit"
            className="btn bg-[#BF1E2E] text-white hover:bg-red-800 border-none px-8"
          >
            Find Available Rooms
          </button>
        </div>
      </form>

      {/* Legend */}
      <div className="flex gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-green-500"></span>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-blue-500"></span>
          <span>Selected range</span>
        </div>
      </div>

      {/* Day boxes */}
      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-3 mb-10">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const selected = isInRange(day);

          return (
            <div
              key={day}
              className={`
                aspect-square rounded-xl flex flex-col items-center justify-center
                font-bold text-white shadow-sm
                ${selected ? "bg-blue-500" : "bg-green-500"}
              `}
            >
              <span className="text-lg">{day}</span>
            </div>
          );
        })}
      </div>

      {/* Available rooms */}
      <h2 className="text-base font-semibold text-rose-700 mb-4">
        Available Rooms
      </h2>

      {!availability && !isLoading && !isFetching ? (
        <p className="text-gray-500">
          Fill the form and click &quot;Find Available Rooms&quot;.
        </p>
      ) : isLoading || isFetching ? (
        <p className="text-gray-500">Checking availability...</p>
      ) : !availability?.variants?.length ? (
        <p className="text-gray-500">
          No rooms available for {arrivingDate} → {departureDate}.
        </p>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            {availability.totalAvailable} room(s) available from{" "}
            <span className="font-medium">{arrivingDate}</span> to{" "}
            <span className="font-medium">{departureDate}</span>
            {guestName ? (
              <>
                {" "}
                for <span className="font-medium">{guestName}</span>
              </>
            ) : null}
          </p>

          {availability.variants.map((variant) => (
            <div
              key={variant.variantName}
              className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-rose-700">
                    {variant.variantName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {variant.baseRoomType} • {variant.bedType} • Max{" "}
                    {variant.maxOccupancy} guests
                  </p>
                  <p className="text-sm text-gray-500">{variant.amenities}</p>
                </div>
                <p className="text-xl font-bold text-rose-700">
                  ৳{Number(variant.price || 0).toLocaleString()}
                  <span className="text-sm font-normal text-gray-500">
                    {" "}
                    / night
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {variant.rooms.map((room) => (
                  <div
                    key={room._id}
                    className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2"
                  >
                    <span className="font-semibold text-rose-800">
                      Room {room.roomNo}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleReserve(room, variant)}
                      className="btn btn-sm bg-[#BF1E2E] text-white hover:bg-red-800 border-none"
                    >
                      Reserve Room
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;
