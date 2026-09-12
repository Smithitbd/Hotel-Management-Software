import { useForm } from "react-hook-form";
import useAxios from "../../../../hooks/useAxios";
import Swal from "sweetalert2";
import { Link } from "react-router";
import { RiHome3Line } from "react-icons/ri";
import { FaUserPlus } from "react-icons/fa";
import { useState } from "react";

const AddEmployee = () => {
  const axiosInstance = useAxios();
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("FullName", data.FullName);
      formData.append("EmployeeID", data.EmployeeID);
      formData.append("Email", data.Email);
      formData.append("Phone", data.Phone);
      formData.append("NID", data.NID);
      formData.append("Gender", data.Gender);
      formData.append("Department", data.Department);
      formData.append("Designation", data.Designation);
      formData.append("JoiningDate", data.JoiningDate);
      formData.append("EmploymentStatus", data.EmploymentStatus);
      formData.append("Address", data.Address);

      if (data.Image?.[0]) {
        formData.append("image", data.Image[0]);
      }

      const res = await axiosInstance.post("/employees", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.insertedId || res.status === 201) {
        Swal.fire({
          title: "Employee Added!",
          text: "The employee has been successfully added.",
          icon: "success",
          confirmButtonColor: "#BF1E2E",
        });

        reset();
        setImagePreview(null);
      }
    } catch (error) {
      console.error(error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add employee. Please try again.";

      Swal.fire({
        title: "Error!",
        text: message,
        icon: "error",
        confirmButtonColor: "#BF1E2E",
      });
    }
  };

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <FaUserPlus className="text-xl text-white" />
            </div>
            <h1 className="text-lg font-bold text-rose-700">Add Employee</h1>
          </div>
          <p className="text-gray-500 ml-12">
            Add a new employee to the hotel management system.
          </p>
        </div>

        <Link to="/dashboard/employees">
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
          >
            <RiHome3Line className="text-xl" />
          </button>
        </Link>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-2xl p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Full Name</span>
            </label>
            <input
              {...register("FullName", { required: "Full name is required" })}
              type="text"
              placeholder="John Doe"
              className="input input-bordered w-full bg-white"
            />
            {errors.FullName && (
              <p className="text-error text-sm mt-1">
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
              placeholder="EMP-1001"
              className="input input-bordered w-full bg-white"
            />
            {errors.EmployeeID && (
              <p className="text-error text-sm mt-1">
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
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email",
                },
              })}
              type="email"
              placeholder="employee@email.com"
              className="input input-bordered w-full bg-white"
            />
            {errors.Email && (
              <p className="text-error text-sm mt-1">{errors.Email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Phone Number</span>
            </label>
            <input
              {...register("Phone", { required: "Phone number is required" })}
              type="tel"
              placeholder="+880 1234 567890"
              className="input input-bordered w-full bg-white"
            />
            {errors.Phone && (
              <p className="text-error text-sm mt-1">{errors.Phone.message}</p>
            )}
          </div>

          {/* NID */}
          <div>
            <label className="label">
              <span className="label-text font-medium">NID Number</span>
            </label>
            <input
              {...register("NID", { required: "NID number is required" })}
              type="text"
              placeholder="Enter NID Number"
              className="input input-bordered w-full bg-white"
            />
            {errors.NID && (
              <p className="text-error text-sm mt-1">{errors.NID.message}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Gender</span>
            </label>
            <select
              {...register("Gender", { required: "Gender is required" })}
              className="select select-bordered w-full bg-white"
              defaultValue=""
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.Gender && (
              <p className="text-error text-sm mt-1">{errors.Gender.message}</p>
            )}
          </div>

          {/* Department - Simple Input */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Department</span>
            </label>
            <input
              {...register("Department", {
                required: "Department is required",
              })}
              type="text"
              placeholder="e.g. Accounts, Housekeeping, Front Desk"
              className="input input-bordered w-full bg-white"
            />
            {errors.Department && (
              <p className="text-error text-sm mt-1">
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
              placeholder="Receptionist"
              className="input input-bordered w-full bg-white"
            />
            {errors.Designation && (
              <p className="text-error text-sm mt-1">
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
              {...register("JoiningDate", {
                required: "Joining date is required",
              })}
              type="date"
              className="input input-bordered w-full bg-white"
            />
            {errors.JoiningDate && (
              <p className="text-error text-sm mt-1">
                {errors.JoiningDate.message}
              </p>
            )}
          </div>

          {/* Employment Status */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Employment Status</span>
            </label>
            <select
              {...register("EmploymentStatus", {
                required: "Employment status is required",
              })}
              className="select select-bordered w-full bg-white"
              defaultValue=""
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Resigned">Resigned</option>
              <option value="Terminated">Terminated</option>
            </select>
            {errors.EmploymentStatus && (
              <p className="text-error text-sm mt-1">
                {errors.EmploymentStatus.message}
              </p>
            )}
          </div>

          {/* Profile Photo (File Upload) */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Profile Photo</span>
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("Image", {
                required: "Profile photo is required",
              })}
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full bg-white"
            />
            {errors.Image && (
              <p className="text-error text-sm mt-1">{errors.Image.message}</p>
            )}

            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="mt-6">
          <label className="label">
            <span className="label-text font-medium">Address</span>
          </label>
          <textarea
            {...register("Address", { required: "Address is required" })}
            className="textarea textarea-bordered w-full h-28 bg-white"
            placeholder="Enter employee address..."
          ></textarea>
          {errors.Address && (
            <p className="text-error text-sm mt-1">{errors.Address.message}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => {
              reset();
              setImagePreview(null);
            }}
            className="btn btn-outline border-[#BF1E2E] text-[#BF1E2E] hover:bg-[#BF1E2E] hover:text-white"
          >
            Reset
          </button>

          <button
            type="submit"
            className="btn bg-[#BF1E2E] text-white hover:bg-red-800 border-none px-8"
          >
            Add Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
