import { motion } from "framer-motion";
import {
  FaShoppingBag,
  FaEye,
  FaShareAlt,
} from "react-icons/fa";
import { floatingActions, actionItem } from "../animations";
import FavoriteButton from "./FavoriteButton";

const FloatingActions = ({
  isFavorite = false,
  onFavorite,
  onAddToCart,
  onQuickView,
  onShare,
}) => {
  return (
    <motion.div
      variants={floatingActions}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="
        absolute
        top-4
        right-4
        z-30
        flex
        flex-col
        gap-3
      "
    >
      {/* Wishlist */}
      <motion.div variants={actionItem}>
        <FavoriteButton
          isFavorite={isFavorite}
          onClick={onFavorite}
        />
      </motion.div>

      {/* Add to Cart */}
      <motion.button
        variants={actionItem}
        whileHover={{
          scale: 1.08,
        }}
        whileTap={{
          scale: 0.92,
        }}
        onClick={onAddToCart}
        className="
          w-11
          h-11
          rounded-full
          flex
          items-center
          justify-center
          shadow-xl
          backdrop-blur-xl
          bg-white/80
          dark:bg-black/40
          border
          border-white/30
          dark:border-white/10
        "
      >
        <FaShoppingBag className="text-lg" />
      </motion.button>

      {/* Quick View */}
      <motion.button
        variants={actionItem}
        whileHover={{
          scale: 1.08,
        }}
        whileTap={{
          scale: 0.92,
        }}
        onClick={onQuickView}
        className="
          w-11
          h-11
          rounded-full
          flex
          items-center
          justify-center
          shadow-xl
          backdrop-blur-xl
          bg-white/80
          dark:bg-black/40
          border
          border-white/30
          dark:border-white/10
        "
      >
        <FaEye className="text-lg" />
      </motion.button>

      {/* Share */}
      {onShare && (
        <motion.button
          variants={actionItem}
          whileHover={{
            scale: 1.08,
          }}
          whileTap={{
            scale: 0.92,
          }}
          onClick={onShare}
          className="
            w-11
            h-11
            rounded-full
            flex
            items-center
            justify-center
            shadow-xl
            backdrop-blur-xl
            bg-white/80
            dark:bg-black/40
            border
            border-white/30
            dark:border-white/10
          "
        >
          <FaShareAlt className="text-lg" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default FloatingActions;