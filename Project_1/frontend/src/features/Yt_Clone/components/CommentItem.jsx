import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EMOJIS = ["👍", "❤️", "😂"];

const CommentItem = ({ comment }) => {
  const [reactions, setReactions] = useState({
    "👍": 0,
    "❤️": 0,
    "😂": 0
  });

  const [userReaction, setUserReaction] = useState(null);
  const [showBar, setShowBar] = useState(false);

  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState([]);

  // ⏱️ TIME FORMAT
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (let key in intervals) {
      const value = Math.floor(seconds / intervals[key]);
      if (value >= 1) {
        return `${value} ${key}${value > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  };

  // 🎯 REACTION HANDLER
  const handleReaction = (emoji) => {
    setReactions((prev) => {
      const updated = { ...prev };

      if (userReaction) {
        updated[userReaction] = Math.max(0, updated[userReaction] - 1);
      }

      updated[emoji] = (updated[emoji] || 0) + 1;
      return updated;
    });

    setUserReaction(emoji);
  };

  // 💬 ADD REPLY
  const handleReply = () => {
    if (!replyText.trim()) return;

    setReplies((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: replyText,
        user: { username: "You" },
        createdAt: new Date()
      }
    ]);

    setReplyText("");
    setShowReply(false);
  };

  return (
    <div
      className="flex gap-3 sm:gap-4 group relative"
      onMouseEnter={() => setShowBar(true)}
      onMouseLeave={() => setShowBar(false)}
    >
      {/* Avatar */}
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
        {comment.user?.username?.charAt(0) || "U"}
      </div>

      <div className="flex-1 relative">

        {/* HEADER */}
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="font-semibold">
            {comment.user?.username || "User"}
          </span>
          <span className="text-gray-500 text-xs">
            • {formatTimeAgo(comment.createdAt)}
          </span>
        </div>

        {/* COMMENT */}
        <motion.p
          layout
          className="mt-1 px-3 py-2 rounded-xl text-xs sm:text-sm
          bg-white/10 backdrop-blur-md border border-white/20
          shadow-sm inline-block max-w-full break-words"
        >
          {comment.text}
        </motion.p>

        {/* FLOATING REACTION BAR */}
        <AnimatePresence>
          {showBar && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-10 left-0 flex gap-2 bg-white/20 backdrop-blur-lg border border-white/30 px-3 py-1 rounded-full shadow-lg"
            >
              {EMOJIS.map((emoji) => (
                <motion.button
                  key={emoji}
                  whileTap={{ scale: 0.8 }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => handleReaction(emoji)}
                  className="text-lg"
                >
                  {emoji}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* REACTIONS DISPLAY */}
        <div className="flex gap-2 mt-2 flex-wrap">
          {EMOJIS.map((emoji) =>
            reactions[emoji] > 0 ? (
              <motion.div
                key={emoji}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-1 text-xs rounded-full bg-gray-200 flex items-center gap-1"
              >
                {emoji} {reactions[emoji]}
              </motion.div>
            ) : null
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <button onClick={() => setShowReply(!showReply)}>Reply</button>
        </div>

        {/* REPLY INPUT */}
        {showReply && (
          <div className="mt-3 flex gap-2">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 border-b p-1 text-xs outline-none"
            />
            <button onClick={handleReply} className="text-xs text-indigo-500">
              Post
            </button>
          </div>
        )}

        {/* REPLIES */}
        {replies.length > 0 && (
          <div className="mt-4 ml-6 border-l pl-4 space-y-3">
            {replies.map((r) => (
              <div key={r.id} className="flex gap-2">
                <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
                  {r.user.username.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-semibold">{r.user.username}</p>
                  <p className="text-xs text-gray-700">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default CommentItem;
