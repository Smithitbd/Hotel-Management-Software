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

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoPreview(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      // 1. Create Firebase user
      const userCredential = await createUser(data.email, data.password);

      // 2. Update Firebase profile
      await updateUserProfile({
        displayName: data.ownerName,
      });

      // 3. Prepare FormData for /hotels
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

      // 4. Send to /hotels
      const res = await axiosInstance.post("/hotels", formData);

      // 5. Send to users
      const res2 = await axiosInstance.post("/users", {
        hotelName: data.hotelName,
        hotelEmail: data.email,
        email1: "", // you can change this if needed
        email2: "", // optional second email
        status: "Pending",
      });

      // 6. Check both responses
      if (
        (res.data.insertedId || res.status === 201) &&
        (res2.data.insertedId || res2.status === 201)
      ) {
        await Swal.fire({
          title: "Account Created!",
          text: "Your hotel account has been successfully created.",
          icon: "success",
          confirmButtonColor: "#92400e",
        });

        reset();
        setLogoPreview(null);
      }
    } catch (error) {
      console.error(error);

      let message = "Something went wrong. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        message = "This email is already registered.";
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      Swal.fire({
        title: "Failed",
        text: message,
        icon: "error",
        confirmButtonColor: "#92400e",
      });
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-800">
          Create an Account
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Register your hotel / property
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* ====================== Hotel / Property Details ====================== */}
        <div>
          <h2 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-3 border-b border-amber-100 pb-1.5">
            Hotel / Property Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Hotel Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hotel / Property Name
              </label>
              <input
                {...register("hotelName", {
                  required: "Hotel / Property name is required",
                })}
                type="text"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
                placeholder="e.g. Grand Palace Hotel"
              />
              {errors.hotelName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.hotelName.message}
                </p>
              )}
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                {...register("propertyType", {
                  required: "Property type is required",
                })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 bg-white"
                defaultValue=""
              >
                <option value="" disabled>
                  Select property type
                </option>
                <option value="Hotel">Hotel</option>
                <option value="Motel">Motel</option>
                <option value="Resort">Resort</option>
                <option value="Guest House">Guest House</option>
                <option value="Boutique Hotel">Boutique Hotel</option>
                <option value="Apartment Hotel">Apartment Hotel</option>
                <option value="Hostel">Hostel</option>
                <option value="Villa">Villa</option>
                <option value="Homestay">Homestay</option>
                <option value="Other">Other</option>
              </select>
              {errors.propertyType && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.propertyType.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                {...register("address", {
                  required: "Address is required",
                })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 resize-none"
                placeholder="Full address of the property"
                rows={2}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Hotel Logo */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hotel Logo
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("logo", {
                  required: "Hotel logo is required",
                })}
                onChange={handleLogoChange}
                className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-800 hover:file:bg-amber-100 border border-gray-300 rounded-lg cursor-pointer"
              />
              {errors.logo && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.logo.message}
                </p>
              )}

              {logoPreview && (
                <div className="mt-2">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-20 h-20 object-contain rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ====================== Contact Information ====================== */}
        <div>
          <h2 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-3 border-b border-amber-100 pb-1.5">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Owner Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Owner / Manager Name
              </label>
              <input
                {...register("ownerName", {
                  required: "Owner / Manager name is required",
                })}
                type="text"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
                placeholder="Full name"
              />
              {errors.ownerName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.ownerName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Email
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
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                {...register("phone", {
                  required: "Phone number is required",
                })}
                type="tel"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
                placeholder="+8801XXXXXXXXX"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
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
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Processing...
            </>
          ) : (
            "SEND SIGN UP REQUEST"
          )}
        </button>
      </form>

      {/* Footer Link */}
      <p className="text-center text-sm text-gray-600 mt-5">
        Already have an account?{" "}
        <Link to="/" className="text-amber-800 font-semibold hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;
