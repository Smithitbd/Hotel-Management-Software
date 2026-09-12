import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxios from "../../../../hooks/useAxios";
import Swal from "sweetalert2";
import { FaUserEdit } from "react-icons/fa";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const EditEmployee = () => {
  const axiosInstance = useAxios();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: employee,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/employees/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    values: employee,
  });

  const onSubmit = async (data) => {
    try {
      const { _id, ...updateData } = data;

      await axiosInstance.patch(`/employees/${id}`, updateData);

      Swal.fire({
        title: "Updated Successfully!",
        icon: "success",
        confirmButtonColor: "#be123c",
      });
      navigate("/dashboard/employees/current_employees");
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Update Failed",
        text: err?.response?.data?.message || "Something went wrong",
        icon: "error",
        confirmButtonColor: "#be123c",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-rose-700"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="alert alert-error shadow-lg">
          <span>{error?.message || "Failed to load employee"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-rose-700 flex items-center justify-center shadow-md">
              <FaUserEdit className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-rose-700">Edit Employee</h1>
              <p className="text-sm text-gray-500">
                Update employee information
              </p>
            </div>
          </div>
        </div>

        <Link to="/dashboard/employees">
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
            title="Back to Employees"
          >
            <IoArrowBackCircleSharp className="text-xl" />
          </button>
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Card Header */}
        <div className="bg-rose-700 text-white px-6 py-4">
          <h2 className="text-lg font-bold">Employee Details</h2>
          <p className="text-sm text-rose-100">
            {employee?.FullName || "Loading..."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <input
                {...register("FullName", {
                  required: "Full name is required",
                })}
                type="text"
                className="input input-bordered w-full bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
              />
              {errors.FullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.FullName.message}
                </p>
              )}
            </div>

            {/* Employee ID */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Employee ID</span>
              </label>
              <input
                {...register("EmployeeID", {
                  required: "Employee ID is required",
                })}
                type="text"
                className="input input-bordered w-full bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
              />
              {errors.EmployeeID && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.EmployeeID.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                {...register("Email", {
                  required: "Email is required",
                })}
                type="email"
                className="input input-bordered w-full bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
              />
              {errors.Email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Phone Number</span>
              </label>
              <input
                {...register("Phone", {
                  required: "Phone number is required",
                })}
                type="tel"
                className="input input-bordered w-full bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
              />
              {errors.Phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Phone.message}
                </p>
              )}
            </div>

            {/* NID */}
            <div>
              <label className="label">
                <span className="label-text font-medium">NID Number</span>
              </label>
              <input
                {...register("NID", {
                  required: "NID number is required",
                })}
                type="text"
                className="input input-bordered w-full bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
              />
              {errors.NID && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.NID.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Gender</span>
              </label>
              <select
                {...register("Gender")}
                className="select select-bordered w-full bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Department - Simple editable input */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Department</span>
              </label>
              <input
                {...register("Department", {
                  required: "Department is required",
                })}
                type="text"
                className="input input-bordered w-full bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
                placeholder="e.g. Kitchen, Front Desk, Housekeeping..."
              />
              {errors.Department && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Department.message}
                </p>
              )}
            </div>

            {/* Designation */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Designation</span>
              </label>
              <input
                {...register("Designation", {
                  required: "Designation is required",
                })}
                type="text"
                className="input input-bordered w-full bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
              />
              {errors.Designation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Designation.message}
                </p>
              )}
            </div>

            {/* Joining Date */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Joining Date</span>
              </label>
              <input
                {...register("JoiningDate")}
                type="date"
                className="input input-bordered w-full bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
              />
            </div>

            {/* Employment Status */}
            <div>
              <label className="label">
                <span className="label-text font-medium">
                  Employment Status
                </span>
              </label>
              <select
                {...register("EmploymentStatus")}
                className="select select-bordered w-full bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Resigned">Resigned</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="mt-6">
            <label className="label">
              <span className="label-text font-medium">Address</span>
            </label>
            <textarea
              {...register("Address", {
                required: "Address is required",
              })}
              className="textarea textarea-bordered w-full h-28 bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
            />
            {errors.Address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.Address.message}
              </p>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn bg-rose-700 text-white hover:bg-rose-800 border-none px-8"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
