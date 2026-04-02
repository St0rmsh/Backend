import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

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

const FALLBACK_THUMB =
  "https://via.placeholder.com/640x360?text=No+Thumbnail";

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
    <div
      className="w-full max-w-[420px] mx-auto group cursor-pointer 
      transition-transform duration-200 hover:scale-[1.02]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ===== THUMB ===== */}
      <Link to={`/video/${video?._id || ""}`}>
        <div className="relative w-full overflow-hidden rounded-xl">

          {/* 16:9 ratio */}
          <div className="w-full h-0 pb-[56.25%] relative">

            {/* THUMB */}
            <img
              src={video?.thumbnail || FALLBACK_THUMB}
              alt={video?.title || "video"}
              loading="lazy"
              className={`absolute top-0 left-0 w-full h-full object-cover transition duration-300 
              ${isHovering ? "opacity-0" : "opacity-100 group-hover:scale-105"}`}
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
                className={`absolute top-0 left-0 w-full h-full object-cover transition duration-300
                ${isHovering ? "opacity-100" : "opacity-0"}`}
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />

          </div>
        </div>
      </Link>

      {/* ===== CONTENT ===== */}
      <div className="flex mt-3 gap-3">

        {/* AVATAR */}
        <Link to={channel?.handle ? `/channel/${channel.handle}` : "#"}>
          <div
            className="w-10 h-10 min-w-[40px] rounded-full 
            bg-gray-300 dark:bg-gray-700 
            flex items-center justify-center 
            text-sm font-semibold 
            text-gray-700 dark:text-gray-200"
          >
            {channel?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </Link>

        {/* TEXT */}
        <div className="flex flex-col gap-1 flex-1">

          {/* TITLE */}
          <p className="font-semibold text-[14px] leading-snug line-clamp-2 text-gray-900 dark:text-white">
            {video?.title || "Untitled Video"}
          </p>

          {/* CHANNEL */}
          <p className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
            {channel?.name || "Unknown Channel"}
          </p>

          {/* META */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {video?.views || 0} views • {formatTimeAgo(video?.createdAt)}
          </p>

        </div>
      </div>
    </div>
  );
};

export default VideoCard;
