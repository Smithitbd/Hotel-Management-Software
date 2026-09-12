import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

const Signup = () => {
  const axiosInstance = useAxios();
  const [logoPreview, setLogoPreview] = useState(null);
  const { createUser, updateUserProfile } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoPreview(null);
    }
  };

  const onSubmit = async (data) => {
    createUser(data.email, data.password).then(async (result) => {
      console.log(result.user);

      // const update user info
      const userProfile = {
        displayName: data.ownerName,
        photoURL: data.logo[0],
      };
    });

    const formData = new FormData();
    formData.append("hotelName", data.hotelName);
    formData.append("propertyType", data.propertyType);
    formData.append("address", data.address);
    formData.append("ownerName", data.ownerName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("password", data.password);

    if (data.logo?.[0]) {
      formData.append("logo", data.logo[0]);
    }

    const res = await axiosInstance.post("/hotels", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.insertedId || res.status === 201 || res.status === 200) {
      Swal.fire({
        title: "Account Created!",
        text: "Your hotel account has been successfully created.",
        icon: "success",
        confirmButtonColor: "#92400e",
      });
      reset();
      setLogoPreview(null);
    }
  };

  return (
    <div className="card w-full shadow-xl bg-white">
      <h1 className="text-3xl font-bold text-amber-800 text-center pt-1">
        Create an Account
      </h1>
      <p className="text-center text-gray-500 mt-1 mb-2">
        Register your hotel / property
      </p>

      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ====================== Hotel / Property Details ====================== */}
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-amber-800 mb-3 border-b border-amber-200 pb-1">
              Hotel / Property Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hotel / Property Name */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Hotel / Property Name
                  </span>
                </label>
                <input
                  {...register("hotelName", {
                    required: "Hotel / Property name is required",
                  })}
                  type="text"
                  className="input input-bordered w-full bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
                  placeholder="e.g. Grand Palace Hotel"
                />
                {errors.hotelName && (
                  <p className="text-error text-sm mt-1">
                    {errors.hotelName.message}
                  </p>
                )}
              </div>

              {/* Property Type */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Property Type</span>
                </label>
                <input
                  {...register("propertyType", {
                    required: "Property type is required",
                  })}
                  type="text"
                  className="input input-bordered w-full bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
                  placeholder="e.g. Hotel, Resort, Guest House..."
                />
                {errors.propertyType && (
                  <p className="text-error text-sm mt-1">
                    {errors.propertyType.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text font-medium">Address</span>
                </label>
                <textarea
                  {...register("address", {
                    required: "Address is required",
                  })}
                  className="textarea textarea-bordered w-full bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
                  placeholder="Full address of the property"
                  rows={3}
                ></textarea>
                {errors.address && (
                  <p className="text-error text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Hotel Logo */}
              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text font-medium">Hotel Logo</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("logo", {
                    required: "Hotel logo is required",
                  })}
                  onChange={handleLogoChange}
                  className="file-input file-input-bordered w-full bg-white focus:outline-none focus:ring-0"
                />
                {errors.logo && (
                  <p className="text-error text-sm mt-1">
                    {errors.logo.message}
                  </p>
                )}

                {logoPreview && (
                  <div className="mt-3">
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      className="w-24 h-24 object-contain rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ====================== Contact Information ====================== */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-amber-800 mb-3 border-b border-amber-200 pb-1">
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Owner/Manager Name */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Owner / Manager Name
                  </span>
                </label>
                <input
                  {...register("ownerName", {
                    required: "Owner / Manager name is required",
                  })}
                  type="text"
                  className="input input-bordered w-full bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
                  placeholder="Full name"
                />
                {errors.ownerName && (
                  <p className="text-error text-sm mt-1">
                    {errors.ownerName.message}
                  </p>
                )}
              </div>

              {/* Business Email */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Business Email</span>
                </label>
                <input
                  {...register("email", {
                    required: "Business email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email",
                    },
                  })}
                  type="email"
                  className="input input-bordered w-full bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="text-error text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Phone Number</span>
                </label>
                <input
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  type="tel"
                  className="input input-bordered w-full bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
                  placeholder="+8801XXXXXXXXX"
                />
                {errors.phone && (
                  <p className="text-error text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type="password"
                  className="input input-bordered w-full bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="text-error text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn bg-amber-800 text-white border-none w-full mt-2 hover:bg-amber-900"
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "SEND SIGN UP REQUEST"
            )}
          </button>
        </form>

        <p className="text-center mt-5">
          Already have an account?{" "}
          <Link to="/" className="text-amber-800 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
