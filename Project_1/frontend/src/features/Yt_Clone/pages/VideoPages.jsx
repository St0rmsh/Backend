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
import TrustMeter from "../components/UI/TrustMeter.jsx";
import { useTheme } from "../context/ThemeContext";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

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
        <p className="text-gray-400 font-medium">Loading video...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 flex flex-col xl:flex-row gap-8">

      {/* LEFT SIDE */}
      <div className="w-full xl:w-[68%] flex flex-col gap-6">

        <div className="w-full rounded-3xl overflow-hidden glass shadow-2xl relative group">
          {video.videoUrl ? (
            <CustomPlayer
              autoPlay
              sources={videoSources}
              onEnd={handleAutoNext}
              onWatchTime={handleWatchTime}
              videoData={video}
            />
          ) : (
            <div className="aspect-video flex flex-col items-center justify-center bg-surface-low text-center p-6">
              <p className="text-main font-bold">The curator is preparing the signal...</p>
            </div>
          )}
        </div>

        {/* MAIN VIDEO INFO */}
        <div className="flex flex-col gap-2">
          {video.isFlagged && (
            <div className="w-full mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3">
              <AlertTriangle className="text-red-500 shrink-0 w-5 h-5 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-400 text-sm">Community Alert</h3>
                <p className="text-xs text-red-300/80">
                  {video.flagReason || "Flagged content detected."}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mt-2">
            <h1 className="mt-1 text-lg sm:text-xl lg:text-2xl font-semibold">
              {video.title}
            </h1>
            {video?.verification?.finalVerdict === "TRUE" && (
              <div className="bg-emerald-500/95 px-2 py-0.5 rounded text-white text-[11px] font-bold uppercase h-fit mt-1">
                Verified
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-xs sm:text-sm text-main/50 font-bold uppercase tracking-widest shrink-0">
              {video.views.toLocaleString()} views • {formatTimeAgo(video.createdAt)}
            </p>
            <div className="flex gap-2 items-center sm:hidden">
              <SubscribeButton subscribed={subscribed} loading={loadingSub} onClick={handleSubscribe} small />
            </div>
          </div>
        </div>

        {/* AI TRUST HUB (NEW) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {video?.verification?.finalVerdict && video.verification.finalVerdict !== "UNKNOWN" && (
            <TrustMeter score={video.trustScore || 0.8} type="trust" />
          )}
          {video?.deepfakeScore > 0.1 && (
            <TrustMeter score={video.deepfakeScore} type="ai" />
          )}
        </div>

        {/* AI VERIFICATION HUB */}
        {video?.verification?.summary && (
          <div className="glass-heavy rounded-3xl overflow-hidden border border-white/5">
            <div
              className="p-5 cursor-pointer hover:bg-white/5 transition flex items-center justify-between gap-4"
              onClick={() => setAiExpanded(!aiExpanded)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${video.verification.finalVerdict === 'TRUE' ? 'bg-brand-emerald/10 text-brand-emerald' : 'bg-brand-crimson/10 text-brand-crimson'}`}>
                  {video.verification.finalVerdict === "TRUE" ? (
                    <ShieldCheck className="w-6 h-6 ai-glow-emerald" />
                  ) : (
                    <ShieldAlert className="w-6 h-6 ai-glow-crimson" />
                  )}
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs uppercase tracking-widest text-main">
                    Veracity Summary: <span className={video.verification.finalVerdict === 'TRUE' ? 'text-brand-emerald' : 'text-brand-crimson'}>{video.verification.finalVerdict}</span>
                  </h4>
                  <p className="text-sm text-main/60 font-medium mt-1 line-clamp-1">{video.verification.summary}</p>
                </div>
              </div>
              <motion.div animate={{ rotate: aiExpanded ? 180 : 0 }}>
                <ChevronDown className="text-muted" />
              </motion.div>
            </div>

            <AnimatePresence>
              {aiExpanded && (
                <motion.div
                  initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                  className="px-5 pb-5 border-t border-main"
                >
                  <div className="pt-4 space-y-4">
                    <p className="text-sm leading-relaxed text-main font-medium">{video.verification.summary}</p>

                    {video.verification.claims?.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-main/60 border-b border-main pb-2">Key Fact Checks</p>
                        {video.verification.claims.map((claim, idx) => (
                          <div key={idx} className="flex gap-3 items-start p-3 bg-white/5 rounded-2xl">
                            {claim.verdict === 'TRUE' ? <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-brand-crimson shrink-0 mt-0.5" />}
                            <div>
                              <p className="text-xs font-bold text-main">{claim.text}</p>
                              <p className="text-[10px] text-main/50 mt-1 leading-normal italic">{claim.explanation}</p>
                            </div>
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
          className="mt-3 bg-gray-100 dark:bg-[#1a1a2e] p-3 rounded-xl text-sm cursor-pointer"
        >
          {descExpanded ? video.description : video.description?.slice(0, 120) + "..."}
        </div>

        {/* CHANNEL */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4">
          <Link to={`/channel/${video.channel?.handle}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center overflow-hidden">
                {video.channel?.avatar ? (
                  <img src={video.channel.avatar} className="w-full h-full object-cover" />
                ) : (
                  video.channel?.name?.charAt(0)
                )}
              </div>
              <p className="text-sm sm:text-base font-medium">{video.channel?.name}</p>
            </div>
          </Link>

          <div className="flex gap-2 items-center">
            <SubscribeButton subscribed={subscribed} loading={loadingSub} onClick={handleSubscribe} />
            <ReactionButton type="LIKE" count={video.likesCount} active={liked} onClick={() => reactVideo({ videoId: video._id, type: "LIKE" })} />
            <ReactionButton type="DISLIKE" count={video.dislikesCount} active={disliked} onClick={() => reactVideo({ videoId: video._id, type: "DISLIKE" })} />
          </div>
        </div>

        {/* COMMENTS */}
        <div className="mt-8">
          <div onClick={() => setExpandAllComments(!expandAllComments)} className="flex items-center justify-between cursor-pointer mb-4">
            <h2 className="text-lg font-semibold">{comments.length} Comments</h2>
            <span className="text-sm text-gray-500">{expandAllComments ? "Hide ▲" : "Show ▼"}</span>
          </div>

          {expandAllComments && (
            <>
              <div className="flex gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-semibold">U</div>
                <div className="flex-1">
                  <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="w-full border-b border-gray-300 outline-none p-2 text-sm" rows={1} />
                  <div className="flex justify-end mt-2 gap-2">
                    <button onClick={() => setNewComment("")} className="px-3 py-1 text-sm rounded-full hover:bg-gray-200">Cancel</button>
                    <button onClick={handleComment} className="px-3 py-1 text-sm rounded-full bg-indigo-500 text-white">Comment</button>
                  </div>
                </div>
              </div>
              <div className="space-y-5">
                {comments.map((c) => (
                  <CommentItem key={c._id} comment={c} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="w-full xl:w-[30%] space-y-4">
        {videos.map((v) => (
          <VideoCard key={v._id} video={v} />
        ))}
      </div>
    </div>
  );
};

export default VideoPages;
