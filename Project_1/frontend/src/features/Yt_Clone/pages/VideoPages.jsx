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
    <div className="px-2 sm:px-4 lg:px-6 flex flex-col xl:flex-row gap-6">

      {/* LEFT SIDE */}
      <div className="w-full xl:w-[70%]">

        <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative group">
          {video.videoUrl ? (
            <CustomPlayer
              autoPlay
              sources={videoSources}
              onEnd={handleAutoNext}
              onWatchTime={handleWatchTime}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a1a] text-center p-6">
                <p className="text-white font-bold">Video not available</p>
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

          <p className="text-xs sm:text-sm text-gray-500">
            {video.views} views • {formatTimeAgo(video.createdAt)}
          </p>
        </div>

        {/* AI CONTEXT */}
        {video?.verification?.finalVerdict && video?.verification?.finalVerdict !== "UNKNOWN" && (
          <div className="mt-4 bg-white dark:bg-[#1a1a3a] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition flex items-center justify-between gap-4"
              onClick={() => setAiExpanded(!aiExpanded)}
            >
              <div className="flex items-center gap-3">
                {video.verification.finalVerdict === "TRUE" ? (
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-red-500" />
                )}
                <div>
                  <span className="font-bold text-sm uppercase">{video.verification.finalVerdict} Verdict</span>
                  <p className="text-sm text-gray-500">{video.verification.summary}</p>
                </div>
              </div>
              <div className="shrink-0 text-gray-400">
                {aiExpanded ? <ChevronUp /> : <ChevronDown />}
              </div>
            </div>
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
