// Currency Symbols
export const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

// Default image
export const DEFAULT_PRODUCT_IMAGE =
  "https://placehold.co/800x1000/f5f5f5/999999?text=No+Image";

// Badge Colors
export const BADGE_COLORS = {
  New: "bg-emerald-500 text-white",
  Sale: "bg-red-500 text-white",
  Limited: "bg-amber-500 text-black",
  Premium: "bg-black text-white",
  Bestseller: "bg-indigo-600 text-white",
};

// Category fallback colors
export const CATEGORY_COLORS = {
  Men: "bg-slate-900 text-white",
  Women: "bg-pink-500 text-white",
  Shoes: "bg-blue-600 text-white",
  Accessories: "bg-orange-500 text-white",
  Lifestyle: "bg-green-600 text-white",
  Default: "bg-gray-800 text-white",
};

// Rating
export const DEFAULT_RATING = 4.8;

// Helpers
export const formatPrice = (amount = 0) =>
  Number(amount).toLocaleString("en-IN");

export const getCurrencySymbol = (currency = "INR") =>
  CURRENCY_SYMBOLS[currency] || "₹";

// Calculate discount %
export const calculateDiscount = (price, comparePrice) => {
  if (!comparePrice || comparePrice <= price) return 0;

  return Math.round(((comparePrice - price) / comparePrice) * 100);
};

// Calculate saved amount
export const calculateSavedAmount = (price, comparePrice) => {
  if (!comparePrice || comparePrice <= price) return 0;

  return comparePrice - price;
};

// Relative Date
export const formatRelativeDate = (date) => {
  if (!date) return "Recently";

  const diff = Date.now() - new Date(date).getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days <= 0) return "Today";

  if (days === 1) return "Yesterday";

  if (days < 7) return `${days} days ago`;

  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;

  if (days < 365) return `${Math.floor(days / 30)} months ago`;

  return `${Math.floor(days / 365)} years ago`;
};

// Wishlist Stats
export const calculateWishlistStats = (items = []) => {
  const stats = {
    totalItems: items.length,
    totalValue: 0,
    totalSaved: 0,
    brands: new Set(),
    categories: new Set(),
  };

  items.forEach((item) => {
    const product = item.product;
    if (!product) return;

    const variant =
      product.variants?.find((v) => v._id === item.variant) || {};

    const price =
      variant.price?.amount ??
      product.price?.amount ??
      0;

    const compare =
      variant.compareAtPrice ??
      product.compareAtPrice ??
      price;

    stats.totalValue += price;
    stats.totalSaved += calculateSavedAmount(price, compare);

    if (product.brand)
      stats.brands.add(product.brand);

    if (product.category)
      stats.categories.add(product.category);
  });

  return {
    totalItems: stats.totalItems,
    totalValue: stats.totalValue,
    totalSaved: stats.totalSaved,
    brands: stats.brands.size,
    categories: stats.categories.size,
  };
};