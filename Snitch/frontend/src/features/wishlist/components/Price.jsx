import { motion } from "framer-motion";
import {
  formatPrice,
  getCurrencySymbol,
  calculateDiscount,
  calculateSavedAmount,
} from "../constants";

const Price = ({
  price,
  comparePrice,
  currency = "INR",
  size = "md",
  showSavings = true,
  showDiscount = true,
}) => {
  const discount = calculateDiscount(price, comparePrice);
  const saved = calculateSavedAmount(price, comparePrice);

  const symbol = getCurrencySymbol(currency);

  const sizes = {
    sm: {
      current: "text-lg",
      old: "text-sm",
      save: "text-xs",
    },
    md: {
      current: "text-2xl",
      old: "text-base",
      save: "text-sm",
    },
    lg: {
      current: "text-4xl",
      old: "text-xl",
      save: "text-base",
    },
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center flex-wrap gap-3">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            ${sizes[size].current}
            font-black
            tracking-tight
          `}
        >
          {symbol}
          {formatPrice(price)}
        </motion.span>

        {comparePrice > price && (
          <span
            className={`
              ${sizes[size].old}
              line-through
              opacity-40
              font-medium
            `}
          >
            {symbol}
            {formatPrice(comparePrice)}
          </span>
        )}

        {showDiscount && discount > 0 && (
          <span
            className="
              px-2.5
              py-1
              rounded-full
              bg-red-500/10
              text-red-500
              font-bold
              text-xs
            "
          >
            {discount}% OFF
          </span>
        )}
      </div>

      {showSavings && saved > 0 && (
        <div
          className={`
            ${sizes[size].save}
            font-semibold
            text-emerald-500
          `}
        >
          Save {symbol}
          {formatPrice(saved)}
        </div>
      )}
    </div>
  );
};

export default Price;