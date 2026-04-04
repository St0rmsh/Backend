import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";

const SubscribeButton = ({ subscribed, loading, onClick, darkMode = false }) => {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const prevSubscribed = useRef(subscribed);

  // 🎊 CONFETTI EFFECT: ONLY trigger on fresh subscription click
  useEffect(() => {
    if (subscribed && !prevSubscribed.current && isSubscribing) {
      confetti({
        particleCount: 150,
        spread: 90,
        angle: 90,
        origin: { y: 0.6 },
        gravity: 0.7,
        colors: ["#ff0000", "#ff6b81", "#ff9f43", "#ffdd59"]
      });
      setIsSubscribing(false); // Reset click tracking
    }
    prevSubscribed.current = subscribed;
  }, [subscribed, isSubscribing]);

  const handleClick = async () => {
    if (loading) return;
    setIsSubscribing(true); // Track this click
    await onClick();
  };

  // Colors based on theme & state
  const baseBg = subscribed
    ? darkMode
      ? "bg-gradient-to-r from-indigo-600 to-purple-600"
      : "bg-gradient-to-r from-red-500 to-pink-500"
    : "bg-red-500";

  const baseText = "text-white";

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      className={`relative px-5 py-2 rounded-full font-medium overflow-hidden shadow-lg flex items-center justify-center ${baseBg}`}
    >
      <span className={`relative z-10 transition-colors duration-300 ${baseText}`}>
        {loading
          ? "Loading..."
          : subscribed
          ? "Subscribed ✓"
          : "Subscribe"}
      </span>
    </motion.button>
  );
};

export default SubscribeButton;
