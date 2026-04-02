import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

const SubscribeButton = ({
  subscribed,
  loading,
  onClick,
  subscriberCount = 0
}) => {
  const [count, setCount] = useState(subscriberCount);
  const [prev, setPrev] = useState(subscribed);
  const [clicked, setClicked] = useState(false);


  useEffect(() => {
    if (subscribed && !prev) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
    setPrev(subscribed);
  }, [subscribed]);

  const handleClick = async () => {
    if (loading) return;
    setClicked(true);
    await onClick();
    setTimeout(() => setClicked(false), 300);
  };

  return (
    <div className="flex items-center gap-3">

      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.9 }}
        whileHover={{
          scale: 1.08,
          boxShadow: "0px 0px 18px rgba(255,0,0,0.7)"
        }}
        animate={{ scale: clicked ? 1.15 : 1 }}
        className={`px-5 py-2 rounded-full font-medium transition ${
          subscribed
            ? "bg-gray-300 text-black"
            : "bg-red-500 text-white"
        }`}
      >
        {loading
          ? "Loading..."
          : subscribed
          ? "Subscribed ✓"
          : "Subscribe"}
      </motion.button>

  
    </div>
  );
};

export default SubscribeButton;
