import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
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
    fetchUserReaction
  } = useYT();

  const [newComment, setNewComment] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(null); // ✅ FIX
  const [loadingSub, setLoadingSub] = useState(false);

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
    socket.on("reaction:update", async () => {
      await fetchVideo(id);
    });

    return () => {
      socket.emit("leave-video", id);
      socket.off("comment:new");
      socket.off("reaction:update");
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

      // ✅ FIXED HERE
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
        setSubscriberCount(data.count); // ✅ always correct
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
      if (value >= 1) {
        return `${value} ${key}${value > 1 ? "s" : ""} ago`;
      }
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

    // ✅ ONLY update subscription state
    setSubscribed(res.data.subscribed);

    // ❌ DO NOT update subscriberCount here
    // Let socket or API control it

  } catch (err) {
    console.error(err);
  } finally {
    setLoadingSub(false);
  }
};



  // =========================
  // AUTO NEXT
  // =========================
  const handleAutoNext = () => {
    if (!videos.length) return;

    const index = videos.findIndex((v) => v._id === video._id);
    const next = videos[index + 1];

    if (next?._id) {
      navigate(`/video/${next._id}`);
    }
  };

  const handleWatchTime = (time) => {
    if (!video?._id) return;
    updateWatchTime(video._id, time);
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    await createComment({ videoId: video._id, text: newComment });
    setNewComment("");
  };

  if (!video || !video.videoUrl) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="px-2 sm:px-4 lg:px-6 flex flex-col xl:flex-row gap-6">

      {/* LEFT SIDE */}
      <div className="w-full xl:w-[70%]">

        <div className="w-full aspect-video">
          <CustomPlayer
            autoPlay
            sources={{ "720p": video.videoUrl }}
            onEnd={handleAutoNext}
            onWatchTime={handleWatchTime}
          />
        </div>

        <h1 className="mt-3 sm:mt-4 text-lg sm:text-xl lg:text-2xl font-semibold">
          {video.title}
        </h1>

        <p className="text-xs sm:text-sm text-gray-500">
          {video.views} views • {formatTimeAgo(video.createdAt)}
        </p>

        {/* DESCRIPTION */}
        <div className="mt-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-xl text-sm">
          {video.description?.slice(0, 120)}
        </div>

        {/* CHANNEL */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4">

          <Link to={`/channel/${video.channel?.handle}`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center">
                {video.channel?.name?.charAt(0)}
              </div>
              <p className="text-sm sm:text-base font-medium">
                {video.channel?.name}
              </p>
            </div>
          </Link>

          <div className="flex flex-wrap gap-2 sm:gap-3 items-center">

            {/* ✅ SAFE RENDER */}
            <SubscribeButton
              subscribed={subscribed}
              loading={loadingSub}
              onClick={handleSubscribe}
            />

            {/* LIKE */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.05 }}
              onClick={() =>
                reactVideo({ videoId: video._id, type: "LIKE" })
              }
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-full flex items-center gap-2 transition ${
                liked
                  ? "bg-indigo-500 text-white shadow-lg"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              👍 <span>{video.likesCount}</span>
            </motion.button>

            {/* DISLIKE */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.05 }}
              onClick={() =>
                reactVideo({ videoId: video._id, type: "DISLIKE" })
              }
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-full flex items-center gap-2 transition ${
                disliked
                  ? "bg-red-500 text-white shadow-lg"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              👎 <span>{video.dislikesCount}</span>
            </motion.button>

          </div>
        </div>

        {/* COMMENTS */}
        <div className="mt-6 sm:mt-8">
          <h2 className="text-base sm:text-lg font-semibold mb-4">
            {comments.length} Comments
          </h2>

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
              <CommentItem key={c._id} comment={c} />
            ))}
          </div>
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
