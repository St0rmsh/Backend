import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaShoppingBag, FaTrashAlt } from "react-icons/fa";

import Badge from "./Badge";
import Price from "./Price";
import FloatingActions from "./FloatingActions";

import {
  cardVariants,
  imageVariants,
  overlayVariants,
} from "../animations";

import {
  DEFAULT_PRODUCT_IMAGE,
  formatRelativeDate,
} from "../constants";

const WishlistCard = ({
  item,
  isDark,
  addToCart,
  toggleWishlist,
  navigate,
}) => {
  const product = item.product;

  const variant = useMemo(() => {
    return (
      product?.variants?.find(
        (v) => String(v._id) === String(item.variant)
      ) || null
    );
  }, [product, item.variant]);

  if (!product) return null;

  const image =
    variant?.image?.[0]?.url ||
    product.images?.[0]?.url ||
    DEFAULT_PRODUCT_IMAGE;

  const price =
    variant?.price?.amount ??
    product.price?.amount ??
    0;

  const comparePrice =
    variant?.compareAtPrice ??
    product.compareAtPrice ??
    price;

  const currency =
    variant?.price?.currency ??
    product.price?.currency ??
    "INR";

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="
        group
        flex
        flex-col
        overflow-hidden
        rounded-[32px]
        transition-all
        duration-500
      "
    >
      {/* IMAGE */}

      <div
        className={`
          relative
          overflow-hidden
          rounded-[32px]
          aspect-[3/4]
          border

          ${
            isDark
              ? "bg-neutral-900 border-neutral-800"
              : "bg-white border-neutral-200"
          }
        `}
      >
        {/* Image */}

        <motion.img
          variants={imageVariants}
          src={image}
          alt={product.title}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
          "
        />

        {/* Overlay */}

        <motion.div
          variants={overlayVariants}
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/50
            via-transparent
            to-transparent
          "
        />

        {/* Floating Buttons */}

        <FloatingActions
          isFavorite
          onFavorite={() =>
            toggleWishlist(product._id, item.variant)
          }
          onAddToCart={() =>
            addToCart(product, 1, item.variant)
          }
          onQuickView={() =>
            navigate(`/products/${product._id}`)
          }
        />

        {/* Category */}

        {product.category && (
          <div className="absolute top-4 left-4">
            <Badge glass>
              {product.category}
            </Badge>
          </div>
        )}

        {/* Variant */}

        {variant?.value && (
          <div className="absolute bottom-5 left-5">
            <Badge variant="Premium">
              {variant.value}
            </Badge>
          </div>
        )}
      </div>

      {/* CONTENT */}

      <div className="flex flex-1 flex-col pt-6">
        <Link
          to={`/products/${product._id}`}
          className="
            text-xl
            font-black
            tracking-tight
            hover:underline
            line-clamp-2
          "
        >
          {product.title}
        </Link>

        <p
          className="
            mt-2
            text-sm
            opacity-60
            line-clamp-2
          "
        >
          {product.description ||
            "Premium quality product."}
        </p>

        {/* PRICE */}

        <div className="mt-5">
          <Price
            price={price}
            comparePrice={comparePrice}
            currency={currency}
          />
        </div>

        {/* Added */}

        <p
          className="
            mt-4
            text-xs
            uppercase
            tracking-[0.25em]
            opacity-40
          "
        >
          Saved {formatRelativeDate(item.createdAt)}
        </p>

        {/* Buttons */}

        <div className="mt-6 flex gap-3">
          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.96,
            }}
            onClick={() =>
              addToCart(product, 1, item.variant)
            }
            className="
              flex-1
              h-12
              rounded-2xl
              bg-black
              text-white
              font-bold
              uppercase
              tracking-[0.2em]
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <FaShoppingBag />

            Add to Bag
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.9,
            }}
            onClick={() =>
              toggleWishlist(product._id, item.variant)
            }
            className="
              w-12
              rounded-2xl
              border
              border-red-300
              text-red-500
              flex
              items-center
              justify-center
            "
          >
            <FaTrashAlt />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default memo(WishlistCard);