import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getChannelByHandle,
  getChannelVideos,
  toggleSubscribe,
  isSubscribed,
} from "../services/ytapi.service";
import { connectSocket } from "../services/socketIO.service";
import SubscribeButton from "../components/SubscribeButton";
import { Play, Eye, Calendar, Users, VideoIcon, Bell } from "lucide-react";

// ─── Fallbacks ────────────────────────────────────────────
const FALLBACK_BANNER =
  "https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=1400&q=80";
const FALLBACK_AVATAR = (name = "U") =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=200`;

// ─── Helper ───────────────────────────────────────────────
const formatCount = (n = 0) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return `${n}`;
};

const timeAgo = (date) => {
  if (!date) return "";
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
  return `${Math.floor(diff / 31536000)}y ago`;
};

// ─── Video Card ───────────────────────────────────────────
const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  return (
    <div
      className="group cursor-pointer"
      onClick={() => navigate(`/video/${video._id}`)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-[#1c1c3a] mb-3">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${hover ? "scale-105" : "scale-100"}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <VideoIcon className="w-10 h-10 text-gray-400 dark:text-gray-600" />
          </div>
        )}

        {/* Play Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hover ? "opacity-100" : "opacity-0"}`}>
          <div className="w-12 h-12 rounded-full bg-indigo-500/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Duration badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded font-mono">
            {video.duration}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-1">
        <h3 className="font-semibold text-gray-900 dark:text-[#e5e3ff] line-clamp-2 text-sm leading-snug mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {video.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-[#aaa8c6]">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {formatCount(video.views)} views
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {timeAgo(video.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────
const Skeleton = () => (
  <div className="animate-pulse">
    {/* Banner */}
    <div className="w-full h-48 md:h-64 bg-gray-200 dark:bg-[#1c1c3a]" />
    {/* Header */}
    <div className="px-6 mt-4 flex gap-4 items-center">
      <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-[#222242] shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="h-6 w-48 bg-gray-300 dark:bg-[#222242] rounded" />
        <div className="h-4 w-32 bg-gray-200 dark:bg-[#1c1c3a] rounded" />
      </div>
    </div>
    {/* Grid */}
    <div className="px-6 mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="space-y-2">
          <div className="aspect-video rounded-xl bg-gray-200 dark:bg-[#1c1c3a]" />
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-[#1c1c3a]" />
          <div className="h-3 w-1/2 rounded bg-gray-100 dark:bg-[#171732]" />
        </div>
      ))}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────
const ChannelPage = () => {
  const { handle } = useParams();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bannerError, setBannerError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // ===== FETCH DATA =====
  useEffect(() => {
    if (!handle) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          getChannelByHandle(handle),
          getChannelVideos(handle),
        ]);
        setChannel(res1.data.channel);
        setVideos(res2.data.videos || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [handle]);

  // ===== SOCKET UPDATES =====
  useEffect(() => {
    if (!channel?._id) return;

    const socket = connectSocket();

    // Join channel room
    socket.emit("join-channel", channel._id);

    // Listen for subscriber updates
    const handleSubUpdate = (data) => {
      if (data.channelId === channel._id) {
        setChannel((prev) => ({ ...prev, subscribersCount: data.count }));
      }
    };

    // Listen for views updates
    const handleViewsUpdate = (data) => {
      if (data.channelId === channel._id) {
        setChannel((prev) => ({ ...prev, totalViews: data.totalViews }));
      }
    };

    socket.on("channel:subscribers:update", handleSubUpdate);
    socket.on("channel:views:update", handleViewsUpdate);

    return () => {
      socket.emit("leave-channel", channel._id);
      socket.off("channel:subscribers:update", handleSubUpdate);
      socket.off("channel:views:update", handleViewsUpdate);
    };
  }, [channel?._id]);

  // ===== CHECK SUB =====
  useEffect(() => {
    if (!channel?._id) return;

    const loadSub = async () => {
      try {
        const res = await isSubscribed(channel._id);
        setSubscribed(res.data.subscribed);
      } catch (err) {
        console.error(err);
      }
    };

    loadSub();
  }, [channel]);

  const handleSubscribe = async () => {
    if (!channel?._id || loadingSub) return;
    setLoadingSub(true);
    try {
      const res = await toggleSubscribe(channel._id);
      setSubscribed(res.data.subscribed);
      if (res.data.subscribersCount !== undefined) {
         setChannel((prev) => ({ ...prev, subscribersCount: res.data.subscribersCount }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSub(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-[#0c0c22]">
      <Skeleton />
    </div>
  );

  if (!channel) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0c0c22]">
      <p className="text-gray-500 dark:text-[#aaa8c6] text-lg">Channel not found.</p>
    </div>
  );

  const bannerSrc = !bannerError && channel.banner ? channel.banner : FALLBACK_BANNER;
  const avatarSrc = !avatarError && channel.avatar
    ? channel.avatar
    : FALLBACK_AVATAR(channel.name || channel.handle);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0c22] text-gray-900 dark:text-[#e5e3ff] transition-colors duration-300">

      {/* ═══════════════ BANNER ═══════════════ */}
      <div className="relative w-full h-44 md:h-60 lg:h-72 overflow-hidden">
        <img
          src={bannerSrc}
          alt="Channel Banner"
          onError={() => setBannerError(true)}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-white dark:from-[#0c0c22] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-indigo-600/20 to-purple-600/20 mix-blend-multiply" />
      </div>

      {/* ═══════════════ CHANNEL HEADER ═══════════════ */}
      <div className="px-4 md:px-8 -mt-10 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">

          {/* Avatar */}
          <div className="shrink-0">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full ring-4 ring-white dark:ring-[#0c0c22] overflow-hidden shadow-2xl shadow-indigo-500/20">
              <img
                src={avatarSrc}
                alt={channel.name}
                onError={() => setAvatarError(true)}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info + actions */}
          <div className="flex-1 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">

            {/* Channel info */}
            <div>
              {/* ✅ CHANNEL NAME - always visible */}
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-[#e5e3ff] leading-tight">
                {channel.name || channel.handle || "Unknown Channel"}
              </h1>
              <p className="text-sm text-indigo-500 dark:text-indigo-400 font-medium mt-0.5">
                @{channel.handle}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-4 mt-2.5">
                <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-[#aaa8c6]">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold text-gray-900 dark:text-[#e5e3ff]">
                    {formatCount(channel.subscribersCount)}
                  </span>
                  subscribers
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-[#aaa8c6]">
                  <VideoIcon className="w-4 h-4" />
                  <span className="font-semibold text-gray-900 dark:text-[#e5e3ff]">
                    {formatCount(channel.videosCount ?? videos.length)}
                  </span>
                  videos
                </span>
                {channel.totalViews != null && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-[#aaa8c6]">
                    <Eye className="w-4 h-4" />
                    <span className="font-semibold text-gray-900 dark:text-[#e5e3ff]">
                      {formatCount(channel.totalViews)}
                    </span>
                    views
                  </span>
                )}
              </div>
            </div>

            {/* Subscribe */}
            <SubscribeButton
              subscribed={subscribed}
              loading={loadingSub}
              onClick={handleSubscribe}
              subscriberCount={channel.subscribersCount}
            />
          </div>
        </div>

        {/* Description */}
        {channel.description && (
          <div className="mt-4 max-w-2xl">
            <p className="text-sm text-gray-600 dark:text-[#aaa8c6] leading-relaxed">
              {channel.description}
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="mt-6 h-px bg-linear-to-r from-indigo-500/30 via-purple-500/20 to-transparent" />
      </div>

      {/* ═══════════════ VIDEOS SECTION ═══════════════ */}
      <div className="px-4 md:px-8 mt-6 pb-12">

        {/* Section header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 rounded-full bg-linear-to-b from-indigo-500 to-purple-500" />
          <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-[#e5e3ff]">
            Videos
          </h2>
          {videos.length > 0 && (
            <span className="ml-1 text-xs bg-indigo-500/15 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full px-2.5 py-0.5 font-semibold">
              {videos.length}
            </span>
          )}
        </div>

        {/* Grid */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {videos.map((v) => (
              <VideoCard key={v._id} video={v} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/15 flex items-center justify-center mb-4">
              <VideoIcon className="w-8 h-8 text-indigo-400" />
            </div>
            <p className="text-lg font-semibold text-gray-700 dark:text-[#e5e3ff]">No videos yet</p>
            <p className="text-sm text-gray-500 dark:text-[#aaa8c6] mt-1">
              This channel hasn't uploaded any videos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelPage;
