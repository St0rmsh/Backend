import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

import {
  FaHeart,
  FaShoppingBag,
  FaMoon,
  FaSun,
  FaChevronDown,
} from "react-icons/fa";

import { useTheme } from "../../../context/ThemeContext";
import { useCart } from "../../../context/CartContext";
import LogoutButton from "../../products/components/LogoutButton";

const WishlistNavbar = () => {
  const { isDark, toggleTheme } = useTheme();

  const { cartCount } = useCart();

  const user = useSelector((state) => state.auth.user);

  return (
    <motion.nav
      initial={{
        y: -50,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.6,
      }}
      className={`
        sticky
        top-0
        z-50
        backdrop-blur-2xl
        border-b

        ${
          isDark
            ? "bg-black/80 border-neutral-800"
            : "bg-white/80 border-neutral-200"
        }
      `}
    >
      <div
        className="
          max-w-[1450px]
          mx-auto
          px-6
          h-[78px]
          flex
          items-center
          justify-between
        "
      >
        {/* Logo */}

        <Link
          to="/products"
          className="
            flex
            items-center
            gap-3
          "
        >
          <span
            className="
              text-3xl
              font-black
              italic
              tracking-tight
            "
          >
            SNITCH
          </span>

          <span
            className="
              hidden
              md:block
              text-[10px]
              uppercase
              tracking-[0.45em]
              opacity-40
            "
          >
            Wishlist
          </span>
        </Link>

        {/* Right */}

        <div className="flex items-center gap-4">
          {/* Theme */}

          <motion.button
            whileTap={{
              scale: 0.9,
            }}
            whileHover={{
              rotate: 180,
            }}
            onClick={toggleTheme}
            className="
              w-11
              h-11
              rounded-full
              flex
              items-center
              justify-center
              transition
              hover:bg-neutral-100
              dark:hover:bg-neutral-800
            "
          >
            {isDark ? (
              <FaSun />
            ) : (
              <FaMoon />
            )}
          </motion.button>

          {/* Wishlist */}

          <Link
            to="/wishlist"
            className="
              relative
              w-11
              h-11
              rounded-full
              flex
              items-center
              justify-center
              hover:bg-neutral-100
              dark:hover:bg-neutral-800
            "
          >
            <FaHeart />
          </Link>

          {/* Cart */}

          <Link
            to="/cart"
            className="
              relative
              w-11
              h-11
              rounded-full
              flex
              items-center
              justify-center
              hover:bg-neutral-100
              dark:hover:bg-neutral-800
            "
          >
            <FaShoppingBag />

            {cartCount > 0 && (
              <motion.span
                initial={{
                  scale: 0,
                }}
                animate={{
                  scale: 1,
                }}
                className="
                  absolute
                  -top-1
                  -right-1
                  w-5
                  h-5
                  rounded-full
                  bg-red-500
                  text-white
                  text-[10px]
                  font-bold
                  flex
                  items-center
                  justify-center
                "
              >
                {cartCount}
              </motion.span>
            )}
          </Link>

          {/* User */}

          {user && (
            <div className="relative group">
              <button
                className="
                  flex
                  items-center
                  gap-3
                  rounded-full
                  px-3
                  py-2
                  hover:bg-neutral-100
                  dark:hover:bg-neutral-800
                "
              >
                <img
                  src={
                    user.avatar ||
                    "https://i.pravatar.cc/100"
                  }
                  alt=""
                  className="
                    w-9
                    h-9
                    rounded-full
                    object-cover
                  "
                />

                <span
                  className="
                    hidden
                    md:block
                    font-semibold
                  "
                >
                  {user.fullname}
                </span>

                <FaChevronDown
                  className="
                    hidden
                    md:block
                    text-xs
                  "
                />
              </button>

              <div
                className="
                  absolute
                  right-0
                  top-full
                  mt-3
                  w-60
                  rounded-3xl
                  shadow-2xl
                  border
                  p-4
                  opacity-0
                  invisible
                  group-hover:visible
                  group-hover:opacity-100
                  transition-all
                  duration-300

                  bg-white
                  dark:bg-neutral-900
                  dark:border-neutral-800
                "
              >
                <div className="mb-4">
                  <p className="font-bold">
                    {user.fullname}
                  </p>

                  <p className="text-sm opacity-60">
                    {user.email}
                  </p>
                </div>

                <Link
                  to="/profile"
                  className="block py-2"
                >
                  Profile
                </Link>

                <Link
                  to="/orders"
                  className="block py-2"
                >
                  Orders
                </Link>

                <Link
                  to="/wishlist"
                  className="block py-2"
                >
                  Wishlist
                </Link>

                <div className="mt-4">
                  <LogoutButton />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default WishlistNavbar;