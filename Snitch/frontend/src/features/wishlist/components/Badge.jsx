import { motion } from "framer-motion";
import clsx from "clsx";
import { BADGE_COLORS } from "../constants";

const Badge = ({
  children,
  variant = "New",
  size = "md",
  rounded = true,
  glass = false,
  className = "",
}) => {
  const sizes = {
    sm: "px-2 py-1 text-[10px]",
    md: "px-3 py-1.5 text-xs",
    lg: "px-4 py-2 text-sm",
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.06 }}
      transition={{
        duration: 0.25,
      }}
      className={clsx(
        "inline-flex items-center justify-center",
        "font-black uppercase tracking-[0.25em]",
        "select-none",
        "shadow-lg",
        sizes[size],
        rounded ? "rounded-full" : "rounded-xl",

        glass
          ? "backdrop-blur-xl bg-white/20 border border-white/20 text-white"
          : BADGE_COLORS[variant] || BADGE_COLORS.New,

        className
      )}
    >
      {children}
    </motion.span>
  );
};

export default Badge;