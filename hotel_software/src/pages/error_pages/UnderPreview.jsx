import { motion } from "framer-motion";
import { FileText, ArrowLeft } from "lucide-react";

const UnderPreview = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-5xl"
      >
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm ring-1 ring-gray-200 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </motion.button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Under Due Preview
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Preview under due information
            </p>
          </div>
        </div>

        {/* Preview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
        >
          <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 text-gray-500"
            >
              <FileText size={36} />
            </motion.div>

            <h2 className="text-xl font-semibold text-gray-800">Preview</h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
              Under due details will be displayed here when available.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UnderPreview;
