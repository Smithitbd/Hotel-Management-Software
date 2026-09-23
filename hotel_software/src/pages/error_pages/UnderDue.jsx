import { motion } from "framer-motion";
import { AlertCircle, Clock, CreditCard, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const UnderDue = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();

      await Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been logged out successfully.",
        confirmButtonColor: "#0d9488",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#0d9488",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30 flex flex-col">
      <div className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          {/* Header */}
          <div className="mb-8 flex items-center justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.45 }}
              className="flex items-center gap-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 ring-1 ring-red-200/60">
                <AlertCircle size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">Under Due</h1>
                <p className="mt-0.5 text-sm text-gray-500">
                  Members with unpaid monthly bills
                </p>
              </div>
            </motion.div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-red-50 hover:text-red-600 hover:ring-red-200 transition-all duration-200"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </motion.button>
          </div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-rose-400 to-orange-400" />

            <div className="flex min-h-[420px] flex-col items-center justify-center px-8 py-14 text-center">
              {/* Animated Icon */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative mb-6"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-red-50 text-red-500 ring-1 ring-red-100">
                  <CreditCard size={42} strokeWidth={1.75} />
                </div>

                {/* Small badge */}
                <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-gray-100">
                  <Clock size={18} className="text-red-500" />
                </div>
              </motion.div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900">
                No Overdue Members
              </h2>

              {/* Description */}
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-gray-500">
                Members who have unpaid monthly bills will appear here.
                Currently everything looks clear.
              </p>

              {/* Status Badge */}
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200/70">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                All payments up to date
              </div>

              {/* Extra note */}
              <p className="mt-8 max-w-sm text-xs leading-5 text-gray-400">
                When a member misses a monthly payment, their details will show
                up in this section automatically.
              </p>
            </div>
          </motion.div>

          {/* Footer tip */}
          <p className="mt-6 text-center text-xs text-gray-400">
            Stay on top of dues to keep everything running smoothly.
          </p>
        </motion.div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="px-6 py-5 mt-auto border-t border-gray-200 bg-white">
        <div className="flex flex-col items-center gap-3">
          {/* Smith IT Logo */}
          <div className="flex items-center gap-1.5"></div>

          {/* Copyright text */}
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
      </footer>
    </div>
  );
};

export default UnderDue;
