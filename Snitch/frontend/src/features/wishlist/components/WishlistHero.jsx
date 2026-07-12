import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import {
  FaArrowRight,
  FaShoppingBag,
  FaTrashAlt,
} from "react-icons/fa";

import { heroVariants } from "../animations";
import {
  calculateWishlistStats,
  formatPrice,
} from "../constants";

const WishlistHero = ({
  wishlistItems = [],
  isDark = false,
  onClearWishlist,
}) => {
  const stats = calculateWishlistStats(wishlistItems);

  return (
    <motion.section
      variants={heroVariants}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden mb-16"
    >
      {/* Background Glow */}

      <div
        className="
          absolute
          -top-40
          right-0
          w-[500px]
          h-[500px]
          rounded-full
          blur-[150px]
          bg-yellow-500/10
          pointer-events-none
        "
      />

      <div
        className="
          flex
          flex-col
          xl:flex-row
          xl:items-end
          xl:justify-between
          gap-12
        "
      >
        {/* LEFT */}

        <div className="max-w-2xl">
          <p
            className="
              uppercase
              tracking-[0.45em]
              text-xs
              opacity-50
              mb-5
            "
          >
            PERSONAL COLLECTION
          </p>

          <h1
            className="
              text-5xl
              sm:text-6xl
              lg:text-7xl
              font-black
              tracking-tight
              leading-none
            "
          >
            Wishlist
          </h1>

          <p
            className="
              mt-6
              text-base
              lg:text-lg
              opacity-60
              max-w-xl
              leading-relaxed
            "
          >
            Your curated collection of premium pieces,
            ready whenever inspiration strikes.
          </p>

          {/* CTA */}

          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              to="/products"
              className="
                inline-flex
                items-center
                gap-3
                px-7
                py-4
                rounded-2xl
                bg-black
                text-white
                font-bold
                uppercase
                tracking-[0.18em]
                hover:scale-[1.02]
                transition
              "
            >
              <FaShoppingBag />

              Continue Shopping

              <FaArrowRight />
            </Link>

            {wishlistItems.length > 0 && (
              <button
                onClick={onClearWishlist}
                className="
                  inline-flex
                  items-center
                  gap-3
                  px-7
                  py-4
                  rounded-2xl
                  border
                  border-red-400
                  text-red-500
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  hover:bg-red-50
                  dark:hover:bg-red-950/20
                  transition
                "
              >
                <FaTrashAlt />

                Clear Wishlist
              </button>
            )}
          </div>
        </div>

        {/* RIGHT */}

        <div
          className={`
            rounded-[36px]
            border
            p-10
            min-w-[320px]

            ${
              isDark
                ? "bg-neutral-900 border-neutral-800"
                : "bg-white border-neutral-200"
            }

            shadow-2xl
          `}
        >
          <p
            className="
              text-xs
              uppercase
              tracking-[0.35em]
              opacity-40
            "
          >
            Collection Overview
          </p>

          <div className="mt-5">
            <h2 className="text-6xl font-black">
              <CountUp
                end={stats.totalItems}
                duration={1.4}
              />
            </h2>

            <p className="opacity-60 mt-2">
              Saved Products
            </p>
          </div>

          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.25em] opacity-40">
              Wishlist Value
            </p>

            <h3 className="text-3xl font-black mt-2">
              ₹
              <CountUp
                end={stats.totalValue}
                duration={1.6}
                separator=","
                formattingFn={(v) =>
                  formatPrice(v)
                }
              />
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-10">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] opacity-40">
                Brands
              </p>

              <h4 className="text-2xl font-black mt-2">
                {stats.brands}
              </h4>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.25em] opacity-40">
                Categories
              </p>

              <h4 className="text-2xl font-black mt-2">
                {stats.categories}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default WishlistHero;