// VideoPages.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Eye, Clock, ThumbsUp, ThumbsDown } from "lucide-react";
import VideoCard from "../components/video/VideoCard";
import CustomPlayer from "../components/CustomVideoPlayer";
import AIInsightsPanel from "../components/video/AIInsightsPanel";
import { useYT } from "../hook/useYT.js";
import { connectSocket } from "../services/socketIO.service.js";
import {
  toggleSubscribe,
  isSubscribed,
  addView,
  updateWatchTime,
  getWatchTime,
  getSubscribersCount,
  getVideoById
} from "../services/ytapi.service";
import SubscribeButton from "../components/SubscribeButton";
import CommentItem from "../components/CommentItem";

const VideoPages = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const {
    video,
    videos,
    comments,
    liked,
    disliked,
    fetchVideo,
    fetchVideos,
    fetchComments,
    createComment,
    reactVideo,
    fetchUserReaction,
  } = useYT();

  const [newComment, setNewComment] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(null);
  const [loadingSub, setLoadingSub] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const socketRef = useRef(connectSocket());

  const [initialTime, setInitialTime] = useState(0);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      // Fetch metadata directly to get duration for position logic
      let videoDuration = 0;
      try {
        const res = await getVideoById(id);
        videoDuration = res.data.video?.duration || 0;
        // Also dispatch to handle global state
        fetchVideo(id); 
      } catch (err) { fetchVideo(id); }

      fetchVideos();
      fetchComments(id);
      fetchUserReaction(id);
      addView(id);
      
      // ⌚ RESTORE POSITION
      try {
        const timeRes = await getWatchTime(id);
        const savedTime = timeRes.data.time || 0;

        // 🔄 RESTART IF FINISHED: 
        // If the saved position is within 5 seconds of completion, start from beginning
        if (videoDuration > 0 && savedTime >= (videoDuration - 5)) {
            setInitialTime(0);
        } else {
            setInitialTime(savedTime);
        }
      } catch (err) { console.warn("Failed to restore signal position"); }
    };

    load();

    const socket = socketRef.current;
    if (!socket) return;
    socket.emit("join-video", id);
    return () => socket.emit("leave-video", id);
  }, [id]);

  useEffect(() => {
    if (!video?.channel?._id) return;
    const loadSubData = async () => {
      try {
        const [subRes, countRes] = await Promise.all([
          isSubscribed(video.channel._id),
          getSubscribersCount(video.channel._id)
        ]);
        setSubscribed(subRes.data.subscribed);
        setSubscriberCount(countRes.data.subscribers);
      } catch (err) { console.error(err); }
    };
    loadSubData();
  }, [video?.channel?._id]);

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = { year: 31536000, month: 2592000, day: 86400, hour: 3600, minute: 60 };
    for (let key in intervals) {
      const value = Math.floor(seconds / intervals[key]);
      if (value >= 1) return `${value} ${key}${value > 1 ? "s" : ""} ago`;
    }
    return "just now";
  };

  const handleSubscribe = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!video?.channel?._id || loadingSub) return;
    setLoadingSub(true);
    try {
      const res = await toggleSubscribe(video.channel._id);
      setSubscribed(res.data.subscribed);
    } catch (err) { console.error(err); } finally { setLoadingSub(false); }
  };

  const handleAutoNext = () => {
    const index = videos.findIndex((v) => v._id === video._id);
    const next = videos[index + 1];
    if (next?._id) navigate(`/video/${next._id}`);
  };

  const handleWatchTime = (time, duration) => {
    if (!video?._id || time <= 0) return;
    updateWatchTime(video._id, time, duration);
  };

  const handleComment = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!newComment.trim()) return;
    await createComment({ videoId: video._id, text: newComment });
    setNewComment("");
  };

  const handleReaction = (type) => {
    if (!user) {
      navigate("/login");
      return;
    }
    reactVideo({ videoId: video._id, type });
  };

  const videoSources = useMemo(() => ({ "720p": video?.videoUrl }), [video?.videoUrl]);

  if (!video) return <div className="min-h-screen bg-white" />;

  return (
    <div className="w-full px-4 py-4 sm:px-6 lg:px-10 flex flex-col lg:flex-row gap-6 lg:gap-10">
      
      {/* LEFT: CONTENT HUB */}
      <div className="flex-1 flex flex-col gap-6 sm:gap-8">
        
        {/* PLAYER STAGE */}
        <div className="w-full relative rounded-2xl sm:rounded-3xl overflow-hidden bg-stitch-grey shadow-sm">
          {video.videoUrl ? (
            <CustomPlayer
              autoPlay
              sources={videoSources}
              onEnd={handleAutoNext}
              onWatchTime={handleWatchTime}
              videoData={video}
              initialTime={initialTime}
            />
          ) : (
            <div className="aspect-video flex items-center justify-center text-text-muted font-bold text-sm uppercase tracking-widest">
              Verifying Signal Strength...
            </div>
          )}
        </div>

        {/* INFO BAR */}
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
             <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-stitch-black tracking-tight leading-tight">
               {video.title}
             </h1>
             <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-bold text-text-muted uppercase tracking-tighter">
                <span className="flex items-center gap-1.5"><Eye size={14} /> {video.views?.toLocaleString()} views</span>
                <span className="w-0.5 h-0.5 rounded-full bg-text-muted opacity-30" />
                <span className="flex items-center gap-1.5"><Clock size={14} /> {formatTimeAgo(video.createdAt)}</span>
             </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-5 border-y border-border-main">
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <div className="flex items-center gap-4">
                <Link to={`/channel/${video.channel?.handle}`}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-stitch-grey border border-border-main overflow-hidden shadow-sm flex items-center justify-center font-black">
                    {video.channel?.avatar ? <img src={video.channel.avatar} className="w-full h-full object-cover" /> : video.channel?.name?.charAt(0)}
                  </div>
                </Link>
                <div>
                  <Link to={`/channel/${video.channel?.handle}`}>
                    <h3 className="text-xs sm:text-sm font-display font-black text-stitch-black">{video.channel?.name}</h3>
                  </Link>
                </div>
              </div>
              <div className="sm:ml-4">
                <SubscribeButton subscribed={subscribed} loading={loadingSub} onClick={handleSubscribe} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-1 items-center bg-white/50 backdrop-blur-md rounded-2xl border border-black/10 p-1 shadow-sm overflow-hidden group/resonance">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleReaction("LIKE")}
                  className={`
                    flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all
                    ${liked 
                      ? 'bg-brand-orange text-white shadow-[0_0_20px_rgba(255,77,0,0.3)]' 
                      : 'hover:bg-black/5 text-main'
                    }
                  `}
                >
                  <ThumbsUp size={16} className={liked ? "fill-white" : ""} />
                  <span>{video.likesCount?.toLocaleString() || 0}</span>
                </motion.button>

                <div className="w-px h-6 bg-black/10 mx-1" />

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleReaction("DISLIKE")}
                  className={`
                    flex items-center justify-center w-12 h-10 rounded-xl transition-all
                    ${disliked 
                      ? 'bg-brand-red text-white shadow-[0_0_20px_rgba(213,0,0,0.3)]' 
                      : 'hover:bg-black/5 text-main'
                    }
                  `}
                >
                  <ThumbsDown size={16} className={disliked ? "fill-white" : ""} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* AI HUB */}
        <AIInsightsPanel video={video} />

        {/* DESCRIPTION DOCKS */}
        <div className="p-5 sm:p-6 bg-stitch-grey rounded-2xl sm:rounded-3xl border border-border-main">
          <p className={`text-sm leading-relaxed text-stitch-grey-dark font-medium antialiased ${descExpanded ? '' : 'line-clamp-3'}`}>
            {video.description || "The Curator has provided no editorial notes for this signal."}
          </p>
          <button 
            onClick={() => setDescExpanded(!descExpanded)}
            className="mt-4 text-[10px] font-black uppercase tracking-widest text-stitch-earth hover:text-stitch-accent transition-colors"
          >
            {descExpanded ? "Show Less" : "Expand Description"}
          </button>
        </div>

        {/* COMMENTS ENGINE */}
        <div className="space-y-6 sm:space-y-8">
          <h2 className="text-base sm:text-lg font-display font-black text-stitch-black tracking-tight">{comments.length} Discussion Signals</h2>
          <div className="flex gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-2xl bg-stitch-grey border border-border-main flex items-center justify-center font-black text-[10px] sm:text-xs">U</div>
            <div className="flex-1 space-y-3">
              <textarea 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                placeholder="Participate in the dialogue..." 
                className="w-full bg-transparent border-b border-border-main outline-none py-2 text-sm font-medium placeholder:text-text-muted focus:border-stitch-black transition-colors" 
                rows={1} 
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setNewComment("")} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-stitch-black">Dismiss</button>
                <button onClick={handleComment} className="px-5 py-2 bg-stitch-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-stitch-accent transition-all">Transmit</button>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            {comments.map((c) => (
              <CommentItem key={c._id} comment={c} />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: SIDEBAR (RESONANCE) */}
      <div className="w-full lg:w-[320px] xl:w-[380px] 2xl:w-[420px] shrink-0 space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-4 px-2">Resonating Content</h3>
        <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-6 sm:gap-8 lg:gap-6">
          {videos.filter(v => v._id !== id).map((v) => (
            <VideoCard key={v._id} video={v} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPages;
