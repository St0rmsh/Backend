import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  FaHeart,
  FaWallet,
  FaTags,
  FaLayerGroup,
  FaBoxes,
} from "react-icons/fa";

import { summaryContainer, summaryCard } from "../animations";
import {
  calculateWishlistStats,
  formatPrice,
} from "../constants";

const WishlistSummary = ({ wishlistItems = [], isDark = false }) => {
  const stats = calculateWishlistStats(wishlistItems);

  const cards = [
    {
      title: "Wishlist Value",
      value: stats.totalValue,
      prefix: "₹",
      icon: FaWallet,
      accent: "emerald",
    },
    {
      title: "You Save",
      value: stats.totalSaved,
      prefix: "₹",
      icon: FaTags,
      accent: "red",
    },
    {
      title: "Saved Items",
      value: stats.totalItems,
      icon: FaHeart,
      accent: "pink",
    },
    {
      title: "Categories",
      value: stats.categories,
      icon: FaLayerGroup,
      accent: "blue",
    },
    {
      title: "Brands",
      value: stats.brands,
      icon: FaBoxes,
      accent: "amber",
    },
  ];

  return (
    <motion.section
      variants={summaryContainer}
      initial="hidden"
      animate="visible"
      className="
        grid
        grid-cols-2
        lg:grid-cols-5
        gap-5
        mb-16
      "
    >
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            variants={summaryCard}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
            className={`
              relative
              overflow-hidden
              rounded-[30px]
              border
              p-6
              transition-all
              duration-500

              ${
                isDark
                  ? "bg-neutral-900 border-neutral-800"
                  : "bg-white border-neutral-200"
              }

              shadow-xl
            `}
          >
            {/* Glow */}

            <div
              className={`
                absolute
                -top-8
                -right-8
                w-28
                h-28
                rounded-full
                blur-3xl
                opacity-20

                ${
                  card.accent === "emerald"
                    ? "bg-emerald-500"
                    : card.accent === "red"
                    ? "bg-red-500"
                    : card.accent === "blue"
                    ? "bg-blue-500"
                    : card.accent === "pink"
                    ? "bg-pink-500"
                    : "bg-yellow-500"
                }
              `}
            />

            {/* Icon */}

            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-black
                text-white
                flex
                items-center
                justify-center
                mb-6
              "
            >
              <Icon />
            </div>

            {/* Value */}

            <h3 className="text-3xl font-black tracking-tight">
              {card.prefix}

              <CountUp
                end={card.value}
                separator=","
                duration={1.6}
                formattingFn={(value) =>
                  card.prefix
                    ? formatPrice(value)
                    : Math.floor(value)
                }
              />
            </h3>

            {/* Label */}

            <p
              className="
                mt-2
                text-xs
                uppercase
                tracking-[0.28em]
                opacity-50
              "
            >
              {card.title}
            </p>
          </motion.div>
        );
      })}
    </motion.section>
  );
};

export default WishlistSummary;