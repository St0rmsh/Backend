// VideoPages.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldCheck, ShieldAlert, Info, ChevronDown, ChevronUp } from "lucide-react";
import VideoCard from "../components/video/VideoCard";
import CustomPlayer from "../components/CustomVideoPlayer";
import { useYT } from "../hook/useYT.js";
import { connectSocket } from "../services/socketIO.service.js";
import {
  toggleSubscribe,
  isSubscribed,
  addView,
  updateWatchTime,
  getSubscribersCount
} from "../services/ytapi.service";
import SubscribeButton from "../components/SubscribeButton";
import CommentItem from "../components/CommentItem";
import ReactionButton from "../components/UI/ReactionButton.jsx";

const VideoPages = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    setVideo
  } = useYT();

  const [newComment, setNewComment] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(null);
  const [loadingSub, setLoadingSub] = useState(false);
  const [expandAllComments, setExpandAllComments] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [aiExpanded, setAiExpanded] = useState(false);
  const [commentsExpanded, setCommentsExpanded] = useState(false);

  const socketRef = useRef(connectSocket());

  // =========================
  // LOAD VIDEO DATA
  // =========================
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      await fetchVideo(id);
      fetchVideos();
      fetchComments(id);
      fetchUserReaction(id);
      addView(id);
    };

    load();

    const socket = socketRef.current;
    if (!socket) return;

    socket.emit("join-video", id);

    socket.on("comment:new", () => fetchComments(id));
    socket.on("comment:reaction", () => fetchComments(id));
    socket.on("reaction:update", async () => await fetchVideo(id));

    return () => {
      socket.emit("leave-video", id);
      socket.off("comment:new");
      socket.off("reaction:update");
      socket.off("comment:reaction");
    };
  }, [id]);

  // =========================
  // SUBSCRIBE STATUS + COUNT
  // =========================
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
      } catch (err) {
        console.error(err);
      }
    };

    loadSubData();
  }, [video?.channel?._id]);

  // =========================
  // REALTIME SUBSCRIBERS
  // =========================
  useEffect(() => {
    if (!video?.channel?._id) return;

    const socket = socketRef.current;
    if (!socket) return;

    socket.emit("join-channel", video.channel._id);

    socket.on("channel:subscribers:update", (data) => {
      if (data.channelId === video.channel._id) {
        setSubscriberCount(data.count);
      }
    });

    return () => {
      socket.emit("leave-channel", video.channel._id);
      socket.off("channel:subscribers:update");
    };
  }, [video?.channel?._id]);

  // =========================
  // TIME FORMAT
  // =========================
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
      if (value >= 1) return `${value} ${key}${value > 1 ? "s" : ""} ago`;
    }
    return "just now";
  };

  // =========================
  // SUBSCRIBE ACTION
  // =========================
  const handleSubscribe = async () => {
    if (!video?.channel?._id || loadingSub) return;

    setLoadingSub(true);
    try {
      const res = await toggleSubscribe(video.channel._id);
      setSubscribed(res.data.subscribed);
      // subscriberCount updated via socket
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSub(false);
    }
  };

  // =========================
  // AUTO NEXT VIDEO
  // =========================
  const handleAutoNext = () => {
    if (!videos.length) return;

    const index = videos.findIndex((v) => v._id === video._id);
    const next = videos[index + 1];

    if (next?._id) navigate(`/video/${next._id}`);
  };

  const handleWatchTime = (time) => {
    if (!video?._id || time <= 0) return;
    updateWatchTime(video._id, time);
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    await createComment({ videoId: video._id, text: newComment });
    setNewComment("");
  };

  const videoSources = useMemo(() => ({ "720p": video?.videoUrl }), [video?.videoUrl]);

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="text-gray-400 font-medium">Initializing premium video feed...</p>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 lg:px-6 flex flex-col xl:flex-row gap-6">

      {/* LEFT SIDE */}
      <div className="w-full xl:w-[70%]">

        <div className="w-full aspect-video">
          <CustomPlayer
            autoPlay
            sources={videoSources}
            onEnd={handleAutoNext}
            onWatchTime={handleWatchTime}
          />
        </div>

        {/* MAIN VIDEO INFO */}
        <div className="flex flex-col gap-2">
          {/* COMMUNITY ALERTS */}
          {video.isFlagged && (
            <div className="w-full mt-4 bg-red-100/80 dark:bg-red-500/10 border border-red-500 dark:border-red-500/20 rounded-xl p-3 flex items-start gap-3">
              <AlertTriangle className="text-red-600 dark:text-red-500 shrink-0 w-5 h-5 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-800 dark:text-red-400 text-sm">Community Alert: Content Flagged</h3>
                <p className="text-xs text-red-700 dark:text-red-300/80 font-medium">
                  {video.flagReason || "This video contains potentially misleading or unverified information."}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mt-2">
            <h1 className="mt-1 text-lg sm:text-xl lg:text-2xl font-semibold">
              {video.title}
            </h1>
            {(!video.videoUrl || video.videoUrl === "") && (
              <div className="bg-amber-500/95 backdrop-blur-sm px-2 py-0.5 rounded text-white text-[11px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5 h-fit mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
                Processing
              </div>
            )}
            {video?.verification?.finalVerdict === "TRUE" && !video?.isFlagged && (
                <div className="bg-emerald-500/95 backdrop-blur-sm px-2 py-0.5 rounded text-white text-[11px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5 h-fit mt-1">
                   Verified
                </div>
              )}
              {video?.verification?.finalVerdict === "FALSE" && (
                <div className="bg-red-600/95 backdrop-blur-sm px-2 py-0.5 rounded text-white text-[11px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5 h-fit mt-1">
                   <AlertTriangle className="w-3 h-3" /> False info
                </div>
              )}
              {video?.isFlagged && (
                <div className="bg-red-500/95 backdrop-blur-sm px-2 py-0.5 rounded text-white text-[11px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5 h-fit mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  False Info
                </div>
              )}
          </div>

          <p className="text-xs sm:text-sm text-gray-500">
            {video.views} views • {formatTimeAgo(video.createdAt)}
          </p>
        </div>

        {/* AI VERIFICATION CONTEXT */}
        {video?.verification?.finalVerdict && video?.verification?.finalVerdict !== "UNKNOWN" && (
          <div className="mt-4 bg-white dark:bg-[#1a1a3a] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition flex items-start sm:items-center justify-between gap-4"
              onClick={() => setAiExpanded(!aiExpanded)}
            >
              <div className="flex items-start sm:items-center gap-3">
                {video.verification.finalVerdict === "TRUE" ? (
                  <div className="bg-emerald-100 dark:bg-emerald-500/20 p-2 rounded-full shrink-0">
                    <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                ) : video.verification.finalVerdict === "FALSE" ? (
                   <div className="bg-red-100 dark:bg-red-500/20 p-2 rounded-full shrink-0">
                    <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                ) : (
                  <div className="bg-yellow-100 dark:bg-yellow-500/20 p-2 rounded-full shrink-0">
                    <Info className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                )}
                
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-white uppercase text-sm">{video.verification.finalVerdict}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
                      AI Verified
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 max-w-2xl mt-0.5">
                    {video.verification.summary}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-gray-400">
                {aiExpanded ? <ChevronUp /> : <ChevronDown />}
              </div>
            </div>

            <AnimatePresence>
              {aiExpanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#15152b] space-y-4">
                    
                    {/* Deepfake & Trust Summary */}
                    <div className="grid grid-cols-2 gap-4 mt-3">
                       <div className="bg-white dark:bg-[#1a1a3a] p-3 rounded-xl border border-gray-100 dark:border-white/5">
                         <p className="text-xs text-gray-500 dark:text-gray-400">Trust Score</p>
                         <p className={`text-lg font-bold ${video.trustScore > 70 ? 'text-emerald-500' : video.trustScore > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                           {video.trustScore}/100
                         </p>
                       </div>
                       <div className="bg-white dark:bg-[#1a1a3a] p-3 rounded-xl border border-gray-100 dark:border-white/5">
                         <p className="text-xs text-gray-500 dark:text-gray-400">Deepfake Probability</p>
                         <p className="text-lg font-bold text-gray-900 dark:text-white">
                           {video.deepfakeScore ? (video.deepfakeScore * 100).toFixed(1) : 0}%
                         </p>
                       </div>
                    </div>

                    {video.verification.claims?.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-widest mt-2">Analyzed Claims</h4>
                        {video.verification.claims.map((claim, idx) => (
                           <div key={idx} className="p-3 bg-white dark:bg-[#1a1a3a] rounded-lg text-sm border-l-4 border-gray-300 dark:border-gray-600 mb-2">
                             <p className="font-semibold text-gray-900 dark:text-white mb-2">"{claim.text}"</p>
                             <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${claim.verdict === 'TRUE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : claim.verdict === 'FALSE' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'}`}>
                                  {claim.verdict}
                                </span>
                             </div>
                             {claim.explanation && <p className="text-gray-600 dark:text-gray-400 mt-2 text-xs">{claim.explanation}</p>}
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* DESCRIPTION */}
        <div 
          onClick={() => setDescExpanded(!descExpanded)}
          className="mt-3 bg-gray-100 dark:bg-[#1a1a2e] p-3 rounded-xl text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-[#23233b] transition-colors"
        >
          {descExpanded 
            ? video.description 
            : (video.description?.length > 120 ? video.description.slice(0, 120) + "..." : video.description)
          }
          {video.description?.length > 120 && (
             <p className="text-indigo-500 dark:text-indigo-400 font-semibold mt-2 text-xs">
               {descExpanded ? "Show less" : "Show more"}
             </p>
          )}
        </div>

        {/* CHANNEL */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4">

          <Link to={`/channel/${video.channel?.handle}`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                {video.channel?.avatar ? (
                  <img src={video.channel.avatar} alt={video.channel.name} className="w-full h-full object-cover" />
                ) : (
                  video.channel?.name?.charAt(0)?.toUpperCase()
                )}
              </div>
              <p className="text-sm sm:text-base font-medium">
                {video.channel?.name}
              </p>
            </div>
          </Link>

          <div className="flex flex-wrap gap-2 sm:gap-3 items-center">

           <SubscribeButton
  subscribed={subscribed}
  loading={loadingSub}
  onClick={handleSubscribe}
/>

{/* Like / Dislike buttons smoother */}
<ReactionButton
  type="LIKE"
  count={video.likesCount}
  active={liked}
  onClick={() => reactVideo({ videoId: video._id, type: "LIKE" })}
/>

<ReactionButton
  type="DISLIKE"
  count={video.dislikesCount}
  active={disliked}
  onClick={() => reactVideo({ videoId: video._id, type: "DISLIKE" })}
/>

          </div>
        </div>

        {/* COMMENTS */}
        <div className="mt-6 sm:mt-8">
          <div 
            onClick={() => setExpandAllComments(!expandAllComments)}
            className="flex items-center justify-between cursor-pointer mb-4 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1a2e] transition-colors"
          >
            <h2 className="text-base sm:text-lg font-semibold">
              {comments.length} Comments
            </h2>
            <span className="text-sm text-gray-500 dark:text-[#aaa8c6] font-medium">
              {expandAllComments ? "Hide Comments ▲" : "Show Comments ▼"}
            </span>
          </div>

          {expandAllComments && (
            <>

          {/* ADD COMMENT */}
          <div className="flex gap-3 mb-6 sm:mb-8">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-semibold">
              U
            </div>

            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a public comment..."
                className="w-full border-b border-gray-300 focus:border-black outline-none p-2 text-sm resize-none"
                rows={2}
              />
              <div className="flex justify-end mt-2 gap-2">
                <button
                  onClick={() => setNewComment("")}
                  className="px-3 py-1 text-sm rounded-full hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleComment}
                  className="px-3 py-1 text-sm rounded-full bg-indigo-500 text-white"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>

          {/* LIST */}
          <div className="space-y-5">
            {comments.map((c) => (
              <CommentItem key={c._id + JSON.stringify(c.reactions)} comment={c} />
            ))}
          </div>
            </>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full xl:w-[30%] space-y-4">
        {videos.map((v) => (
          <VideoCard key={v._id} video={v} />
        ))}
      </div>
    </div>
  );
};

export default VideoPages;
