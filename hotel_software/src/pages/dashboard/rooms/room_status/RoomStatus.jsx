import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { GiMushroomHouse } from "react-icons/gi";
import { RiHome3Line } from "react-icons/ri";
import { FaLayerGroup, FaPlus } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import useAxios from "../../../../hooks/useAxios";

const RoomStatus = () => {
  const axiosInstance = useAxios();

  const { data: variants = [], isLoading } = useQuery({
    queryKey: ["room-variants"],
    queryFn: async () => {
      const res = await axiosInstance.get("/room-variants");
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <GiMushroomHouse className="text-2xl text-white" />
            </div>

            <h1 className="text-lg font-bold text-rose-700">Room Status</h1>
          </div>

          <p className="text-gray-500 ml-9">
            View and manage all hotel room variants and their details.
          </p>
        </div>

        {/* Header Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard/rooms">
            <button className="flex items-center justify-center w-11 h-11 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors">
              <RiHome3Line className="text-xl" />
            </button>
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {variants.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <FaLayerGroup className="text-2xl text-rose-400" />
          </div>

          <h2 className="text-xl font-bold text-rose-400 mb-2">
            No Room Variants
          </h2>

          <p className="text-gray-500 mb-6">
            No room variants have been added yet.
          </p>

          <Link to="/dashboard/rooms/add_room_variant">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors">
              <FaPlus />
              Add Room Variant
            </button>
          </Link>
        </div>
      ) : (
        /* Room Cards */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {variants.map((item) => (
            <div
              key={item._id}
              className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-rose-700"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                {item.image ? (
                  <figure className="w-full sm:w-44 sm:min-w-44 h-56 sm:h-auto bg-gray-100">
                    <img
                      src={`${axiosInstance.defaults.baseURL}${item.image}`}
                      alt={item.variantName}
                      className="h-full w-full object-cover"
                    />
                  </figure>
                ) : (
                  <figure className="w-full sm:w-44 sm:min-w-44 h-56 sm:h-auto flex items-center justify-center bg-red-50">
                    <FaLayerGroup className="text-4xl text-rose-300" />
                  </figure>
                )}

                {/* Content */}
                <div className="p-6 flex-1">
                  {/* Title + Price */}
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <h2 className="text-lg font-bold text-rose-700">
                      {item.variantName || "Unnamed Variant"}
                    </h2>

                    <span className="px-3 py-1 bg-red-100 text-rose-700 rounded-full text-sm font-semibold whitespace-nowrap">
                      ${item.price || 0}
                    </span>
                  </div>

                  {/* Room Information */}
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Type:</span>{" "}
                      <span className="font-medium text-gray-800">
                        {item.baseRoomType || "-"}
                      </span>
                    </p>

                    <p>
                      <span className="text-gray-500">Occupancy:</span>{" "}
                      <span className="font-medium text-gray-800">
                        {item.maxOccupancy || "-"}
                      </span>
                    </p>

                    <p>
                      <span className="text-gray-500">Bed:</span>{" "}
                      <span className="font-medium text-gray-800">
                        {item.bedType || "-"}
                      </span>
                    </p>

                    {item.amenities && (
                      <p>
                        <span className="text-gray-500">Amenities:</span>{" "}
                        <span className="font-medium text-gray-800">
                          {item.amenities}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-nowrap justify-end items-center gap-2 mt-6 pt-4 border-t border-gray-100">
                    {/* View Rooms */}
                    <Link to={`/dashboard/rooms/view_rooms/${item._id}`}>
                      <button className="btn btn-sm h-10 border border-rose-700 text-rose-700 bg-transparent hover:bg-rose-700 hover:text-white gap-1.5">
                        <FaEye className="text-base" />
                        View Rooms
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomStatus;
