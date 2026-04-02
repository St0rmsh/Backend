import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getChannelByHandle,
  getChannelVideos,
  toggleSubscribe,
  isSubscribed
} from "../services/ytapi.service";

import VideoCard from "../components/video/VideoCard";
import SubscribeButton from "../components/SubscribeButton";

const FALLBACK_BANNER =
  "https://via.placeholder.com/1200x300?text=Channel+Banner";

const FALLBACK_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=random";

const ChannelPage = () => {
  const { handle } = useParams();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);

  // ===== FETCH DATA =====
  useEffect(() => {
    if (!handle) return;

    const fetchData = async () => {
      try {
        const res1 = await getChannelByHandle(handle);
        const res2 = await getChannelVideos(handle);

        setChannel(res1.data.channel);
        setVideos(res2.data.videos || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [handle]);

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

  // ===== TOGGLE SUB =====
  const handleSubscribe = async () => {
    if (!channel?._id || loadingSub) return;

    setLoadingSub(true);
    try {
      const res = await toggleSubscribe(channel._id);
      setSubscribed(res.data.subscribed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSub(false);
    }
  };

  if (!channel) return <p className="p-4">Loading...</p>;

  return (
    <div className="w-full">

      {/* ===== BANNER ===== */}
      <div className="w-full h-40 md:h-48 lg:h-56 overflow-hidden">
        <img
          src={channel.banner || FALLBACK_BANNER}
          alt="banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ===== HEADER ===== */}
      <div className="px-4 md:px-6 mt-4">

        <div className="flex justify-between items-center flex-wrap gap-4">

          {/* LEFT */}
          <div className="flex gap-4 items-center">

            {/* AVATAR */}
            <img
              src={channel.avatar || FALLBACK_AVATAR}
              alt="avatar"
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
            />

            {/* INFO */}
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                {channel.name}
              </h1>

              <p className="text-gray-500 text-sm">
                @{channel.handle}
              </p>

              
            </div>
          </div>

          {/* ✅ CUSTOM SUBSCRIBE BUTTON */}
          <SubscribeButton
            subscribed={subscribed}
            loading={loadingSub}
            onClick={handleSubscribe}
            subscriberCount={channel.subscribersCount}
          />
        </div>

        {/* DESCRIPTION */}
        {channel.description && (
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            {channel.description}
          </p>
        )}
      </div>

      {/* ===== VIDEOS ===== */}
      <div className="px-4 md:px-6 mt-6">

        <h2 className="text-lg font-semibold mb-4">
          Videos
        </h2>

        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          gap-5
        ">
          {videos.length > 0 ? (
            videos.map((v) => (
              <VideoCard 
                key={v._id} 
                video={v} 
                hideChannel={true}
              />
            ))
          ) : (
            <p className="text-gray-500">No videos yet</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default ChannelPage;
