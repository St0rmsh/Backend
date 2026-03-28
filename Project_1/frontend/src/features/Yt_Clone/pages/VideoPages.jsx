import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideoById, getAllVideos } from "../services/ytapi.service";
import VideoCard from "../components/video/VideoCard";
import CustomPlayer from "../components/CustomVideoPlayer";
import { motion, AnimatePresence } from "framer-motion";

const VideoPages = () => {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showDesc, setShowDesc] = useState(false);

  // 🔥 LIKE SYSTEM
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const res = await getVideoById(id);
      const vid = res.data.video;

      setVideo(vid);
      setLikesCount(vid?.likes || 0);

      const all = await getAllVideos();
      setSuggestions(all.data.videos || []);
    };

    fetch();
  }, [id]);

  if (!video) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading video...
      </p>
    );
  }

  // 🔥 FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "recently";

    const diff = (Date.now() - new Date(date)) / 1000;

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;

    return `${Math.floor(diff / 2592000)} months ago`;
  };

  // 👍 LIKE
  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setDisliked(false);
      setLikesCount((prev) => prev + 1);
    }
  };

  // 👎 DISLIKE
  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
    } else {
      setDisliked(true);
      if (liked) {
        setLiked(false);
        setLikesCount((prev) => prev - 1);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">

      {/* LEFT SIDE */}
      <div className="w-full lg:w-[70%]">

        {/* 🎬 VIDEO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CustomPlayer src={video.videoUrl} />
        </motion.div>

        {/* 🎯 TITLE */}
        <h1 className="mt-4 text-lg md:text-xl font-semibold">
          {video.title}
        </h1>

        {/* 📊 META */}
        <p className="text-sm text-gray-500 mt-1">
          {video.views || 0} views • {formatDate(video.createdAt)}
        </p>

        {/* ACTION BAR */}
        <div className="flex items-center justify-between mt-4 flex-wrap gap-4">

          {/* CHANNEL */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
              {video.channelName?.charAt(0) || "C"}
            </div>

            <div>
              <p className="font-medium">
                {video.channelName || "Channel Name"}
              </p>
              <p className="text-xs text-gray-500">
                1.2K subscribers
              </p>
            </div>

            <button className="ml-3 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full text-sm">
              Subscribe
            </button>
          </div>

          {/* 👍 👎 BUTTONS */}
          <div className="flex items-center gap-2">

            {/* LIKE */}
            <motion.button
              onClick={handleLike}
              whileTap={{ scale: 0.8 }}
              animate={{ scale: liked ? 1.1 : 1 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition
                ${
                  liked
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                }
              `}
            >
              👍
              <AnimatePresence mode="wait">
                <motion.span
                  key={likesCount}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {likesCount}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            {/* DISLIKE */}
            <motion.button
              onClick={handleDislike}
              whileTap={{ scale: 0.8 }}
              animate={{ scale: disliked ? 1.1 : 1 }}
              className={`px-4 py-2 rounded-full border transition
                ${
                  disliked
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                }
              `}
            >
              👎
            </motion.button>

          </div>

        </div>

        {/* 📄 DESCRIPTION */}
        <div className="mt-4 bg-gray-100 dark:bg-gray-900 p-4 rounded-xl">

          <p className="text-sm text-gray-700 dark:text-gray-300">
            {showDesc
              ? video.description || "No description available."
              : (video.description || "No description available.").slice(0, 120) + "..."}
          </p>

          <button
            onClick={() => setShowDesc(!showDesc)}
            className="text-sm font-medium mt-2 hover:underline"
          >
            {showDesc ? "Show less" : "Show more"}
          </button>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-[30%] space-y-4">
        {suggestions.map((v) => (
          <VideoCard key={v._id} video={v} />
        ))}
      </div>

    </div>
  );
};

export default VideoPages;
