import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import Swal from "sweetalert2";
import {
  FaArrowLeft,
  FaLock,
  FaEnvelope,
  FaImage,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import useAuth from "../../../../hooks/useAuth";
import useAxios from "../../../../hooks/useAxios";
import useUserStatus from "../../../../hooks/useUserStatus"; // make sure this hook exists
import { RiHome3Line } from "react-icons/ri";

const Security = () => {
  const { user, updateUserPassword, updateUserEmail } = useAuth();
  const { type, hotelEmail } = useUserStatus(); // "owner" | "admin" | "sub-user"
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [selectedLogo, setSelectedLogo] = useState(null);

  // Get hotel data (only needed for owner/admin)
  const { data: hotel, isLoading: hotelLoading } = useQuery({
    queryKey: ["hotel-by-email", hotelEmail],
    queryFn: async () => {
      const res = await axiosInstance.get("/hotels/by-email", {
        params: { email: hotelEmail },
      });
      return res.data;
    },
    enabled: !!hotelEmail && (type === "owner" || type === "admin"),
  });

  // Get sub-user data (only needed for sub-user)
  const { data: subUser, isLoading: subUserLoading } = useQuery({
    queryKey: ["sub-user", user?.email],
    queryFn: async () => {
      const res = await axiosInstance.get("/users", {
        params: { hotelEmail },
      });
      return res.data;
    },
    enabled: !!hotelEmail && type === "sub-user",
  });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { isSubmitting: isPasswordSubmitting, errors: passwordErrors },
  } = useForm();

  // Email Form
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { isSubmitting: isEmailSubmitting },
  } = useForm({
    values: {
      email: user?.email || "",
    },
  });

  // ====================== UPDATE PASSWORD ======================
  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      return Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "New password and confirm password do not match",
      });
    }

    if (data.newPassword.length < 6) {
      return Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Password must be at least 6 characters",
      });
    }

    try {
      // Update Firebase password
      await updateUserPassword(data.newPassword);

      // Also update in database if needed
      if (type === "owner" || type === "admin") {
        await axiosInstance.patch(`/hotels/${hotel._id}`, {
          passwordUpdatedAt: new Date(),
        });
      } else if (type === "sub-user") {
        // Update password1 or password2
        const updateField =
          subUser.email1 === user.email
            ? { password1: data.newPassword }
            : { password2: data.newPassword };

        await axiosInstance.patch(`/users/${subUser._id}`, updateField);
      }

      resetPassword();

      Swal.fire({
        icon: "success",
        title: "Password Updated",
        text: "Your password has been changed successfully",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      let message = "Failed to update password";
      if (error.code === "auth/requires-recent-login") {
        message =
          "Please logout and login again, then try changing your password.";
      }

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: message,
      });
    }
  };

  // ====================== UPDATE EMAIL ======================
  const onEmailSubmit = async (data) => {
    if (data.email === user.email) {
      return Swal.fire({
        icon: "info",
        title: "No Change",
        text: "This is already your current email",
      });
    }

    try {
      // 1. Update email in Firebase
      await updateUserEmail(data.email);

      // 2. Update in MongoDB
      if (type === "owner" || type === "admin") {
        // Owner → update hotel email
        await axiosInstance.patch(`/hotels/${hotel._id}`, {
          email: data.email,
        });
      } else if (type === "sub-user") {
        // Sub-user → update email1 or email2 only
        const updateField =
          subUser.email1 === user.email
            ? { email1: data.email }
            : { email2: data.email };

        await axiosInstance.patch(`/users/${subUser._id}`, updateField);
      }

      await queryClient.invalidateQueries();

      Swal.fire({
        icon: "success",
        title: "Email Updated",
        text: "Your email has been updated successfully",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        // Force logout after email change is safer
        window.location.href = "/";
      });
    } catch (error) {
      console.error(error);

      let message = "Failed to update email";

      if (error.code === "auth/requires-recent-login") {
        message =
          "For security reasons, please logout and login again, then try updating your email.";
      } else if (error.code === "auth/email-already-in-use") {
        message = "This email is already used by another account.";
      } else if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      }

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: message,
      });
    }
  };

  // ====================== UPDATE LOGO (Owner only) ======================
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please select an image file",
      });
    }

    setSelectedLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleLogoUpload = async () => {
    if (!selectedLogo) {
      return Swal.fire({
        icon: "warning",
        title: "No Image",
        text: "Please select a logo first",
      });
    }

    try {
      const formData = new FormData();
      formData.append("logo", selectedLogo);

      await axiosInstance.patch(`/hotels/${hotel._id}/logo`, formData);

      await queryClient.invalidateQueries({ queryKey: ["hotel-by-email"] });
      setSelectedLogo(null);
      setLogoPreview(null);

      Swal.fire({
        icon: "success",
        title: "Logo Updated",
        text: "Hotel logo has been updated successfully",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: error.response?.data?.message || "Failed to update logo",
      });
    }
  };

  if (hotelLoading || subUserLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-rose-900"></span>
      </div>
    );
  }

  const currentLogoUrl = hotel?.logo
    ? `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${hotel.logo}`
    : null;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-900 flex items-center justify-center">
            <MdSecurity className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-rose-900">Security</h1>
            <p className="text-sm text-gray-500">
              Update password, email{" "}
              {type === "owner" || type === "admin" ? "& logo" : ""}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ====================== CHANGE PASSWORD ====================== */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <FaLock className="text-rose-900" />
            <h2 className="text-lg font-bold text-rose-900">Change Password</h2>
          </div>

          <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="space-y-4"
            autoComplete="off"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">New Password</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="input input-bordered w-full bg-white pr-10"
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  {...registerPassword("newPassword", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Confirm Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full bg-white"
                placeholder="Confirm new password"
                autoComplete="new-password"
                {...registerPassword("confirmPassword", {
                  required: "Please confirm password",
                })}
              />
            </div>

            <button
              type="submit"
              disabled={isPasswordSubmitting}
              className="btn bg-rose-900 hover:bg-[#BF1E2E] text-white border-none w-full"
            >
              {isPasswordSubmitting ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* ====================== CHANGE EMAIL ====================== */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <FaEnvelope className="text-rose-900" />
            <h2 className="text-lg font-bold text-rose-900">Change Email</h2>
          </div>

          <form
            onSubmit={handleEmailSubmit(onEmailSubmit)}
            className="space-y-4"
            autoComplete="off"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Current Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full bg-gray-100"
                value={user?.email || ""}
                readOnly
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">New Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full bg-white"
                placeholder="Enter new email"
                autoComplete="off"
                {...registerEmail("email", { required: true })}
              />
            </div>

            <button
              type="submit"
              disabled={isEmailSubmitting}
              className="btn bg-rose-900 hover:bg-[#BF1E2E] text-white border-none w-full"
            >
              {isEmailSubmitting ? "Updating..." : "Update Email"}
            </button>
          </form>
        </div>

        {/* ====================== CHANGE LOGO (Only Owner/Admin) ====================== */}
        {(type === "owner" || type === "admin") && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <FaImage className="text-rose-900" />
              <h2 className="text-lg font-bold text-rose-900">Update Logo</h2>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-rose-50 border flex items-center justify-center shrink-0">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : currentLogoUrl ? (
                  <img
                    src={currentLogoUrl}
                    alt="Current Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-rose-900 font-bold text-3xl">
                    {hotel?.hotelName?.charAt(0) || "H"}
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="file-input file-input-bordered w-full max-w-md bg-white"
                />

                <button
                  type="button"
                  onClick={handleLogoUpload}
                  disabled={!selectedLogo}
                  className="btn bg-rose-900 hover:bg-[#BF1E2E] text-white border-none"
                >
                  Upload New Logo
                </button>

                <p className="text-xs text-gray-500">
                  Recommended: Square image (at least 200×200 px)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Security;
