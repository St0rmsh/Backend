import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";

const formatTimeAgo = (date) => {
  if (!date) return "just now";
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
    if (value >= 1) return `${value} ${key}${value > 1 ? "s" : ""} ago`;
  }
  return "just now";
};

const FALLBACK_THUMB = "https://via.placeholder.com/640x360?text=No+Thumbnail";

const VideoCard = ({ video }) => {
  const channel = video?.channel || {};
  const videoRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseEnter = () => {
    if (isMobile) return;
    setIsHovering(true);
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = 2;
        videoRef.current.play();
      } catch {}
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-[420px] mx-auto group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/video/${video?._id || ""}`}>
        <div className="relative w-full overflow-hidden rounded-2xl shadow-sm group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:group-hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow duration-300">
          {/* 16:9 ratio container */}
          <div className="w-full h-0 pb-[56.25%] relative bg-gray-200 dark:bg-gray-800">
            {/* THUMBNAIL */}
            <motion.img
              animate={{ scale: isHovering ? 1.05 : 1 }}
              transition={{ duration: 0.4 }}
              src={video?.thumbnail || FALLBACK_THUMB}
              alt={video?.title || "video"}
              loading="lazy"
              className={`absolute top-0 left-0 w-full h-full object-cover z-10 transition-opacity duration-300 ${isHovering ? "opacity-0" : "opacity-100"}`}
            />

            {/* VIDEO PREVIEW */}
            {video?.videoUrl && !isMobile && (
              <video
                ref={videoRef}
                src={video.videoUrl}
                muted
                loop
                playsInline
                preload="metadata"
                className={`absolute top-0 left-0 w-full h-full object-cover z-0 transition-opacity duration-500 rounded-2xl scale-105 ${isHovering ? "opacity-100" : "opacity-0"}`}
              />
            )}

            {/* OVERLAY & PLAY ICON */}
            <AnimatePresence>
              {isHovering && !isMobile && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-black/20 flex items-center justify-center transition-all"
                >
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-xl"
                  >
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* AI BADGES */}
            <div className="absolute top-2 right-2 z-30 flex flex-col items-end gap-1.5 opacity-90">
              {(!video?.videoUrl || video?.isPublished === false) && (
                <div className="bg-amber-500/95 backdrop-blur-sm px-2 py-0.5 rounded text-white text-[11px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
                  Processing
                </div>
              )}
              {video?.isFlagged && (
                <div className="bg-red-500/95 backdrop-blur-sm px-2 py-0.5 rounded text-white text-[11px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  False Info
                </div>
              )}
              {video?.deepfakeScore > 0.6 && (
                <div className="bg-purple-600/95 backdrop-blur-sm px-2 py-0.5 rounded text-white text-[11px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5">
                  <span className="text-[10px]">✨</span> AI Edited
                </div>
              )}
              {video?.verification?.finalVerdict === "TRUE" && !video?.isFlagged && (
                <div className="bg-emerald-500/95 backdrop-blur-sm px-2 py-0.5 rounded text-white text-[11px] font-bold tracking-widest uppercase shadow-md">
                   Verified
                </div>
              )}
              {video?.verification?.finalVerdict === "FALSE" && (
                <div className="bg-red-600/95 backdrop-blur-sm px-2 py-0.5 rounded text-white text-[11px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5">
                   <AlertTriangle className="w-3 h-3" /> False info
                </div>
              )}
              {video?.verification?.finalVerdict === "PARTIALLY_TRUE" && (
                <div className="bg-amber-600/95 backdrop-blur-sm px-2 py-0.5 rounded text-white text-[11px] font-bold tracking-widest uppercase shadow-md">
                   Partially True
                </div>
              )}
            </div>

          </div>
        </div>
      </Link>

      {/* ===== CONTENT ===== */}
      <div className="flex mt-4 gap-3 px-1">
        {/* AVATAR */}
        <Link to={channel?.handle ? `/channel/${channel.handle}` : "#"} className="shrink-0">
          <div className="w-10 h-10 rounded-full bg-linear-to-tr from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800 flex items-center justify-center text-sm font-bold text-indigo-700 dark:text-indigo-300 ring-2 ring-transparent group-hover:ring-indigo-100 dark:group-hover:ring-indigo-900 transition-all duration-300 shadow-sm overflow-hidden">
            {channel?.avatar ? (
              <img src={channel.avatar} alt={channel.name} className="w-full h-full object-cover" />
            ) : (
              channel?.name?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>
        </Link>

        {/* TEXT */}
        <div className="flex flex-col flex-1 pr-2">
          {/* TITLE */}
          <Link to={`/video/${video?._id || ""}`}>
            <h3 className="font-semibold text-[15px] leading-snug line-clamp-2 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {video?.title || "Untitled Video"}
            </h3>
          </Link>

          {/* CHANNEL & META */}
          <div className="mt-1">
            <Link to={channel?.handle ? `/channel/${channel.handle}` : "#"}>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors inline-block font-medium">
                {channel?.name || "Unknown Channel"}
              </p>
            </Link>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">
              {video?.views || 0} views • {formatTimeAgo(video?.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;
