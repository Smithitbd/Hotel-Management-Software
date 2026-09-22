import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { FaArrowLeft, FaUserPlus } from "react-icons/fa";
import { MdHotel } from "react-icons/md";
import useAuth from "../../../../hooks/useAuth";
import useAxios from "../../../../hooks/useAxios";
import { RiHome3Line } from "react-icons/ri";

const SubUser = () => {
  const { user, createUser } = useAuth();
  const axiosInstance = useAxios();

  // Get hotel info
  const { data: hotel, isLoading: hotelLoading } = useQuery({
    queryKey: ["hotel-by-email", user?.email],
    queryFn: async () => {
      const res = await axiosInstance.get("/hotels/by-email", {
        params: { email: user.email },
      });
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Get existing sub users
  const {
    data: subUsers,
    isLoading: subUsersLoading,
    refetch,
  } = useQuery({
    queryKey: ["sub-users", user?.email],
    queryFn: async () => {
      const res = await axiosInstance.get("/users", {
        params: { hotelEmail: user.email },
      });
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Form for Email 1 (no auto-fill)
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    reset: reset1,
    formState: { isSubmitting: isSubmitting1 },
  } = useForm();

  // Form for Email 2 (no auto-fill)
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    formState: { isSubmitting: isSubmitting2 },
  } = useForm();

  // ========== Submit Email 1 ==========
  const onSubmitEmail1 = async (data) => {
    try {
      // Create Firebase user
      await createUser(data.email1, data.password1);

      // Update in database
      await axiosInstance.patch(`/users/${subUsers._id}`, {
        email1: data.email1,
        password1: data.password1,
      });

      await refetch();
      reset1();

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Sub User 1 created successfully",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      let message = "Something went wrong";
      if (error.code === "auth/email-already-in-use") {
        message = "This email is already registered";
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: message,
      });
    }
  };

  // ========== Submit Email 2 ==========
  const onSubmitEmail2 = async (data) => {
    try {
      // Create Firebase user
      await createUser(data.email2, data.password2);

      // Update in database
      await axiosInstance.patch(`/users/${subUsers._id}`, {
        email2: data.email2,
        password2: data.password2,
      });

      await refetch();
      reset2();

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Sub User 2 created successfully",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      let message = "Something went wrong";
      if (error.code === "auth/email-already-in-use") {
        message = "This email is already registered";
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: message,
      });
    }
  };

  if (hotelLoading || subUsersLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-rose-900"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-900 flex items-center justify-center">
            <FaUserPlus className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-rose-900">Sub Users</h1>
            <p className="text-sm text-gray-500">
              Manage additional login emails for {hotel?.hotelName}
            </p>
          </div>
        </div>

        <Link to="/dashboard/settings">
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 border border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white rounded-lg transition-colors"
          >
            <RiHome3Line className="text-xl" />
          </button>
        </Link>
      </div>

      {/* Hotel Summary */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
            <MdHotel className="text-2xl text-rose-900" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">{hotel?.hotelName}</h2>
            <p className="text-sm text-gray-500">{hotel?.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ========== Sub User 1 ========== */}
        <form
          onSubmit={handleSubmit1(onSubmitEmail1)}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
        >
          <h3 className="text-lg font-bold text-rose-900 mb-6">Sub User 1</h3>

          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email 1</span>
              </label>
              <input
                type="email"
                placeholder="user1@example.com"
                className="input input-bordered w-full bg-white"
                {...register1("email1", { required: true })}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password 1</span>
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="input input-bordered w-full bg-white"
                {...register1("password1", { required: true })}
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={isSubmitting1}
              className="btn bg-rose-900 hover:bg-[#BF1E2E] text-white border-none"
            >
              {isSubmitting1 ? "Saving..." : "Save User 1"}
            </button>
          </div>
        </form>

        {/* ========== Sub User 2 ========== */}
        <form
          onSubmit={handleSubmit2(onSubmitEmail2)}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
        >
          <h3 className="text-lg font-bold text-rose-900 mb-6">Sub User 2</h3>

          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email 2</span>
              </label>
              <input
                type="email"
                placeholder="user2@example.com"
                className="input input-bordered w-full bg-white"
                {...register2("email2", { required: true })}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password 2</span>
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="input input-bordered w-full bg-white"
                {...register2("password2", { required: true })}
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={isSubmitting2}
              className="btn bg-rose-900 hover:bg-[#BF1E2E] text-white border-none"
            >
              {isSubmitting2 ? "Saving..." : "Save User 2"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubUser;
