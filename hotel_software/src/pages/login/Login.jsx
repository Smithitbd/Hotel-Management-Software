import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth"; // adjust path if needed
import Swal from "sweetalert2";

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await signIn(data.email, data.password);

      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        text: "You have logged in successfully",
        confirmButtonColor: "#92400e",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      let message = "Failed to login. Please try again.";

      if (error.code === "auth/user-not-found") {
        message = "No account found with this email";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address";
      } else if (error.code === "auth/invalid-credential") {
        message = "Invalid email or password";
      }

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: message,
        confirmButtonColor: "#92400e",
      });
    }
  };

  return (
    <div className="card w-full max-w-xl shadow-2xl">
      <h1 className="text-4xl font-bold text-amber-800 text-center pt-6">
        Welcome Back
      </h1>

      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            {/* Email */}
            <label className="label">Email</label>
            <input
              type="email"
              className="input input-bordered w-full bg-white"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}

            {/* Password */}
            <label className="label">Password</label>
            <input
              type="password"
              className="input input-bordered w-full bg-white"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}

            {/* Forgot Password */}
            <div className="text-right">
              <a className="link link-hover text-sm text-gray-500">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn bg-amber-800 text-white border-none mt-5 hover:bg-amber-900"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "LOG IN"
              )}
            </button>
          </fieldset>
        </form>

        <p className="text-center mt-4">
          New to this website?{" "}
          <Link to="/signup" className="text-amber-800 font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
