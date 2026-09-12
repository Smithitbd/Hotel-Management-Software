import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

const UnderDue = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-7xl"
      >
        {/* Page Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <AlertCircle size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">Under Due</h1>

              <p className="text-sm text-gray-500">Monthly payment dues</p>
            </div>
          </motion.div>
        </div>

        {/* Empty Content Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="flex min-h-[400px] items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="text-center">
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500"
            >
              <AlertCircle size={36} />
            </motion.div>

            <h2 className="text-xl font-semibold text-gray-800">Under Due</h2>

            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Members with unpaid monthly bills will appear here.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UnderDue;
