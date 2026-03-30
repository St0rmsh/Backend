import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getChannelByHandle,
  getChannelVideos,
  toggleSubscribe,
  isSubscribed
} from "../services/ytapi.service";
import VideoCard from "../components/video/VideoCard";

const ChannelPage = () => {
  const { handle } = useParams();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);

  // FETCH CHANNEL + VIDEOS
  useEffect(() => {
    if (!handle) return;

    const fetchData = async () => {
      try {
        const res1 = await getChannelByHandle(handle);
        const res2 = await getChannelVideos(handle);

        setChannel(res1.data.channel);
        setVideos(res2.data.videos);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [handle]);

  // CHECK SUBSCRIBE
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

  // TOGGLE
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

  if (!channel) return <p>Loading...</p>;

  return (
    <div className="p-4">

      <div className="w-full h-48 bg-gray-300 rounded-xl mb-6"></div>

      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="w-20 h-20 bg-indigo-500 text-white rounded-full flex items-center justify-center text-2xl">
            {channel.name?.charAt(0)}
          </div>

          <div>
            <h1 className="text-2xl font-bold">{channel.name}</h1>
            <p className="text-gray-500">@{channel.handle}</p>
          </div>
        </div>

        {/* ✅ FIXED BUTTON */}
        <button
          onClick={handleSubscribe}
          disabled={loadingSub}
          className={`px-6 py-2 rounded-full transition ${
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {videos.map((v) => (
          <VideoCard key={v._id} video={v} />
        ))}
      </div>
    </div>
  );
};

export default ChannelPage;
