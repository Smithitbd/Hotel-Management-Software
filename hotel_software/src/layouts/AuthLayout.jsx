import { Outlet, Link } from "react-router";
import authImg from "../assets/auth_img.jpeg";
import logo from "/logo.png";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#fdf8f3] flex">
      {/* Main Card - Full size */}
      <div className="w-full min-h-screen bg-white shadow-xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left Side - Full Image */}
        <div className="lg:w-2/3   relative min-h-[40vh] lg:min-h-screen">
          <img
            src={authImg}
            alt="Hotel"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Right Side - Logo + Form (tight spacing) */}
        <div className="lg:w-1/2 min-h-[60vh] lg:min-h-screen p-6 md:p-8 lg:p-10 flex flex-col items-center justify-start pt-10 lg:pt-16">
          {/* Logo */}
          <Link to="/" className="mb-6">
            <img
              src={logo}
              alt="Logo"
              className="h-16 md:h-32 lg:h-42 object-contain"
            />
          </Link>

          {/* Form */}
          <div className="w-full max-w-lg">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
