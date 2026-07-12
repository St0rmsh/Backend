import { motion } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import clsx from "clsx";

const FavoriteButton = ({
  isFavorite = false,
  onClick,
  size = "md",
  glass = true,
  disabled = false,
  className = "",
}) => {
  const sizes = {
    sm: {
      button: "w-9 h-9",
      icon: 16,
    },
    md: {
      button: "w-11 h-11",
      icon: 18,
    },
    lg: {
      button: "w-14 h-14",
      icon: 22,
    },
  };

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      whileHover={{
        scale: 1.08,
        y: -2,
      }}
      whileTap={{
        scale: 0.92,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 18,
      }}
      className={clsx(
        "relative flex items-center justify-center",
        sizes[size].button,
        "rounded-full",
        "transition-all duration-300",
        "shadow-xl",
        disabled && "opacity-50 cursor-not-allowed",
        glass
          ? "backdrop-blur-xl bg-white/80 dark:bg-black/40 border border-white/40 dark:border-white/10"
          : "bg-white dark:bg-neutral-900",
        className
      )}
    >
      {/* Glow */}
      {isFavorite && (
        <motion.div
          layoutId="favoriteGlow"
          className="
            absolute
            inset-0
            rounded-full
            bg-red-500/20
            blur-md
          "
        />
      )}

      <motion.div
        key={isFavorite ? "filled" : "outline"}
        initial={{
          scale: 0.5,
          rotate: -20,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          rotate: 0,
          opacity: 1,
        }}
        exit={{
          scale: 0.5,
          opacity: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 450,
          damping: 20,
        }}
        className="relative z-10"
      >
        {isFavorite ? (
          <FaHeart
            size={sizes[size].icon}
            className="text-red-500"
          />
        ) : (
          <FaRegHeart
            size={sizes[size].icon}
            className="text-neutral-700 dark:text-neutral-200"
          />
        )}
      </motion.div>
    </motion.button>
  );
};

export default FavoriteButton;