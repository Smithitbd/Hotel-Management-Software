import { useSearchParams, useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import smithLogo from "../../assets/logo_smith.png";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";

const ResetPassword = () => {
  const { verifyResetCode, confirmResetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get("oobCode");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ===================== VERIFY CODE (TanStack Query) =====================
  const {
    data: email,
    isLoading: isVerifying,
    isError: isVerifyError,
    error: verifyError,
  } = useQuery({
    queryKey: ["verifyResetCode", oobCode],
    queryFn: () => verifyResetCode(oobCode),
    enabled: !!oobCode,
    retry: false,
  });

  // ===================== FORM =====================
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const newPassword = watch("newPassword");

  // ===================== CONFIRM RESET (Mutation) =====================
  const { mutate: resetPassword, isPending: isSubmitting } = useMutation({
    mutationFn: (newPassword) => confirmResetPassword(oobCode, newPassword),
    onSuccess: async () => {
      await Swal.fire({
        icon: "success",
        title: "Password Reset Successful!",
        text: "You can now login with your new password.",
        confirmButtonColor: "#0d9488",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/dashboard");
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text: "Failed to reset password. The link may have expired.",
        confirmButtonColor: "#0d9488",
      });
    },
  });

  const onSubmit = (data) => {
    resetPassword(data.newPassword);
  };

  // ===================== LOADING =====================
  if (isVerifying) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-teal-600"></span>
          <p className="mt-4 text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // ===================== INVALID / EXPIRED LINK =====================
  if (!oobCode || isVerifyError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-red-500 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Invalid Reset Link
            </h2>
            <p className="text-gray-600 mb-6">
              {verifyError?.message ||
                "This password reset link is invalid or has expired."}
            </p>
            <Link
              to="/login"
              className="btn bg-teal-600 hover:bg-teal-700 text-white border-none"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ===================== MAIN FORM =====================
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Reset Password</h1>
        <p className="text-center text-lg md:text-xl font-medium tracking-wide text-gray-700 mt-2">
          <span className="font-semibold text-teal-700">Obokash</span>
          <span className="mx-2 text-gray-400">·</span>
          <span className="italic text-gray-600">We demand excellence</span>
        </p>
        <p className="text-sm text-gray-500 mt-3">
          Resetting password for:{" "}
          <span className="font-medium text-teal-700">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="input input-bordered w-full bg-white pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter new password"
              {...register("newPassword", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors duration-200"
            >
              {showPassword ? (
                // Eye-off
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                // Eye
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="input input-bordered w-full bg-white pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Confirm new password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors duration-200"
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn w-full bg-teal-600 hover:bg-teal-700 text-white border-none text-base font-semibold tracking-wide"
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "RESET PASSWORD"
          )}
        </button>
      </form>

      {/* Back to Login */}
      <p className="text-center text-sm text-gray-600 mt-5">
        Remember your password?{" "}
        <Link
          to="/login"
          className="text-teal-600 font-semibold hover:underline"
        >
          Back to Login
        </Link>
      </p>

      {/* Smith IT Logo */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center gap-3">
        <img src={smithLogo} alt="Smith IT" className="h-8 object-contain" />
        <p className="text-xs text-gray-500 text-center">
          © All Rights Reserved. Obokash is a product of{" "}
          <Link
            to="https://smithitbd.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 font-semibold hover:underline"
          >
            Smith IT
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
