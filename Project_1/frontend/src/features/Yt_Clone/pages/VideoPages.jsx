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
          src={video.videoUrl}
          onEnd={handleAutoNext}
          onWatchTime={handleWatchTime}
        />

        <h1 className="mt-4 text-xl font-semibold">{video.title}</h1>

        <p className="text-sm text-gray-500">
          {video.views} views
        </p>

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
        <div className="mt-6">
          <h2>{comments.length} Comments</h2>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border p-2"
          />

          <button onClick={handleComment} className="bg-indigo-500 text-white px-4 py-2 mt-2">
            Comment
          </button>

          {comments.map((c) => (
            <div key={c._id} className="flex gap-3 mt-4">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white">
                {c.user?.username?.charAt(0)}
              </div>
              <div>
                <p>{c.user?.username}</p>
                <p>{c.text}</p>
              </div>
            </div>
          ))}
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
