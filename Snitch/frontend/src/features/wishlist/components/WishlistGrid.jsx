import React from "react";
import { motion } from "framer-motion";

import WishlistCard from "./WishlistCard";
import WishlistSkeleton from "./WishlistSkeleton";
import EmptyWishlist from "./EmptyWishlist";

import { gridContainer } from "../animations";

const WishlistGrid = ({
  wishlistItems = [],
  loading = false,
  isDark = false,
  addToCart,
  toggleWishlist,
  navigate,
}) => {
  // Loading
  if (loading) {
    return <WishlistSkeleton />;
  }

  // Empty
  if (!wishlistItems.length) {
    return <EmptyWishlist />;
  }

  return (
    <motion.section
      variants={gridContainer}
      initial="hidden"
      animate="visible"
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        2xl:grid-cols-4
        gap-8
        xl:gap-10
      "
    >
      {wishlistItems.map((item) => (
        <WishlistCard
          key={`${item.product?._id}-${item.variant}`}
          item={item}
          isDark={isDark}
          addToCart={addToCart}
          toggleWishlist={toggleWishlist}
          navigate={navigate}
        />
      ))}
    </motion.section>
  );
};

export default WishlistGrid;