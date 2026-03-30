import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import VideoCard from "../components/video/VideoCard";
import CustomPlayer from "../components/CustomVideoPlayer";
import { useYT } from "../hook/useYT.js";
import { connectSocket } from "../services/socketIO.service.js";
import {
  toggleSubscribe,
  isSubscribed,
  addView,
  updateWatchTime
} from "../services/ytapi.service";

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
const [loadingSub, setLoadingSub] = useState(false);

// GET STATUS
useEffect(() => {
  if (!video?.channel?._id) return;

  const loadSub = async () => {
    const res = await isSubscribed(video.channel._id);
    setSubscribed(res.data.subscribed);
  };

  loadSub();
}, [video]);

  // 🔥 LOAD DATA
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      await fetchVideo(id);
      fetchVideos();
      fetchComments(id);
      fetchUserReaction(id);
      addView(id); // 🔥 VIEW COUNT
    };

    load();

    const socket = connectSocket();
    socket.emit("join_video", id);

    socket.on("comment:new", () => fetchComments(id));
    socket.on("reaction:update", async () => {
      await fetchVideo(id);
    });

    

    return () => {
      socket.emit("leave_video", id);
      socket.off("comment:new");
      socket.off("reaction:update");
    };
  }, [id]);

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


  // 🔔 SUBSCRIBE
  useEffect(() => {
    if (!video?.channel?._id) return;

    isSubscribed(video.channel._id).then((res) => {
      setSubscribed(res.data.subscribed);
    });
  }, [video]);


  // ▶️ AUTO NEXT FIXED
  const handleAutoNext = () => {
    if (!videos.length) return;

    const index = videos.findIndex(v => v._id === video._id);
    const next = videos[index + 1];

    if (next?._id) {
      navigate(`/video/${next._id}`);
    }
  };

  // ⏱ WATCH TIME
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

  // TOGGLE
const handleSubscribe = async () => {
  if (!video?.channel?._id || loadingSub) return;

  setLoadingSub(true);
  try {
    const res = await toggleSubscribe(video.channel._id);
    setSubscribed(res.data.subscribed); // ✅ REAL VALUE
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingSub(false);
  }
};

  return (
    <div className="flex flex-col lg:flex-row gap-6">

      <div className="w-full lg:w-[70%]">
<CustomPlayer
  autoPlay
  sources={{
    "720p": video.videoUrl   // ✅ minimum fix
  }}
  onEnd={handleAutoNext}
  onWatchTime={handleWatchTime}
/>

        <h1 className="mt-4 text-xl font-semibold">{video.title}</h1>

<p className="text-sm text-gray-500">
  {video.views} views • {formatTimeAgo(video.createdAt)}
</p>

{/* 🔥 DESCRIPTION */}
<div className="mt-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">
  <p className="text-sm whitespace-pre-line">
    {video.description?.slice(0, 120)}
  </p>

  {video.description?.length > 120 && (
    <button className="text-indigo-500 text-sm mt-1">
      Show more
    </button>
  )}
</div>

        <div className="flex justify-between mt-4 items-center">

          <Link to={`/channel/${video.channel?.handle}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center">
                {video.channel?.name?.charAt(0)}
              </div>
              <p>{video.channel?.name}</p>
            </div>
          </Link>

          <div className="flex gap-3 items-center">
            <button
              onClick={handleSubscribe}
              disabled={loadingSub}
              className={`px-4 py-2 rounded-full transition ${
                subscribed
                  ? "bg-gray-300"
                  : "bg-red-500 text-white"
              }`}
            >
              {loadingSub
                ? "Loading..."
                : subscribed
                ? "Subscribed"
                : "Subscribe"}
            </button>

            <button
              onClick={() =>
                reactVideo({ videoId: video._id, type: "LIKE" })
              }
              className={liked ? "bg-indigo-500 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}
            >
              👍 {video.likesCount}
            </button>

            <button
              onClick={() =>
                reactVideo({ videoId: video._id, type: "DISLIKE" })
              }
              className={disliked ? "bg-red-500 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}
            >
              👎 {video.dislikesCount}
            </button>

          </div>
        </div>

       {/* COMMENTS */}
<div className="mt-8">

  <h2 className="text-lg font-semibold mb-4">
    {comments.length} Comments
  </h2>

  {/* ADD COMMENT */}
  <div className="flex gap-3 mb-6">
    <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-semibold">
      U
    </div>

    <div className="flex-1">
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
        className="w-full border-b border-gray-400 focus:outline-none focus:border-indigo-500 resize-none p-2 bg-transparent"
        rows={2}
      />

      <div className="flex justify-end mt-2 gap-2">
        <button
          onClick={() => setNewComment("")}
          className="px-4 py-1 rounded-full text-sm text-gray-500 cursor-pointer hover:bg-gray-200 hover:text-gray-800"
        >
          Cancel
        </button>

        <button
          onClick={handleComment}
          className="bg-indigo-500 cursor-pointer hover:bg-indigo-900 text-white px-4 py-1 rounded-full text-sm hover:text-gray-200"
        >
          Comment
        </button>
      </div>
    </div>
  </div>

  {/* COMMENTS LIST */}
  {comments.length === 0 ? (
    <p className="text-gray-500">No comments yet</p>
  ) : (
    comments.map((c) => (
      <div key={c._id} className="flex gap-3 mb-6">

        {/* Avatar */}
        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold">
          {c.user?.username?.charAt(0)?.toUpperCase() || "U"}
        </div>

        {/* Content */}
        <div className="flex-1">

          {/* Header */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">
              {c.user?.username || "User"}
            </span>

            <span className="text-gray-500">
              {formatTimeAgo(c.createdAt)}
            </span>
          </div>

          {/* Text */}
          <p className="mt-1 text-sm leading-relaxed">
            {c.text}
          </p>

        </div>
      </div>
    ))
  )}
</div>

      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-[30%] space-y-4">
        {videos.map((v) => (
          <VideoCard key={v._id} video={v} />
        ))}
      </div>

    </div>
  );
};

export default VideoPages;
