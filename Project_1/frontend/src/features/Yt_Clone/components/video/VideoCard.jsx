import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ShieldCheck, ShieldAlert, Shield, AlertTriangle, Sparkles } from "lucide-react";

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

const VideoCard = ({ video }) => {
  const channel = video?.channel || {};
  const videoRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/video/${video?._id}`}>
        <div className="relative aspect-video rounded-3xl overflow-hidden bg-surface-low border border-main group-hover:border-brand-indigo/30 transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-brand-indigo/10 group-hover:-translate-y-1">
          
          {/* THUMBNAIL */}
          <motion.img
            animate={{ scale: isHovering ? 1.1 : 1, filter: isHovering ? "blur(4px)" : "blur(0px)" }}
            transition={{ duration: 0.6 }}
            src={video?.thumbnail || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"}
            alt={video?.title}
            className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300"
            style={{ opacity: isHovering ? 0.3 : 1 }}
          />

          {/* VIDEO PREVIEW */}
          {video?.videoUrl && !isMobile && (
            <video
              ref={videoRef}
              src={video.videoUrl}
              muted
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500 ${isHovering ? "opacity-100" : "opacity-0"}`}
            />
          )}

          {/* AI STATUS OVERLAY (TOP LEFT) */}
          <div className="absolute top-3 left-3 z-30 flex flex-wrap gap-1.5 pointer-events-none">
            {video?.verification?.finalVerdict === "TRUE" && (
              <div className="glass px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald ai-glow-emerald" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Verified</span>
              </div>
            )}
            {video?.verification?.finalVerdict === "FALSE" && (
              <div className="bg-brand-crimson/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                <ShieldAlert className="w-3.5 h-3.5 text-white ai-glow-crimson" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">False Info</span>
              </div>
            )}
            {video?.deepfakeScore > 0.5 && (
              <div className="glass px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">AI Gen</span>
              </div>
            )}
          </div>

          {/* HOVER PLAY ICON */}
          <AnimatePresence>
            {isHovering && !isMobile && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/20"
              >
                <div className="w-14 h-14 rounded-full glass-heavy flex items-center justify-center shadow-2xl scale-110">
                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DURATION */}
          <div className="absolute bottom-3 right-3 z-30 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-black text-white tracking-widest uppercase">
            {video?.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : "LIVE"}
          </div>
        </div>
      </Link>

      {/* CONTENT */}
      <div className="flex mt-4 gap-4 px-1">
        <Link to={`/channel/${channel?.handle || ""}`} className="shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-indigo to-brand-purple flex items-center justify-center text-lg font-black text-white shadow-lg overflow-hidden border-2 border-transparent group-hover:border-brand-indigo/50 transition-all">
            {channel?.avatar ? (
              <img src={channel.avatar} alt={channel.name} className="w-full h-full object-cover" />
            ) : (
              channel?.name?.charAt(0) || "U"
            )}
          </div>
        </Link>

        <div className="flex flex-col flex-1">
          <Link to={`/video/${video?._id}`}>
            <h3 className="font-display font-bold text-[16px] leading-snug line-clamp-2 text-main group-hover:text-brand-indigo transition-colors duration-300">
              {video?.title || "Premium Editorial Content"}
            </h3>
          </Link>
          
          <div className="mt-2 flex items-center gap-2">
            <Link to={`/channel/${channel?.handle || ""}`}>
              <span className="text-xs font-black uppercase tracking-widest text-muted hover:text-main transition-colors">
                {channel?.name || "The Curator"}
              </span>
            </Link>
            <span className="w-1 h-1 rounded-full bg-muted opacity-30" />
            <span className="text-xs font-bold text-muted">
              {video?.views || 0} Views
            </span>
          </div>
          
          <p className="text-[11px] text-muted font-bold uppercase tracking-tighter mt-1 opacity-50">
            {formatTimeAgo(video?.createdAt)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;
