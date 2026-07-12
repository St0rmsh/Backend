import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaArrowRight,
  FaShoppingBag,
} from "react-icons/fa";

const floating = {
  animate: {
    y: [-8, 8, -8],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const EmptyWishlist = () => {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
      }}
      className="
        relative
        overflow-hidden
        rounded-[42px]
        border
        border-neutral-200
        dark:border-neutral-800
        bg-white
        dark:bg-neutral-900
        py-24
        px-8
        text-center
      "
    >
      {/* Glow */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          w-[500px]
          h-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-yellow-500/10
          blur-[140px]
          pointer-events-none
        "
      />

      {/* Floating Circles */}

      <motion.div
        variants={floating}
        animate="animate"
        className="
          absolute
          top-12
          left-12
          w-6
          h-6
          rounded-full
          bg-red-400/30
        "
      />

      <motion.div
        variants={floating}
        animate="animate"
        className="
          absolute
          bottom-20
          right-20
          w-4
          h-4
          rounded-full
          bg-yellow-400/40
        "
      />

      <motion.div
        variants={floating}
        animate="animate"
        className="
          absolute
          top-28
          right-40
          w-3
          h-3
          rounded-full
          bg-pink-500/30
        "
      />

      {/* Heart */}

      <motion.div
        animate={{
          scale: [1, 1.12, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="
          relative
          mx-auto
          w-36
          h-36
          rounded-full
          flex
          items-center
          justify-center
          bg-red-50
          dark:bg-red-500/10
        "
      >
        <FaHeart
          className="
            text-red-500
            text-6xl
          "
        />
      </motion.div>

      {/* Title */}

      <h2
        className="
          mt-10
          text-4xl
          md:text-5xl
          font-black
          tracking-tight
        "
      >
        Your Wishlist is Empty
      </h2>

      {/* Description */}

      <p
        className="
          max-w-xl
          mx-auto
          mt-6
          text-lg
          opacity-60
          leading-relaxed
        "
      >
        Save your favorite styles and premium
        collections here. They'll be waiting
        whenever you're ready to shop.
      </p>

      {/* CTA */}

      <Link
        to="/products"
        className="
          inline-flex
          items-center
          gap-3
          mt-12
          px-8
          py-4
          rounded-2xl
          bg-black
          text-white
          font-bold
          uppercase
          tracking-[0.2em]
          transition-all
          hover:scale-105
        "
      >
        <FaShoppingBag />

        Explore Collection

        <FaArrowRight />
      </Link>

      {/* Bottom Stats */}

      <div
        className="
          mt-16
          flex
          flex-wrap
          justify-center
          gap-12
          text-center
        "
      >
        <div>
          <h3 className="text-3xl font-black">
            500+
          </h3>

          <p className="uppercase text-xs tracking-[0.3em] opacity-50">
            Premium Styles
          </p>
        </div>

        <div>
          <h3 className="text-3xl font-black">
            100+
          </h3>

          <p className="uppercase text-xs tracking-[0.3em] opacity-50">
            New Arrivals
          </p>
        </div>

        <div>
          <h3 className="text-3xl font-black">
            24/7
          </h3>

          <p className="uppercase text-xs tracking-[0.3em] opacity-50">
            Shopping
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default EmptyWishlist;