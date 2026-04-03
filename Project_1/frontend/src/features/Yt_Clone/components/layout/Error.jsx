import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const Error = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white px-6">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        {/* Icon */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex justify-center mb-6"
        >
          <AlertTriangle size={60} className="text-red-500" />
        </motion.div>

        {/* Title */}
        <h1 className="text-6xl font-bold mb-4">404</h1>

        {/* Subtitle */}
        <p className="text-xl text-zinc-400 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <Link to="/">
            <button className="px-6 py-2 rounded-xl bg-white text-black font-semibold hover:scale-105 transition">
              Go Home
            </button>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 rounded-xl border border-zinc-600 hover:bg-zinc-700 transition"
          >
            Go Back
          </button>
        </div>

        {/* Extra Hint */}
        <p className="mt-6 text-sm text-zinc-500">
          Error Code: ROUTE_NOT_FOUND
        </p>
      </motion.div>
    </div>
  );
};

export default Error;
