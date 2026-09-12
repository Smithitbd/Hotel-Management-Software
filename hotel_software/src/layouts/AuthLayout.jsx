import React from "react";
import { Outlet, Link } from "react-router";
import authImg from "/authImage.png";
import logo from "/logo.jpg";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#fdf8f3] flex items-center justify-center p-2 md:p-3">
      <div className="w-full max-w-6xl">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
          {/* Left Side */}
          <div className="lg:w-1/2 bg-gradient-to-br from-amber-50 to-orange-50 flex flex-col items-center justify-center p-6 lg:p-10">
            {/* Larger Logo */}
            <Link to="/" className="mb-6">
              <img
                src={logo}
                alt="Logo"
                className="h-24 md:h-28 lg:h-32 object-contain"
              />
            </Link>

            {/* Image */}
            <img
              src={authImg}
              alt="Hotel"
              className="w-full max-w-md lg:max-w-lg rounded-2xl shadow-lg"
            />
          </div>

          {/* Right Side - Form */}
          <div className="lg:w-1/2 p-2 md:p-5 lg:p-5 flex items-center">
            <div className="w-full max-w-md mx-auto">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
