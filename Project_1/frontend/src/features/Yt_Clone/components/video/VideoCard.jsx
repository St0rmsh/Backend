import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

const VideoCard = ({ video }) => {
  const videoRef = useRef(null);
  const timeoutRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const videoId = video?._id || video?.id;

  if (!videoId) return null; // 🛡 prevents crash

  const handleEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setHovered(true);
      videoRef.current?.play().catch(() => {});
    }, 250);
  };

  const handleLeave = () => {
    clearTimeout(timeoutRef.current);
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
    >
      <Link to={`/video/${videoId}`}>

        {/* THUMBNAIL */}
        <div className="relative overflow-hidden rounded-xl bg-black">

          <img
            src={video.thumbnail}
            className={`absolute inset-0 w-full h-full object-cover transition ${
              hovered ? "opacity-0 scale-105" : "opacity-100"
            }`}
          />

          <video
            ref={videoRef}
            src={video.videoUrl}
            muted
            loop
            playsInline
            className="w-full h-48 object-cover"
          />

          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition" />

        </div>

        {/* CONTENT */}
        <div className="flex gap-2 mt-3">

          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0">
            {video.channelName?.charAt(0) || "C"}
          </div>

          <div className="flex flex-col">

            <h2 className="text-sm font-medium leading-snug line-clamp-2 text-gray-900 dark:text-gray-100">
              {video.title}
            </h2>

            <p className="text-xs text-gray-500 mt-[2px]">
              {video.channelName || "Channel Name"}
            </p>

            <p className="text-xs text-gray-500">
              {video.views} views • {formatDate(video.createdAt)}
            </p>

          </div>

        </div>

      </Link>
    </motion.div>
  );
};


// 🔥 YouTube-style time
const formatDate = (date) => {
  if (!date) return "recently";

  const diff = (Date.now() - new Date(date)) / 1000;

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;

  return `${Math.floor(diff / 2592000)} months ago`;
};

export default VideoCard;
