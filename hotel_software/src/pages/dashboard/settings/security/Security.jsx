import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import Swal from "sweetalert2";
import imageCompression from "browser-image-compression";
import { FaLock, FaImage, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import useAuth from "../../../../hooks/useAuth";
import useAxios from "../../../../hooks/useAxios";
import useUserStatus from "../../../../hooks/useUserStatus";
import { RiHome3Line } from "react-icons/ri";

const getImageUrl = (path) => {
  if (!path || typeof path !== "string") return null;

  const trimmed = path.trim().replace(/\\/g, "/");

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const origin = (import.meta.env.VITE_API_URL || "http://localhost:3000")
    .replace(/\/$/, "")
    .replace(/\/api$/, "");

  return `${origin}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
};

const Security = () => {
  const { user, updateUserPassword } = useAuth();
  const { type, hotelEmail } = useUserStatus();

  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

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

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { isSubmitting: isPasswordSubmitting, errors: passwordErrors },
  } = useForm();

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
      await updateUserPassword(data.newPassword);

      if (type === "owner" || type === "admin") {
        if (hotel?._id) {
          await axiosInstance.patch(`/hotels/${hotel._id}`, {
            passwordUpdatedAt: new Date(),
          });
        }
      } else if (type === "sub-user" && subUser?._id) {
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

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      e.target.value = "";
      return Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please select an image file",
      });
    }

    try {
      setIsCompressing(true);

      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: "image/jpeg",
      };

      const compressedBlob = await imageCompression(file, options);

      const compressedFile = new File(
        [compressedBlob],
        file.name.replace(/\.[^/.]+$/, "") + ".jpg",
        { type: "image/jpeg" },
      );

      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }

      setSelectedLogo(compressedFile);
      setLogoPreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error("Compression error:", error);
      setSelectedLogo(null);
      setLogoPreview(null);
      e.target.value = "";

      Swal.fire({
        icon: "error",
        title: "Compression Failed",
        text: "Could not compress the image. Please try another one.",
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const handleLogoUpload = async () => {
    if (!selectedLogo) {
      return Swal.fire({
        icon: "warning",
        title: "No Image",
        text: "Please select a logo first",
      });
    }

    if (!hotel?._id) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hotel data not loaded",
      });
    }

    try {
      const formData = new FormData();
      formData.append("logo", selectedLogo);

      await axiosInstance.patch(`/hotels/${hotel._id}/logo`, formData);

      await queryClient.invalidateQueries({
        queryKey: ["hotel-by-email", hotelEmail],
      });
      await queryClient.invalidateQueries({ queryKey: ["rooms"] });

      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }

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
      console.error("Logo upload error:", error);
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

  const currentLogoUrl = getImageUrl(hotel?.logo);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-900 flex items-center justify-center">
            <MdSecurity className="text-xl text-white" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-rose-900">Security</h1>
            <p className="text-sm text-gray-500">
              Update password
              {(type === "owner" || type === "admin") && " & logo"}
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

        {(type === "owner" || type === "admin") && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <FaImage className="text-rose-900" />
              <h2 className="text-lg font-bold text-rose-900">Update Logo</h2>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="w-40 h-40 rounded-2xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                {isCompressing ? (
                  <span className="loading loading-spinner loading-md text-rose-900"></span>
                ) : logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="New hotel logo preview"
                    className="w-full h-full object-contain p-2"
                  />
                ) : currentLogoUrl ? (
                  <img
                    src={currentLogoUrl}
                    alt={`${hotel?.hotelName || "Hotel"} logo`}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      console.error(
                        "Logo failed to load:",
                        e.currentTarget.src,
                      );
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-rose-50">
                    <span className="text-rose-900 font-bold text-5xl">
                      {hotel?.hotelName?.charAt(0) || "H"}
                    </span>
                  </div>
                )}
              </div>

              {hotel?.hotelName && (
                <div className="text-center">
                  <h3 className="font-semibold text-gray-800">
                    {hotel.hotelName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Hotel Logo</p>
                </div>
              )}

              <div className="w-full space-y-4">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  onChange={handleLogoChange}
                  disabled={isCompressing}
                  className="file-input file-input-bordered w-full bg-white disabled:opacity-60"
                />

                {isCompressing && (
                  <p className="text-xs text-rose-900 text-center flex items-center justify-center gap-1.5">
                    <span className="loading loading-spinner loading-xs"></span>
                    Compressing image...
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleLogoUpload}
                  disabled={!selectedLogo || isCompressing}
                  className="btn bg-rose-900 hover:bg-[#BF1E2E] text-white border-none w-full disabled:bg-gray-300 disabled:text-gray-500"
                >
                  {isCompressing
                    ? "Compressing..."
                    : selectedLogo
                      ? "Upload New Logo"
                      : "Select Logo First"}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Recommended: Square image, at least 200×200 px
                </p>
                <p className="text-xs text-gray-400 text-center">
                  Image is compressed to ~0.5MB JPEG before upload
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
